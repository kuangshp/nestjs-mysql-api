import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserExtendEntity } from './user.extend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserExtendEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
