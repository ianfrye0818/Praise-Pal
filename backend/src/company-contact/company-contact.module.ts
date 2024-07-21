import { forwardRef, Module } from '@nestjs/common';
import { CompanyContactService } from '../company-contact/company-contact.service';
import { CompanyContactController } from './company-contact.controller';
import { PrismaService } from 'src/core-services/prisma.service';
import { CompanyService } from 'src/company/company.service';
import { EmailService } from 'src/core-services/email.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [forwardRef(() => CompanyModule)],
  controllers: [CompanyContactController],
  providers: [
    CompanyContactService,
    PrismaService,
    CompanyService,
    EmailService,
    UserNotificationsService,
  ],
  exports: [CompanyContactService],
})
export class CompanyContactModule {}
