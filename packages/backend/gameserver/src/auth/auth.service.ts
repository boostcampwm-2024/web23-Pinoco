import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface GuestCredentials {
  userId: string;
  password: string;
}

@Injectable()
export class AuthService {
  private guestSessions: Map<string, string> = new Map();
  private guestCounter: number = 1;

  guestLogin(): GuestCredentials {
    const userId = `게스트_${this.guestCounter++}`;
    const password = uuidv4();

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
