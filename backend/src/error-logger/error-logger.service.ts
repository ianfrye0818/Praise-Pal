import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma.service';
import { CreateErrorDTO } from './dto/create-error.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ErrorLoggerService {
  constructor(private prismaService: PrismaService) {}

  async addErrorLog(error: CreateErrorDTO) {
    try {
      await this.prismaService.errorLog.create({
        data: error,
      });
    } catch (error) {
      console.error(['addErrorLogError', error]);
      return new InternalServerErrorException('Could not add error log');
    }
  }

  async getErrorLogs() {
    try {
      return await this.prismaService.errorLog.findMany();
    } catch (error) {
      console.error(['getErrorLogsError', error]);
      throw new InternalServerErrorException('Could not retrieve error logs');
    }
  }

  async getErrorById(id: string) {
    try {
      return await this.prismaService.errorLog.findUnique({ where: { id } });
    } catch (error) {
      console.error(['getErrorByIdError', error]);
      if (error.code === 'P2016') {
        throw new Error('Error log not found');
      }
      throw new InternalServerErrorException('Could not retrieve error log');
    }
  }

  async deleteErrorById(id: string) {
    try {
      await this.prismaService.errorLog.delete({ where: { id } });
    } catch (error) {
      console.error(['deleteErrorByIdError', error]);
      if (error.code === 'P2016') {
        throw new Error('Error log not found');
      }
      throw new InternalServerErrorException('Could not delete error log');
    }
  }

  @Cron('0 0 * * * *')
  deleteOldErrorLogs() {
    try {
      this.prismaService.errorLog.deleteMany({
        where: {
          createdAt: {
            lte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          },
        },
      });
    } catch (error) {
      console.error(['deleteOldErrorLogsError', error]);
      throw new InternalServerErrorException('Could not delete old error logs');
    }
  }
}
