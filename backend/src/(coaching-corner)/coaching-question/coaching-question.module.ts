import { Module } from '@nestjs/common';
import { CoachingQuestionController } from './coaching-question.controller';
import { CoachingQuestionService } from './coaching-question.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { UserService } from 'src/(user)/user/user.service';
import { EmailService } from 'src/core-services/email.service';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { CoachingCommentService } from '../coaching-comment/coaching-comment.service';

@Module({
  controllers: [CoachingQuestionController],
  providers: [
    CoachingQuestionService,
    PrismaService,
    UserNotificationsService,
    UserService,
    EmailService,
    JwtStrategy,
    CoachingCommentService,
  ],
  exports: [CoachingQuestionService],
})
export class CoachingQuestionModule {}
