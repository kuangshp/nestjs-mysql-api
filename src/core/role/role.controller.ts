import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update.role.dto';
import { CreateRoleDto } from './dto/create.role.dto';
import { PaginateInterceptor } from './../../shared/interceptor/paginate.interceptor';

@ApiUseTags('role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ title: '添加角色' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.create(data);
  }

  @ApiOperation({ title: '查询所有的角色', description: '支持分页查询' })
  @Get()
  @UseInterceptors(PaginateInterceptor)
  @HttpCode(HttpStatus.OK)
  async showAll(
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('pageNumber', new ParseIntPipe()) pageNumber: number,
  ): Promise<RoleEntity[]> {
    return await this.roleService.showAll(pageSize, pageNumber);
  }

  @ApiOperation({ title: '根据角色id查询角色' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<RoleEntity> {
    return await this.roleService.getById(id);
  }

  @ApiOperation({ title: '根据角色id修改角色' })
  @Put(':id')
  async updateById(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<RoleEntity> {
    return await this.roleService.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ title: '根据用户id删除角色' })
  async destroyById(@Param('id', new ParseIntPipe()) id: string): Promise<any> {
    return await this.roleService.destroyById(id);
  }
}
