import { Controller, UseGuards, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { MenusService } from '../../services/menus/menus.service';
import { MenusListVo } from './vo/menus.vo';
import { CurrentUser, ICurrentUserType } from '@src/decorators/current.user';

@ApiTags('后台管理系统-菜单管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @ApiOperation({
    summary: '获取菜单列表',
    description: '获取菜单',
  })
  @ApiOkResponse({
    type: MenusListVo,
    isArray: true,
    description: '获取菜单返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async menusList(@CurrentUser() userInfo: ICurrentUserType): Promise<MenusListVo[]> {
    return await this.menusService.menusList(userInfo);
  }
}
