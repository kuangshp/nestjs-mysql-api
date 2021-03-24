import { Controller, UseGuards, Post, HttpStatus, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import adminConfig from '@src/config/admin.config';
import { AccessService } from '../../services/access/access.service';
import { CreateAccessDto } from './dto/create.access.dto';

@ApiTags('后台管理系统-资源管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/access`)
export class AccessController {
  constructor (
    private readonly accessService: AccessService
  ) { }

  @ApiOperation({ summary: '创建资源', description: '创建资源' })
  @ApiCreatedResponse({
    type: CreateAccessDto,
    description: '创建资源DTO'
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccess(
    @Body() createAccessDto: CreateAccessDto
  ): Promise<string> {
    return await this.accessService.createAccess(createAccessDto);
  }
}
