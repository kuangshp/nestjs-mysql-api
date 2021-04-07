import {
  Controller,
  UseGuards,
  Post,
  HttpStatus,
  Body,
  HttpCode,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import adminConfig from '@src/config/admin.config';
import { AccessService } from '../../services/access/access.service';
import { CreateAccessDto } from './dto/create.access.dto';
import { UpdateAccessDto } from './dto/update.access.dto';
import { AccessResDto, AccessListResDtoDto } from './dto/access.res.dto';
import { AccessReqDto } from './dto/access.req.dto';
import { ApiAuth } from '@src/decorators/api.auth';

@ApiTags('后台管理系统-资源管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller(`${adminConfig.adminPath}/access`)
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @ApiOperation({ summary: '创建资源', description: '创建资源' })
  @ApiCreatedResponse({
    type: String,
    description: '创建资源返回值',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccess(@Body() createAccessDto: CreateAccessDto): Promise<string> {
    return await this.accessService.createAccess(createAccessDto);
  }

  @ApiOperation({ summary: '删除资源', description: '根据资源ID删除资源' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async destroyAccessById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.accessService.destroyAccessById(id);
  }

  @ApiOperation({ summary: '修改资源', description: '根据资源ID修改资源' })
  @ApiCreatedResponse({
    type: String,
    description: '修改资源的返回值',
  })
  @Patch(':id')
  async modifyAccessById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAccessDto: UpdateAccessDto,
  ): Promise<string> {
    return await this.accessService.modifyAccessById(id, updateAccessDto);
  }

  @ApiOperation({
    summary: '获取菜单',
    description: '获取全部的菜单(不分页,给角色分配资源使用)',
  })
  @ApiCreatedResponse({
    type: AccessResDto,
    isArray: true,
    description: '获取全部菜单返回DTO',
  })
  @HttpCode(HttpStatus.OK)
  @Get('access_list')
  async accessList(): Promise<AccessResDto[]> {
    return await this.accessService.accessList();
  }

  @ApiOperation({
    summary: '获取资源列表',
    description: '分页获取资源列表(顶层的)',
    externalDocs: {
      url: 'xxx?pageSize=10&pageNumber=1',
    },
  })
  @ApiCreatedResponse({
    type: AccessResDto,
    isArray: true,
    description: '分页获取资源列表',
  })
  @Get()
  async accessListPage(@Query() accessReqDto: AccessReqDto): Promise<AccessListResDtoDto> {
    return await this.accessService.accessListPage(accessReqDto);
  }
}
