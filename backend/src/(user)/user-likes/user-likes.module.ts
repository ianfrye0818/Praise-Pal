import { Module } from '@nestjs/common';
import { UserLikesController } from './user-likes.controller';
import { UserLikesService } from './user-likes.service';
import { KudosService } from '../../kudos/kudos.service';
import { PrismaService } from '../../core-services/prisma.service';
import { EmailService } from '../../core-services/email.service';
import { UserService } from '../user/user.service';
import { SkipThrottle } from '@nestjs/throttler';
import { UserNotificationsModule } from '../user-notifications/user-notifications.module';
import { CommentsService } from 'src/(comments)/comments/comments.service';
@SkipThrottle()
@Module({
  imports: [UserNotificationsModule],
  controllers: [UserLikesController],
  providers: [
    UserLikesService,
    KudosService,
    PrismaService,
    EmailService,
    UserService,
    CommentsService,
  ],
  exports: [UserLikesService],
})
export class UserLikesModule {}
