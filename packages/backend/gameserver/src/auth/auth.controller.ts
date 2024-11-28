import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('guest-login')
  guestLogin(@Query('userId') userId: string): {
    userId: string;
    password: string;
  } {
    return this.authService.guestLogin(userId || '게스트');
  }
}
