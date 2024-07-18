import { Module } from '@nestjs/common';
import { KudoLikesController } from './kudo-likes.controller';
import { KudoLikesService } from './kudo-likes.service';
import { PrismaService } from '../../core-services/prisma.service';
import { EmailService } from '../../core-services/email.service';
import { UserService } from '../../(user)/user/user.service';
import { SkipThrottle } from '@nestjs/throttler';
import { UserNotificationsModule } from '../../(user)/user-notifications/user-notifications.module';
import { CommentsService } from 'src/(comments)/comments/comments.service';
import { KudosService } from '../kudos/kudos.service';
@SkipThrottle()
@Module({
  imports: [UserNotificationsModule],
  controllers: [KudoLikesController],
  providers: [
    KudoLikesService,
    KudosService,
    PrismaService,
    EmailService,
    UserService,
    CommentsService,
  ],
  exports: [KudoLikesService],
})
export class UserLikesModule {}
