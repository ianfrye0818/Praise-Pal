import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/core-services/prisma.service';
import {
  CreateCompanyContactDTO,
  UpdateCompanyContactDTO,
} from './create-contact.dto';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { EmailService } from 'src/core-services/email.service';

@Injectable()
export class CompanyContactService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private notificationService: UserNotificationsService,
    @Inject(forwardRef(() => CompanyService)) // Use forwardRef to resolve circular dependency
    private companyService: CompanyService,
  ) {}

  async getCompanyContacts(companyCode: string) {
    try {
      return await this.companyService.findCompanyContacts(companyCode);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Company not found');
      }
      throw new InternalServerErrorException(
        'Could not retrieve company contacts',
      );
    }
  }
  async addNewContact(data: CreateCompanyContactDTO) {
    try {
      return await this.prismaService.companyContact.create({
        data,
      });
    } catch (error) {
      console.error(['addNewContactError', error]);
      if (error.code === 'P2025') {
        throw new Error('Company not found');
      }
      throw new InternalServerErrorException('Could not add new contact');
    }
  }
  async updateContact(contactId: string, data: UpdateCompanyContactDTO) {
    try {
      return await this.prismaService.companyContact.update({
        where: { id: contactId },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Could not update contact');
    }
  }
  async deleteContact(contactId: string) {
    try {
      return await this.prismaService.companyContact.delete({
        where: { id: contactId },
      });
    } catch (error) {
      throw new InternalServerErrorException('Could not delete contact');
    }
  }
}
