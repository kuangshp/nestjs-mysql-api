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
import { CreateDefaultAccountDto, RechargeDto, TenantDto } from './dto/tenant.dto';
import { QueryTenantDto } from './dto/tenant.query';
import { TenantService } from './tenant.service';
import { TenantPageVo, TenantVo } from './vo/tenant.vo';
@UseGuards(AuthGuard)
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createTenantApi(@Body() req: TenantDto): Promise<string> {
    return await this.tenantService.createTenantApi(req);
  }

  @Delete(':id')
  async deleteTenantByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.tenantService.deleteTenantByIdApi(id, currentUser);
  }

  @Put('/status/:id')
  async modifyTenantStatusByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.tenantService.modifyTenantStatusByIdApi(id, currentUser);
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

  @Post('delete')
  async batchDeleteTenantByIdListApi(
    @Body() idList: number[],
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.tenantService.batchDeleteTenantByIdListApi(idList, currentUser);
  }

  @Post('/batchStatus')
  async batchModifyTenantStatusByIdApi(
    @Body() idList: number[],
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.tenantService.batchModifyTenantStatusByIdApi(idList, currentUser);
  }

  @Post('recharge')
  async rechargeTenantApi(@Body() req: RechargeDto): Promise<string> {
    return await this.tenantService.rechargeTenantApi(req);
  }

  @Post('defaultAccount')
  async createDefaultAccount(@Body() req: CreateDefaultAccountDto): Promise<string> {
    return await this.tenantService.createDefaultAccount(req);
  }
}
