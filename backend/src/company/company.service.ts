import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core-services/prisma.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto/createCompany.dto';
import { Cron } from '@nestjs/schedule';
import { Company } from '@prisma/client';
import { EmailService } from '../core-services/email.service';
import { generateCompanyCode } from '../utils';
import { CompanyFilterDTO } from './dto/filterCompany.dto';

@Injectable()
export class CompanyService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

  async findAll(filter?: CompanyFilterDTO) {
    try {
      return await this.prismaService.company.findMany({ where: filter });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retrieve companies');
    }
  }

  async findOneById(id: string) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: { id },
      });

      if (company === null) throw new NotFoundException('Company not found');
      return company;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retrieve company');
    }
  }

  async findOneByCompanyCode(companyCode: string) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: { companyCode },
      });
      if (!company) throw new NotFoundException('Company not found');
      return company;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retrieve company');
    }
  }

  async createCompanyRecursive(data: CreateCompanyDTO, retries: number) {
    try {
      const companyCode = generateCompanyCode();
      let company = await this.prismaService.company.findUnique({
        where: { companyCode },
      });
      if (!company) {
        company = await this.prismaService.company.create({
          data: { ...data, companyCode },
        });
        return company;
      } else {
        const MAX_RETRIES = 5;
        if (retries < MAX_RETRIES) {
          retries++;
          return this.createCompanyRecursive(data, retries);
        } else {
          throw new InternalServerErrorException('Could not create company');
        }
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create company');
    }
  }

  async create(data: CreateCompanyDTO) {
    const retries = 0;
    return this.createCompanyRecursive(data, retries);
  }

  async updateCompany(id: string, data: UpdateCompanyDTO): Promise<Company> {
    try {
      const company = await this.prismaService.company.update({
        where: { id },
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

  async softDeleteCompany(id: string) {
    try {
      return await this.prismaService.company.update({
        where: { id },
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
          deletedAt: {
            lte: dateThreshold,
          },
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
