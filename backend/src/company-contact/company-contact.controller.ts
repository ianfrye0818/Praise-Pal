import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyContactService } from './company-contact.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SuperAdminGuard } from 'src/core-guards/super-admin.guard';
import {
  CreateCompanyContactDTO,
  UpdateCompanyContactDTO,
} from './dto/create-contact.dto';
@Controller('company-contact')
export class CompanyContactController {
  constructor(private readonly companyContactService: CompanyContactService) {}

  @Post()
  async addNewContact(@Body() data: CreateCompanyContactDTO) {
    return await this.companyContactService.addNewContact(data);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Patch(':contactId')
  async updateContact(
    @Param('contactId') contactId: string,
    data: UpdateCompanyContactDTO,
  ) {
    return await this.companyContactService.updateContact(contactId, data);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Patch('covert/:contactId')
  async convertContactToUser(@Param('contactId') contactId: string) {
    return await this.companyContactService.convertContactToUser(contactId);
  }

  @UseGuards(JwtGuard, SuperAdminGuard)
  @Delete(':contactId')
  async deleteContact(@Param('contactId') contactId: string) {
    return await this.companyContactService.deleteContact(contactId);
  }
}
