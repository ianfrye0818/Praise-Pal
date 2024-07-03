import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment_likes.service';
import { CommentLikesController } from './comment_likes.controller';
import { CommentsService } from '../comments/comments.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { EmailService } from 'src/core-services/email.service';

@Module({
  controllers: [CommentLikesController],
  providers: [
    CommentLikesService,
    CommentsService,
    PrismaService,
    UserNotificationsService,
    EmailService,
  ],
  exports: [CommentLikesService],
})
export class CommentLikesModule {}
