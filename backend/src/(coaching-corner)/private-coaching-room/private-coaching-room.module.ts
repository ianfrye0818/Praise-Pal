import { Module } from '@nestjs/common';
import { PrivateCoachingRoomController } from './private-coaching-room.controller';
import { PrivateCoachingRoomService } from './private-coaching-room.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { UserService } from 'src/(user)/user/user.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { EmailService } from 'src/core-services/email.service';

@Module({
  controllers: [PrivateCoachingRoomController],
  providers: [
    PrivateCoachingRoomService,
    PrismaService,
    UserService,
    UserNotificationsService,
    EmailService,
  ],
  exports: [PrivateCoachingRoomService],
})
export class PrivateCoachingRoomModule {}
