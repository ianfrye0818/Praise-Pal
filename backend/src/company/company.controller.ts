import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  CreateCompanyDTO,
  CreateCompanyWithContactDto,
  UpdateCompanyDTO,
} from './dto/createCompany.dto';
import { SuperAdminGuard } from '../core-guards/super-admin.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CompanyGuard } from '../core-guards/company.guard';
import { CompanyFilterDTO } from './dto/filterCompany.dto';
import { CompanyOwnerGuard } from 'src/core-guards/company-owner.guard';
import { CompanyStatus } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @SkipThrottle()
  @UseGuards(JwtGuard, SuperAdminGuard)
  @Get()
  async findAll(@Query() filter: CompanyFilterDTO) {
    return await this.companyService.findAll(filter);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Get('company-contacts/:companyCode')
  async getCompanyContacts(@Param('companyCode') companyCode: string) {
    return await this.companyService.findCompanyContacts(companyCode);
  }

  @Post('request-new-company')
  async requestNewCompany(@Body() data: CreateCompanyWithContactDto) {
    return await this.companyService.requestNewCompany(data);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Patch('approve-company-request/:companyCode')
  async approveCompanyRequest(@Param('companyCode') companyCode: string) {
    return await this.companyService.toggleStatus(
      companyCode,
      CompanyStatus.ACTIVE,
    );
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Patch('reject-company-request/:companyCode')
  async updateCompanyStatus(@Param('companyCode') companyCode: string) {
    return await this.companyService.toggleStatus(
      companyCode,
      CompanyStatus.INACTIVE,
    );
  }

  @UseGuards(JwtGuard, CompanyGuard)
  @Get(':companyCode')
  async findOneById(@Param('companyCode') companyCode: string) {
    return await this.companyService.findOneByCompanyCode(companyCode);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Post()
  async create(@Body() data: CreateCompanyDTO, @Req() req: any) {
    return await this.companyService.createCompanyWithUniqueCompanyCode(
      data,
      req.user,
    );
  }

  @UseGuards(JwtGuard, CompanyOwnerGuard)
  @Patch(':companyCode')
  async updateCompanyById(
    @Param('companyCode') companyCode: string,
    @Body() data: UpdateCompanyDTO,
  ) {
    return await this.companyService.updateCompany(companyCode, data);
  }

  @UseGuards(SuperAdminGuard)
  @Patch('restore/:companyCode')
  async restoreCompany(@Param('companyCode') companyCode: string) {
    return await this.companyService.restoreSoftDeletedCompany(companyCode);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Delete(':companyCode')
  async deleteCompanyById(@Param('companyCode') companyCode: string) {
    return await this.companyService.softDeleteCompany(companyCode);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Delete('hard-delete/:companyCode')
  async forceDeleteCompany(@Param('companyCode') companyCode: string) {
    return await this.companyService.hardDeleteCompany(companyCode);
  }
}
