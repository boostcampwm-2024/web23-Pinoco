import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  //로그인 되어있는 유저들 세션 저장해야 할수도 있음

  guestLogin(): { userId: string; password: string } {
    const userId = uuidv4();
    const password = '123';

    return { userId, password };
  }

  isValidGuest(userId: string, password: string): boolean {
    //db에서 userId와 password 확인해서 검증
    return true;
  }
}
