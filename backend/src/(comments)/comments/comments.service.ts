import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ActionType } from '@prisma/client';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/createComment.dto';
import { Cron } from '@nestjs/schedule';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { commentSelectOptions, userSelectOptions } from 'src/utils/constants';
import { FilterCommentDTO } from './dto/filterCommentDTO';
import { PrismaService } from 'src/core-services/prisma.service';
import { EmailService } from 'src/core-services/email.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  async findAllComments(filter?: FilterCommentDTO) {
    const { limit, offset, sort, ...otherFilters } = filter;
    try {
      const comments = await this.prismaService.comment.findMany({
        where: { deletedAt: filter.deletedAt || null, ...otherFilters },
        orderBy: { createdAt: sort || 'asc' },
        select: commentSelectOptions,
        take: limit,
        skip: offset,
      });
      if (!comments) throw new NotFoundException('No comments found');
      return comments;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async findCommentById(commentId: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
        select: commentSelectOptions,
      });
      if (!comment) throw new NotFoundException('Comment not found');
      return comment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async createKudoComment(payload: CreateCommentDTO) {
    if (payload.parentId) return this.createChildComment(payload);
    const newComment = await this.prismaService.comment.create({
      data: payload,
      select: {
        kudos: true,
        id: true,
      },
    });
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const commentingUser = await prisma.user.findUnique({
          where: { userId: payload.userId },
          select: {
            displayName: true,
            firstName: true,
            lastName: true,
          },
        });

        const displayName =
          `${commentingUser.firstName} ${commentingUser.lastName[0]}` ||
          commentingUser.displayName;

        await this.userNotificationsService.createNotification({
          actionType: ActionType.KUDOS_COMMENT,
          referenceId: [newComment.id],
          kudosId: payload.kudosId,
          commentId: newComment.id,
          userId: newComment.kudos.senderId,
          message: `${displayName} commented on a Kudo you sent`,
        });

        await this.userNotificationsService.createNotification({
          actionType: ActionType.KUDOS_COMMENT,
          referenceId: [newComment.id],
          kudosId: payload.kudosId,
          commentId: newComment.id,
          userId: newComment.kudos.receiverId,
          message: `${displayName} commented on Kudo you received`,
        });

        return newComment;
      });
      return newComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create comment');
    }
  }

  async createChildComment(payload: CreateCommentDTO) {
    try {
      const parentComment = await this.prismaService.comment.findUnique({
        where: { id: payload.parentId },
        select: commentSelectOptions,
      });

      if (!parentComment)
        throw new NotFoundException('Parent comment not found');

      const childComment = await this.prismaService.comment.create({
        data: payload,
        select: { id: true },
      });
      const newComment = await this.prismaService.$transaction(
        async (prisma) => {
          const commentingUser = await prisma.user.findUnique({
            where: { userId: payload.userId },
            select: {
              displayName: true,
              firstName: true,
              lastName: true,
            },
          });

          const displayName =
            `${commentingUser.firstName} ${commentingUser.lastName[0]}` ||
            commentingUser.displayName;

          await this.userNotificationsService.createNotification({
            actionType: ActionType.COMMENT_COMMENT,
            referenceId: [parentComment.id, childComment.id],
            kudosId: payload.kudosId,
            commentId: childComment.id,
            userId: parentComment.user.userId,
            message: `${displayName} replied to your comment`,
          });

          return childComment;
        },
      );
      return newComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create comment');
    }
  }

  async updateCommentById(commentId: string, comment: UpdateCommentDTO) {
    try {
      const updatedComment = await this.prismaService.comment.update({
        where: { id: commentId },
        data: comment,
        select: commentSelectOptions,
      });
      return updatedComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not update comment');
    }
  }

  async increaseLikes(id: string, userId: string): Promise<void> {
    const updatedComment = await this.prismaService.comment.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
      select: {
        id: true,
        kudos: true,
        user: {
          select: {
            userId: true,
          },
        },
      },
    });
    try {
      await this.prismaService.$transaction(async (prisma) => {
        if (updatedComment.user.userId !== userId) {
          const likingUser = await prisma.user.findUnique({
            where: { userId },
          });

          if (likingUser) {
            const displayName =
              `${likingUser.firstName} ${likingUser.lastName[0]}` ||
              likingUser.displayName;

            await prisma.userNotifications.create({
              data: {
                userId: updatedComment.user.userId,
                actionType: ActionType.COMMENT_LIKE,
                referenceId: [updatedComment.id],
                kudosId: updatedComment.kudos.id,
                commentId: updatedComment.id,
                message: `${displayName} liked your comment`,
              },
            });
          }
        }
      });
    } catch (error) {
      console.error(['Increase Comment Likes Error'], error);
      throw new InternalServerErrorException('Could not like Comment');
    }
  }
  async decreaseLikes(id: string, userId: string): Promise<void> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const updatedComment = await prisma.comment.update({
          where: { id },
          data: {
            likes: {
              decrement: 1,
            },
          },
          select: commentSelectOptions,
        });

        if (updatedComment.user.userId !== userId) {
          const unlikingUser = await prisma.user.findUnique({
            where: { userId },
          });

          if (unlikingUser) {
            await this.userNotificationsService.deleteNotificationByReferrenceId(
              [updatedComment.id],
            );
          }
        }
      });
    } catch (error) {
      console.error(['Decrease comment Likes Error'], error);
      throw error;
    }
  }

  async deleteCommentsById(commentId: string) {
    try {
      await this.prismaService.comment.delete({
        where: { id: commentId },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not delete comment');
    }
  }

  @Cron('0 0 * * *') // Run every night at midnight
  async permanentlyDeleteOldComments() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    try {
      await this.prismaService.user.deleteMany({
        where: {
          deletedAt: {
            lte: dateThreshold,
          },
        },
      });
    } catch (error) {
      console.error(error);
      this.emailService.sendCronErrorNotification(
        error.message,
        'Delete Comments',
      );
    }
  }
}
