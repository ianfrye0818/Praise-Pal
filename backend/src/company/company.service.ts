import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core-services/prisma.service';
import {
  CreateCompanyDTO,
  CreateCompanyWithContactDto,
  UpdateCompanyDTO,
} from './dto/createCompany.dto';
import { Cron } from '@nestjs/schedule';
import { ActionType, Company, CompanyStatus, Role } from '@prisma/client';
import { EmailService } from '../core-services/email.service';
import { generateCompanyCode } from '../utils';
import { CompanyFilterDTO } from './dto/filterCompany.dto';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { ClientUser } from 'src/types';
import { CompanyContactService } from '../company-contact/company-contact.service';

@Injectable()
export class CompanyService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private notificationService: UserNotificationsService,
    @Inject(forwardRef(() => CompanyContactService)) // Use forwardRef to resolve circular dependency
    private companyContactService: CompanyContactService,
  ) {}

  async findAll(filter?: CompanyFilterDTO) {
    try {
      return await this.prismaService.company.findMany({ where: filter });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retrieve companies');
    }
  }

  async findOneByCompanyCode(companyCode: string) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: { companyCode },
      });

      if (company === null) throw new NotFoundException('Company not found');
      return company;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retrieve company');
    }
  }

  async findCompanyContacts(companyCode: string) {
    try {
      return await this.prismaService.company.findUnique({
        where: { companyCode },
        include: { companyContacts: true },
      });
    } catch (error) {
      console.error(['company - findCompanyContactsError'], error);
      throw error;
    }
  }

  async requestNewCompany(data: CreateCompanyWithContactDto) {
    console.log(data);
    const { companyInfo, contactInfo } = data;
    try {
      const resp = await this.prismaService.$transaction(async () => {
        const newCompany =
          await this.createCompanyWithUniqueCompanyCode(companyInfo);

        const newContact = await this.companyContactService.addNewContact({
          ...contactInfo,
          companyCode: newCompany.companyCode,
        });

        return { newCompany, newContact };
      });

      const superAdminUserId = await this.prismaService.user.findFirst({
        where: { role: Role.SUPER_ADMIN },
        select: { userId: true, email: true },
      });
      const { newCompany: company, newContact } = resp;

      console.log(resp);

      await this.notificationService.createNotification({
        actionType: ActionType.NEW_COMPANY,
        message: `New company request: ${company.name}`,
        companyCode: company.companyCode,
        userId: superAdminUserId.userId,
      });

      //TODO: Uncomment this when email service is implemented

      // await this.emailService.sendNewCompanyRequestEmail(
      //   company,
      //   superAdminUserId.email,
      // );

      return company;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create company');
    }
  }

  async createCompanyWithUniqueCompanyCode(
    data: CreateCompanyDTO,
    user?: ClientUser,
  ) {
    let companyCode: string;
    let retries = 0;
    const maxRetries = 5;
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        while (retries < maxRetries) {
          if (retries === maxRetries)
            throw new InternalServerErrorException('Could not create company');
          companyCode = generateCompanyCode();
          retries++;

          const company = await prisma.company.findUnique({
            where: { companyCode },
          });

          if (company === null) break;
        }

        return await prisma.company.create({
          data: {
            ...data,
            companyCode,
            status:
              user && user.role === Role.SUPER_ADMIN ? 'ACTIVE' : 'PENDING',
          },
        });
      });
    } catch (error) {
      console.error(['createCompanyError'], error);
      throw new InternalServerErrorException('Could not create company');
    }
  }

  async toggleStatus(companyCode: string, status: CompanyStatus) {
    try {
      await this.updateCompany(companyCode, { status: status });
    } catch (error) {
      console.error(['toggleActiveError'], error);
      if (error.code === 'P2025') {
        throw new HttpException('Company not found', 404);
      }
      throw new InternalServerErrorException('Could not update company');
    }
  }

  async updateCompany(
    companyCode: string,
    data: UpdateCompanyDTO,
  ): Promise<Company> {
    try {
      const company = await this.prismaService.company.update({
        where: { companyCode },
        data,
      });
      return company;
    } catch (error) {
      console.error(error.code);
      if (error.code === 'P2025') {
        throw new HttpException('Company not found', 404);
      }
      throw new InternalServerErrorException('Could not update company');
    }
  }

  async softDeleteCompany(companyCode: string) {
    try {
      return await this.prismaService.company.update({
        where: { companyCode },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025')
        throw new HttpException('Company not found', 404);
      throw new InternalServerErrorException('Could not delete company');
    }
  }

  @Cron('0 0 * * *')
  async permanentlyDeleteOldUsers() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    try {
      await this.prismaService.company.deleteMany({
        where: {
          AND: [
            {
              deletedAt: {
                lt: dateThreshold,
              },
            },
            {
              status: 'INACTIVE',
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
      this.emailService.sendCronErrorNotification(
        error.message,
        'Delete Companies',
      );
    }
  }
}
