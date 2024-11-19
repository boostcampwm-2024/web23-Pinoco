import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'http://localhost:5173',
          'https://localhost:5173',
          'http://pinoco.site',
          'https://pinoco.site',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://pinoco.site',
      'https://pinoco.site',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['content-type', 'Authorization'],
  });

  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
