import { Module } from '@nestjs/common';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { UserService } from 'src/(user)/user/user.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { EmailService } from 'src/core-services/email.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from 'src/company/company.service';

@Module({
  controllers: [VerifyController],
  providers: [
    VerifyService,
    UserNotificationsService,
    UserService,
    PrismaService,
    EmailService,
    JwtService,
    CompanyService,
  ],
  exports: [VerifyService],
})
export class VerifyModule {}
