import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('guest-login')
  guestLogin(): { userId: string; password: string } {
    return this.authService.guestLogin();
  }
}
