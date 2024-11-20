import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface GuestCredentials {
  userId: string;
  password: string;
}

@Injectable()
export class AuthService {
  private guestSessions: Map<string, string> = new Map();

  guestLogin(): GuestCredentials {
    const userId = uuidv4();
    const password = '123';

    this.guestSessions.set(userId, password);
    return { userId, password };
  }

  isValidGuest(userId: string, password: string): boolean {
    return this.guestSessions.get(userId) === password;
  }

  removeGuestSession(userId: string): void {
    this.guestSessions.delete(userId);
  }
}
