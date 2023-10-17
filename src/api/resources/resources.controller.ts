import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { ResourcesDto } from './dto/resources.dto';
import { QueryResourcesDto } from './dto/resources.query.dto';
import { ResourcesService } from './resources.service';
import { ResourcesListVo, ResourcesVo, SimplenessResourceVo } from './vo/resources.vo';

@UseGuards(AuthGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async createResourceApi(@Body() resourcesDto: ResourcesDto): Promise<string> {
    return await this.resourcesService.createResourceApi(resourcesDto);
  }

  @Delete(':id')
  async deleteResourceByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.resourcesService.deleteResourceByIdApi(id);
  }

  @Put(':id')
  async modifyResourceByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() resourcesDto: ResourcesDto
  ): Promise<string> {
    return await this.resourcesService.modifyResourceByIdApi(id, resourcesDto);
  }

  @Get()
  async getResourcePageApi(
    @Query() queryResourcesDto: QueryResourcesDto
  ): Promise<ResourcesListVo> {
    return await this.resourcesService.getResourcePageApi(queryResourcesDto);
  }

  @Get('catalog')
  async getResourceCatalogApi(
    @Query('catalogType') catalogType: number
  ): Promise<SimplenessResourceVo[]> {
    return await this.resourcesService.getResourceCatalogApi(catalogType);
  }

  @Get('menusList')
  async getMenusListApi(): Promise<ResourcesVo[]> {
    return await this.resourcesService.getMenusListApi();
  }

  @Get('menus/:id')
  async getMenusByCatalogIdApi(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<SimplenessResourceVo[]> {
    return await this.resourcesService.getMenusByCatalogIdApi(id);
  }
}
