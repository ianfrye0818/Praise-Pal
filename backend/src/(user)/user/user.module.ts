import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../core-services/prisma.service';
import { EmailService } from '../../core-services/email.service';
import { JwtStrategy } from '../../auth/strategies/jwt-strategy';
import { UserNotificationsService } from '../user-notifications/user-notifications.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    EmailService,
    JwtStrategy,
    UserNotificationsService,
  ],
  exports: [UserService],
})
export class UserModule {}
