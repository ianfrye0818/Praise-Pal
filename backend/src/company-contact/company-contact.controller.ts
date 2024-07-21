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
import { CompanyContactService } from './company-contact.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SuperAdminGuard } from 'src/core-guards/super-admin.guard';
import {
  CreateCompanyContactDTO,
  UpdateCompanyContactDTO,
} from './create-contact.dto';
@Controller('company-contact')
export class CompanyContactController {
  constructor(private readonly companyContactService: CompanyContactService) {}
  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Get()
  async getCompanyContacts(@Query('companyCode') companyCode: string) {
    return await this.companyContactService.getCompanyContacts(companyCode);
  }
  @Post()
  async addNewContact(@Body() data: CreateCompanyContactDTO) {
    return await this.companyContactService.addNewContact(data);
  }
  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Patch(':contactId')
  async updateContact(
    @Param('contactId') contactId: string,
    data: UpdateCompanyContactDTO,
  ) {
    return await this.companyContactService.updateContact(contactId, data);
  }
  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Delete(':contactId')
  async deleteContact(@Param('contactId') contactId: string) {
    return await this.companyContactService.deleteContact(contactId);
  }
}
