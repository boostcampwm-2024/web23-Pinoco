export declare class AuthService {
    guestLogin(): {
        userId: string;
        password: string;
    };
    isValidGuest(userId: string, password: string): boolean;
}
