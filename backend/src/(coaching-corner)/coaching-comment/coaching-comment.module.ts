import { Module } from '@nestjs/common';
import { CoachingCommentController } from './coaching-comment.controller';
import { CoachingCommentService } from './coaching-comment.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { UserService } from 'src/(user)/user/user.service';
import { EmailService } from 'src/core-services/email.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';

@Module({
  controllers: [CoachingCommentController],
  providers: [
    CoachingCommentService,
    PrismaService,
    JwtStrategy,
    UserService,
    EmailService,
    UserNotificationsService,
  ],
  exports: [CoachingCommentService],
})
export class CoachingCommentModule {}
