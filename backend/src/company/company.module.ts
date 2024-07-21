import { forwardRef, Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaService } from '../core-services/prisma.service';
import { EmailService } from '../core-services/email.service';
import { UserService } from '../(user)/user/user.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { CompanyContactService } from '../company-contact/company-contact.service';
import { CompanyContactModule } from 'src/company-contact/company-contact.module';

@Module({
  imports: [forwardRef(() => CompanyContactModule)],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    PrismaService,
    EmailService,
    UserService,
    UserNotificationsService,
    CompanyContactService,
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
