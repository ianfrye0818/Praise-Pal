import { Module } from '@nestjs/common';
import { CompanyContactService } from '../company-contact/company-contact.service';
import { CompanyContactController } from './company-contact.controller';
import { PrismaService } from 'src/core-services/prisma.service';

import { EmailService } from 'src/core-services/email.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';

@Module({
  controllers: [CompanyContactController],
  providers: [
    CompanyContactService,
    PrismaService,
    EmailService,
    UserNotificationsService,
  ],
  exports: [CompanyContactService],
})
export class CompanyContactModule {}
