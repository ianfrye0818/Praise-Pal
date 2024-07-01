import { Module } from '@nestjs/common';
import { UserNotificationsController } from './user-notifications.controller';
import { UserNotificationsService } from './user-notifications.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../../core-services/email.service';
import { PrismaService } from '../../core-services/prisma.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { UserNotificationsGuard } from './guards/user-notification.guard';

@Module({
  controllers: [UserNotificationsController],
  providers: [
    UserNotificationsService,
    UserService,
    EmailService,
    PrismaService,
    JwtGuard,
    UserNotificationsGuard,
  ],
  exports: [UserNotificationsService],
})
export class UserNotificationsModule {}
