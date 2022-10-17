import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { RoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

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

  @Put(':id')
  async modifyRoleById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() roleDto: Omit<RoleDto, 'status'>
  ): Promise<string> {
    return await this.roleService.modifyRoleById(id, roleDto);
  }
}
