import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';

@ApiUseTags('role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ title: '添加角色' })
  async create(@Body() data: RoleDto): Promise<RoleEntity> {
    return this.roleService.create(data);
  }

  @Put(':id')
  @ApiOperation({ title: '根据角色id修改角色' })
  async updateById(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() data: RoleDto,
  ): Promise<RoleEntity> {
    return await this.roleService.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({title: '根据用户id删除角色'})
  async destroyById(@Param('id', new ParseIntPipe()) id: string): Promise<any> {
    return await this.roleService.destroyById(id);
  }
}
