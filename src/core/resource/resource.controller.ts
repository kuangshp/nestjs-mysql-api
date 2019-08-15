import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Get,
  Query,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create.resource.dto';
import { ResourceEntity } from './resource.entity';
import { UpdateResourceDto } from './dto/update.resource.dto';

@ApiUseTags('resource')
@ApiBearerAuth()
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiOperation({ title: '创建资源' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateResourceDto): Promise<ResourceEntity> {
    return await this.resourceService.create(data);
  }

  @ApiOperation({ title: '根据id修改资源' })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() data: UpdateResourceDto,
  ): Promise<ResourceEntity> {
    return await this.resourceService.updateById(id, data);
  }

  @ApiOperation({ title: '获取全部的资源' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async showAll(
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('pageNumber', new ParseIntPipe()) pageNumber: number,
  ): Promise<ResourceEntity[]> {
    return await this.resourceService.showAll(pageSize, pageNumber);
  }

  @ApiOperation({ title: '根据id获取资源' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<ResourceEntity> {
    return await this.resourceService.getById(id);
  }
}
