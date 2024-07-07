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
  @Get(':companyId')
  async findOneById(@Param('companyId') companyId: string) {
    return await this.companyService.findOneById(companyId);
  }

  @UseGuards(SuperAdminGuard)
  @Post()
  async create(@Body() data: CreateCompanyDTO) {
    return await this.companyService.create(data);
  }

  @UseGuards(CompanyOwnerGuard)
  @UseGuards(CompanyGuard)
  @Patch(':companyId')
  async updateCompanyById(
    @Param('companyId') companyId: string,
    @Body() data: UpdateCompanyDTO,
  ) {
    return await this.companyService.updateCompany(companyId, data);
  }

  @UseGuards(SuperAdminGuard)
  @Delete(':companyId')
  async deleteCompanyById(@Param('companyId') companyId: string) {
    return await this.companyService.softDeleteCompany(companyId);
  }
}
