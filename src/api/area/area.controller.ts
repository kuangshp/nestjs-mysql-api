import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AreaEntity } from './entities/area.entity';
import { AreaService } from './area.service';
import { RedisCacheApi } from '@src/decorators';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get(':pid')
  @RedisCacheApi({ exSecond: 7 * 24 * 60 * 60 })
  async getDataByPidApi(@Param('pid', new ParseIntPipe()) pid: number): Promise<AreaEntity[]> {
    return await this.areaService.getDataByPidApi(pid);
  }

  @Get()
  @RedisCacheApi({ exSecond: 7 * 24 * 60 * 60 })
  async getAllCityApi(): Promise<AreaEntity[]> {
    return await this.areaService.getAllCityApi();
  }
}
