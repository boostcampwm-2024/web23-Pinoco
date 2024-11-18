import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    guestLogin(): {
        userId: string;
        password: string;
    };
}
