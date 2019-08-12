import { UserExtendDto } from './user.extend.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserExtendDto extends UserExtendDto {}
