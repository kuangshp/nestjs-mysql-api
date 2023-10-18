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
import { DepartmentService } from './department.service';
import { DepartmentDto } from './dto/department.dto';
import { CurrentUser, ICurrentUserType } from '@src/decorators';
import { DepartmentPageVo, DepartmentVo } from './vo/department.vo';
import { QueryDepartmentDto } from './dto/department.query';
import { AuthGuard } from '@src/guard/auth.guard';
@UseGuards(AuthGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async createDepartmentApi(
    @Body() req: DepartmentDto,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.departmentService.createDepartmentApi(req, currentUser);
  }

  @Delete(':id')
  async deleteDepartmentByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.departmentService.deleteDepartmentByIdApi(id);
  }

  @Put('/status/:id')
  async modifyDepartmentStatusByIdApi(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<string> {
    return await this.departmentService.modifyDepartmentStatusByIdApi(id);
  }

  @Put(':id')
  async modifyDepartmentByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() req: DepartmentDto,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.departmentService.modifyDepartmentByIdApi(id, req, currentUser);
  }

  @Get()
  async getDepartmentPageApi(
    @Query() queryOption: QueryDepartmentDto,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<DepartmentPageVo> {
    return await this.departmentService.getDepartmentPageApi(queryOption, currentUser);
  }

  @Get(':id')
  async getDepartmentByIdApi(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<DepartmentVo | undefined> {
    return await this.departmentService.getDepartmentByIdApi(id);
  }

  @Post('delete')
  async batchDeleteDepartmentByIdListApi(@Body() idList: number[]): Promise<string> {
    return await this.departmentService.batchDeleteDepartmentByIdListApi(idList);
  }

  @Post('/batchStatus')
  async batchModifyDepartmentStatusByIdApi(@Body() idList: number[]): Promise<string> {
    return await this.departmentService.batchModifyDepartmentStatusByIdApi(idList);
  }
}
