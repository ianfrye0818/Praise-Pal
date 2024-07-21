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

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Query() filter: CompanyFilterDTO) {
    return await this.companyService.findAll(filter);
  }

  @Post('request-new-company')
  async requestNewCompany(@Body() data: CreateCompanyWithContactDto) {
    return await this.companyService.requestNewCompany(data);
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Patch('approve-company-request/:companyCode')
  async approveCompanyRequest(@Param('companyCode') companyCode: string) {
    return await this.companyService.toggleStatus(
      companyCode,
      CompanyStatus.ACTIVE,
    );
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Patch('reject-company-request/:companyCode')
  async updateCompanyStatus(@Param('companyCode') companyCode: string) {
    return await this.companyService.toggleStatus(
      companyCode,
      CompanyStatus.INACTIVE,
    );
  }

  @UseGuards(CompanyGuard)
  @UseGuards(JwtGuard)
  @Get(':companyCode')
  async findOneById(
    @Param('companyCode') companyCode: string,
    @Req() req: any,
  ) {
    console.log(req.user);
    return await this.companyService.findOneByCompanyCode(companyCode);
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() data: CreateCompanyDTO, @Req() req: any) {
    return await this.companyService.createCompanyWithUniqueCompanyCode(
      data,
      req.user,
    );
  }

  @UseGuards(CompanyOwnerGuard)
  @UseGuards(JwtGuard)
  @Patch(':companyCode')
  async updateCompanyById(
    @Param('companyCode') companyCode: string,
    @Body() data: UpdateCompanyDTO,
  ) {
    return await this.companyService.updateCompany(companyCode, data);
  }

  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':companyCode')
  async deleteCompanyById(@Param('companyCode') companyCode: string) {
    return await this.companyService.softDeleteCompany(companyCode);
  }
}
