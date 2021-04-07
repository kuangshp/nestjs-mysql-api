import {
  Controller,
  UseGuards,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  Param,
  Patch,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import adminConfig from '@src/config/admin.config';
import { RoleService } from '../../services/role/role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import { UpdateRoleDto } from './dto/update.role.dto';
import { RoleResDto, RoleListResDtoDto } from './dto/role.res.dto';
import { RoleReqDto } from './dto/role.req.dto';
import { ApiAuth } from '@src/decorators/api.auth';

@ApiTags('后台管理系统-角色管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller(`${adminConfig.adminPath}/role`)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '创建角色',
    description: '创建角色',
  })
  @ApiCreatedResponse({
    type: String,
    description: '创建角色返回值',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<string> {
    return await this.roleService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: '删除角色', description: '根据角色id删除角色' })
  @ApiCreatedResponse({
    type: String,
    description: '删除角色返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async destroyRoleById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.roleService.destroyRoleById(id);
  }

  @ApiOperation({ summary: '修改角色', description: '根据角色id修改角色' })
  @ApiCreatedResponse({
    type: String,
    description: '修改角色返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async modifyRoleById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<string> {
    return await this.roleService.modifyRoleById(id, updateRoleDto);
  }

  @ApiOperation({ summary: '查询角色', description: '根据角色id查询角色' })
  @ApiCreatedResponse({
    type: RoleResDto,
    description: '查询单条角色返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async roleById(@Param('id', new ParseIntPipe()) id: number): Promise<RoleResDto | undefined> {
    return await this.roleService.roleById(id);
  }

  @ApiOperation({
    summary: '查询角色列表',
    description: '查询角色',
    externalDocs: {
      url: 'xx?pageSize=10&pageNumber=1&name=x&status=0',
    },
  })
  @ApiCreatedResponse({
    type: RoleResDto,
    isArray: true,
    description: '分页查询角色返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async roleList(@Query() roleReqDto: RoleReqDto): Promise<RoleListResDtoDto> {
    return await this.roleService.roleList(roleReqDto);
  }
}
