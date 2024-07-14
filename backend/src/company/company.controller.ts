import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto/createCompany.dto';
import { SuperAdminGuard } from '../core-guards/super-admin.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CompanyGuard } from '../core-guards/company.guard';
import { CompanyFilterDTO } from './dto/filterCompany.dto';
import { CompanyOwnerGuard } from 'src/core-guards/company-owner.guard';

@UseGuards(JwtGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(SuperAdminGuard)
  @Get()
  async findAll(@Query() filter: CompanyFilterDTO) {
    return await this.companyService.findAll(filter);
  }

  @UseGuards(CompanyGuard)
  @Get(':companyCode')
  async findOneById(@Param('companyCode') companyCode: string) {
    return await this.companyService.findOneById(companyCode);
  }

  @UseGuards(SuperAdminGuard)
  @Post()
  async create(@Body() data: CreateCompanyDTO) {
    return await this.companyService.create(data);
  }

  @UseGuards(CompanyOwnerGuard)
  @Patch(':companyCode')
  async updateCompanyById(
    @Param('companyCode') companyCode: string,
    @Body() data: UpdateCompanyDTO,
  ) {
    return await this.companyService.updateCompany(companyCode, data);
  }

  @UseGuards(SuperAdminGuard)
  @Delete(':companyCode')
  async deleteCompanyById(@Param('companyCode') companyCode: string) {
    return await this.companyService.softDeleteCompany(companyCode);
  }
}
