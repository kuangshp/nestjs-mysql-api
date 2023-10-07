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
} from '@nestjs/common';
import { TenantDto } from './dto/tenant.dto';
import { QueryTenantDto } from './dto/tenant.query';
import { TenantService } from './tenant.service';
import { TenantPageVo, TenantVo } from './vo/tenant.vo';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createTenantApi(@Body() req: TenantDto): Promise<string> {
    return await this.tenantService.createTenantApi(req);
  }

  @Delete(':id')
  async deleteTenantByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.tenantService.deleteTenantByIdApi(id);
  }

  @Put('/status/:id')
  async modifyTenantStatusByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.tenantService.modifyTenantStatusByIdApi(id);
  }

  @Put(':id')
  async modifyTenantByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() req: TenantDto
  ): Promise<string> {
    return await this.tenantService.modifyTenantByIdApi(id, req);
  }

  @Get()
  async getTenantPageApi(@Query() queryOption: QueryTenantDto): Promise<TenantPageVo> {
    return await this.tenantService.getTenantPageApi(queryOption);
  }

  @Get(':id')
  async getTenantByIdApi(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<TenantVo | undefined> {
    return await this.tenantService.getTenantByIdApi(id);
  }
}
