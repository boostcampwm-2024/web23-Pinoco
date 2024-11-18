export declare class AuthService {
    private userSession;
    guestLogin(): {
        userId: string;
        usid: string;
    };
    isValidGuest(usid: string): boolean;
}
