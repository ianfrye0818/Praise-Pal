import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ActionType, Comment } from '@prisma/client';
import { PrismaService } from '../core-services/prisma.service';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/createComment.dto';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../core-services/email.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { commentSelectOptions } from 'src/utils/constants';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  async findAllComments(filter?: Partial<Comment>) {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: filter,
        orderBy: { id: 'desc' },
        select: commentSelectOptions,
      });
      if (!comments) throw new NotFoundException('No comments found');
      console.log(comments);
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
    try {
      const newComment = await this.prismaService.$transaction(
        async (prisma) => {
          const comment = await prisma.comment.create({
            data: payload,
            select: commentSelectOptions,
          });

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
            actionType: ActionType.COMMENT,
            referenceId: comment.kudosId,
            userId: comment.user.userId,
            message: `${displayName} commented on your kudos`,
          });

          return comment;
        },
      );
      return newComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create comment');
    }
  }

  async createChildComment(payload: CreateCommentDTO) {
    try {
      const newComment = await this.prismaService.$transaction(
        async (prisma) => {
          const parentComment = await prisma.comment.findUnique({
            where: { id: payload.parentId },
            select: commentSelectOptions,
          });

          if (!parentComment)
            throw new NotFoundException('Parent comment not found');

          const childComment = await prisma.comment.create({
            data: payload,
            select: commentSelectOptions,
          });

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
            actionType: ActionType.COMMENT,
            referenceId: parentComment.id,
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

  async softDeleteCommentById(commentId: string) {
    try {
      const deletedComment = await this.prismaService.$transaction(
        async (prisma) => {
          const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: commentSelectOptions,
          });

          if (!comment) throw new NotFoundException('Comment not found');

          const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { deletedAt: new Date() },
            select: commentSelectOptions,
          });

          await this.userNotificationsService.hardDeleteNotification({
            referenceId: comment.id,
            userId: comment.user.userId,
          });

          return updatedComment;
        },
      );
      return deletedComment;
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
