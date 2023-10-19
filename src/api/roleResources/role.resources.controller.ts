import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AuthGuard } from '@src/guard/auth.guard';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesDto } from './dto/role.resources.dto';
import { RoleResourcesService } from './role.resources.service';

@UseGuards(AuthGuard)
@Controller('roleResources')
export class RoleResourcesController {
  constructor(private readonly roleResourcesService: RoleResourcesService) {}

  @Post()
  async dispatchResourcesApi(@Body() req: RoleResourcesDto): Promise<string> {
    return await this.roleResourcesService.dispatchResourcesApi(req);
  }

  @Get(':roleId')
  async getResourceByRoleIdApi(
    @Param('roleId', new ParseIntPipe()) roleId: number,
    @Query('type') type: number
  ): Promise<ResourcesEntity[]> {
    return await this.roleResourcesService.getResourceByRoleIdApi(roleId, type);
  }
}
