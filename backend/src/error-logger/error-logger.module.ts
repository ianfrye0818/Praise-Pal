import { Module } from '@nestjs/common';
import { ErrorLoggerController } from './error-logger.controller';
import { ErrorLoggerService } from './error-logger.service';
import { PrismaService } from 'src/core-services/prisma.service';

@Module({
  controllers: [ErrorLoggerController],
  providers: [ErrorLoggerService, PrismaService],
  exports: [ErrorLoggerService],
})
export class ErrorLoggerModule {}
