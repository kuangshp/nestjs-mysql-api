import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, ICurrentUserType } from '@src/decorators';
import { AuthGuard } from '@src/guard/auth.guard';
import { RoleDto } from './dto/role.dto';
import { QueryRoleDto } from './dto/role.query';
import { RoleService } from './role.service';
import { RolePageVo, RoleVo } from './vo/role.vo';

@UseGuards(AuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRoleApi(
    @Body() req: RoleDto,
    @CurrentUser('userInfo') currentInfo: ICurrentUserType
  ): Promise<string> {
    return await this.roleService.createRoleApi(req, currentInfo);
  }

  @Delete(':id')
  async deleteRoleByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.roleService.deleteRoleByIdApi(id);
  }

  @Put('/status/:id')
  async modifyRoleStatusByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.roleService.modifyRoleStatusByIdApi(id);
  }

  @Put(':id')
  async modifyRoleByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() req: RoleDto
  ): Promise<string> {
    return await this.roleService.modifyRoleByIdApi(id, req);
  }

  @Get()
  async getRolePageApi(
    @Query() queryOption: QueryRoleDto,
    @CurrentUser('userInfo') currentInfo: ICurrentUserType
  ): Promise<RolePageVo> {
    return await this.roleService.getRolePageApi(queryOption, currentInfo);
  }

  @Get(':id')
  async getRoleByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<RoleVo | undefined> {
    return await this.roleService.getRoleByIdApi(id);
  }

  @Post('delete')
  async batchDeleteRoleByIdListApi(@Body() idList: number[]): Promise<string> {
    return await this.roleService.batchDeleteRoleByIdListApi(idList);
  }

  @Post('/batchStatus')
  async batchModifyRoleStatusByIdApi(@Body() idList: number[]): Promise<string> {
    return await this.roleService.batchModifyRoleStatusByIdApi(idList);
  }
}
