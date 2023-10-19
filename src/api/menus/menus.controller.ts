import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, ICurrentUserType } from '@src/decorators';
import { AuthGuard } from '@src/guard/auth.guard';
import { MenusService } from './menus.service';
import { ApiVo, MenusVo } from './vo/menus.vo';

@UseGuards(AuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async getAllMenusApi(@CurrentUser('userInfo') userInfo: ICurrentUserType): Promise<MenusVo[]> {
    return await this.menusService.getAllMenusApi(userInfo);
  }

  @Get('btnList')
  async getBtnByMenusUrlApi(
    @CurrentUser('userInfo') userInfo: ICurrentUserType,
    @Query('urlName') urlName: string
  ): Promise<ApiVo[]> {
    return await this.menusService.getBtnByMenusUrlApi(urlName, userInfo);
  }
}
