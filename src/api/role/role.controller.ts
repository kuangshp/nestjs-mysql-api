import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
