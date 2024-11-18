export declare class GameService {
    private games;
    startGame(gsid: string): Promise<void>;
    isGameStarted(gsid: string): Promise<boolean>;
    endGame(gsid: string): Promise<void>;
}
