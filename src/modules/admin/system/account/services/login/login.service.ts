import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  async login():Promise<string> {
    return '登录成功';
  }
}
