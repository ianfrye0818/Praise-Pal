import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PrismaService } from 'src/core-services/prisma.service';
import {
  CreateCompanyContactDTO,
  UpdateCompanyContactDTO,
} from './dto/create-contact.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CompanyContactService {
  constructor(private prismaService: PrismaService) {}

  async addNewContact(data: CreateCompanyContactDTO) {
    try {
      return await this.prismaService.companyContact.create({
        data,
      });
    } catch (error) {
      console.error(['addNewContactError', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException('Company not found');
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

  async convertContactToUser(contactId: string) {
    try {
      const contact = await this.prismaService.companyContact.findUnique({
        where: { id: contactId },
      });

      await this.prismaService.$transaction(async (prisma) => {
        await prisma.user.create({
          data: {
            companyCode: contact.companyCode,
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            password: 'welcome123',
            isActive: true,
            role: Role.COMPANY_OWNER,
          },
        });

        await prisma.companyContact.delete({
          where: { id: contactId },
        });
      });
    } catch (error) {
      console.error(['convertContactToUserError', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException('Contact not found');
      } else {
        throw new InternalServerErrorException(
          'Could not convert contact to user',
        );
      }
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
