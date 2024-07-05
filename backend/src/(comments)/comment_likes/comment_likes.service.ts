import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../core-services/prisma.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { CommentsService } from '../comments/comments.service';
import { UserService } from 'src/(user)/user/user.service';
import { ActionType } from '@prisma/client';

@Injectable()
export class CommentLikesService {
  constructor(
    private prismaService: PrismaService,
    private commentService: CommentsService,
    private userNotificationsService: UserNotificationsService,
    private usersService: UserService,
  ) {}

  async createLike({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }) {
    try {
      await this.prismaService.comment_Like.create({
        data: {
          commentId,
          userId,
        },
      });

      const updatedComment = await this.commentService.increaseLikes(commentId);

      if (updatedComment.user.userId !== userId) {
        const likingUser = await this.usersService.findOneById(userId);

        if (likingUser) {
          const displayName =
            `${likingUser.firstName} ${likingUser.lastName[0]}` ||
            likingUser.displayName;

          await this.userNotificationsService.createNotification({
            userId: updatedComment.user.userId,
            actionType: ActionType.COMMENT_LIKE,
            referenceId: [updatedComment.id],
            kudosId: updatedComment.kudosId,
            commentId: updatedComment.id,
            message: `${displayName} liked your comment`,
          });
        }
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        throw new HttpException('You already liked this kudos', 400);
      }
      throw new InternalServerErrorException('Could not create like');
    }
  }

  async deleteLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }) {
    try {
      await this.prismaService.comment_Like.delete({
        where: {
          userId_commentId: {
            commentId,
            userId,
          },
        },
      });

      const updatedComment = await this.commentService.decreaseLikes(commentId);

      if (updatedComment.user.userId !== userId) {
        const unlikingUser = await this.usersService.findOneById(userId);

        if (unlikingUser) {
          await Promise.all(
            updatedComment.usernotifications.map(async (notification) => {
              await this.userNotificationsService.deleteNotificationById(
                notification.id,
              );
            }),
          );
        }
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025')
        throw new HttpException('You already unliked this kudos', 400);
      throw new InternalServerErrorException('Could not delete like');
    }
  }
}
