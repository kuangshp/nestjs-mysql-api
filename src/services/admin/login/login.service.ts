import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LoginDto } from '@src/controllers/admin/system/login/dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ToolsService } from '@src/services/tools/tools.service';
import { AccountEntity } from '@src/entities/model/system/account.entity';

@Injectable()
export class LoginService {
  constructor (
    @InjectRepository(AccountEntity)
    private readonly userRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
  ) { }

  async adminLogin(loginDto: LoginDto): Promise<any> {
    try {
      const { username, password } = loginDto;
      const user = await this.userRepository.findOne({ where: { username, isDel: 0 } });
      if (user && this.toolsService.checkPassword(password, user.password)) {
        return user.toResponseObject();
      } else {
        throw new HttpException('请检查你的用户名与密码', HttpStatus.OK);
      }
    } catch (e) {
      Logger.log(e, 'userServiceLogin');
      throw new HttpException('请检查你的用户名与密码', HttpStatus.OK);
    }
  }
}
