import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private userSession = new Map<string, boolean>();

  guestLogin(): { userId: string; usid: string } {
    const usid = uuidv4();
    const userId = `guest_${usid.substring(0, 4)}`;
    this.userSession.set(usid, true);

    return { userId, usid };
  }

  isValidGuest(usid: string): boolean {
    return this.userSession.has(usid);
  }
}
