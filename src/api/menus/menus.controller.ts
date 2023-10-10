import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, ICurrentUserType } from '@src/decorators';
import { AuthGuard } from '@src/guard/auth.guard';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { MenusService } from './menus.service';
import { MenusVo } from './vo/menus.vo';

@UseGuards(AuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async getAllMenusApi(@CurrentUser() userInfo: ICurrentUserType): Promise<MenusVo[]> {
    return await this.menusService.getAllMenusApi(userInfo);
  }

  @Get('menusId')
  async getMenusIdByNameApi(@Query('urlName') urlName: string): Promise<number | undefined> {
    return await this.menusService.getMenusIdByNameApi(urlName);
  }

  @Get('/btnList/:id')
  async getBtnByMenusIdApi(
    @CurrentUser('userInfo') userInfo: ICurrentUserType,
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<ResourcesEntity[]> {
    return await this.menusService.getBtnByMenusIdApi(id, userInfo);
  }
}
