import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private guestSessions: Map<string, string> = new Map();
  private userCounters: Map<string, number> = new Map();

  guestLogin(requestedUserId: string): { userId: string; password: string } {
    let userId = requestedUserId;

    // 이미 존재하는 userId인 경우 카운터를 증가시켜 새로운 userId 생성
    if (this.guestSessions.has(userId)) {
      const counter = (this.userCounters.get(requestedUserId) || 1) + 1;
      this.userCounters.set(requestedUserId, counter);
      userId = `${requestedUserId}_${counter}`;
    }

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
