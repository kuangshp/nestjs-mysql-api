import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { RoleDto } from './dto/role.dto';
import { QueryRoleDto } from './dto/role.query.dto';
import { RoleService } from './role.service';
import { RoleListVo, RolePageVo, RoleVo } from './vo/role.vo';

@UseGuards(AuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() roleDto: RoleDto): Promise<string> {
    return await this.roleService.createRole(roleDto);
  }

  @Delete(':id')
  async deleteRoleById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.roleService.deleteRoleById(id);
  }

  @Patch('status/:id')
  async modifyRoleStatusById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.roleService.modifyRoleStatusById(id);
  }

  @Put(':id')
  async modifyRoleById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() roleDto: Omit<RoleDto, 'status'>
  ): Promise<string> {
    return await this.roleService.modifyRoleById(id, roleDto);
  }

  @Get('list')
  async getRoleList(): Promise<RoleListVo[]> {
    return await this.roleService.getRoleList();
  }

  @Get(':id')
  async getRoleById(@Param('id', new ParseIntPipe()) id: number): Promise<RoleVo | null> {
    return await this.roleService.getRoleById(id);
  }

  @Get()
  async getRolePage(@Query() queryOptions: QueryRoleDto): Promise<RolePageVo> {
    return await this.roleService.getRolePage(queryOptions);
  }
}
