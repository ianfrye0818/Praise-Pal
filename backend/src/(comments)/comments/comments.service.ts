import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ActionType } from '@prisma/client';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/createComment.dto';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { commentSelectOptions, userSelectOptions } from 'src/utils/constants';
import { FilterCommentDTO } from './dto/filterCommentDTO';
import { PrismaService } from 'src/core-services/prisma.service';
import { UserService } from 'src/(user)/user/user.service';
import { getDisplayName } from 'src/utils';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userNotificationsService: UserNotificationsService,
    private readonly userService: UserService,
  ) {}

  async findAllComments(filter?: FilterCommentDTO) {
    const { take, skip, sort, ...otherFilters } = filter;
    try {
      const comments = await this.prismaService.comment.findMany({
        where: { ...otherFilters },
        orderBy: { createdAt: sort || 'asc' },
        select: commentSelectOptions,
        take,
        skip: skip || 0,
      });
      return comments;
    } catch (error) {
      console.error(['findAllComments'], error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async findCommentById(commentId: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
        select: commentSelectOptions,
      });
      return comment;
    } catch (error) {
      console.error(['findCommentById'], error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Comment not found');
      } else {
        throw new InternalServerErrorException('Could not retreive Kudos');
      }
    }
  }

  async createKudoComment(payload: CreateCommentDTO) {
    if (payload.parentId) return this.createChildComment(payload);
    try {
      const newComment = await this.prismaService.comment.create({
        data: payload,
        select: {
          kudos: true,
          id: true,
        },
      });

      const commentingUser = await this.userService.findOneById(payload.userId);
      const displayName = getDisplayName(commentingUser);
      const { senderId, receiverId } = newComment.kudos;

      if (commentingUser.userId !== senderId) {
        await this.userNotificationsService.createNotification({
          actionType: ActionType.KUDOS_COMMENT,
          kudosId: payload.kudosId,
          commentId: newComment.id,
          userId: senderId,
          message: `${displayName} commented on a Kudo you sent`,
        });
      }

      if (commentingUser.userId !== receiverId) {
        await this.userNotificationsService.createNotification({
          actionType: ActionType.KUDOS_COMMENT,
          kudosId: payload.kudosId,
          commentId: newComment.id,
          userId: receiverId,
          message: `${displayName} commented on a Kudo you received`,
        });
      }

      return newComment;
    } catch (error) {
      console.error(['Create Kudo Comment Error'], error);
      throw new InternalServerErrorException('Could not create comment');
    }
  }

  async createChildComment(payload: CreateCommentDTO) {
    try {
      const parentComment = await this.findCommentById(payload.parentId);

      if (!parentComment)
        throw new NotFoundException('Parent comment not found');

      const childComment = await this.prismaService.comment.create({
        data: payload,
        select: { id: true, userId: true },
      });

      const commentingUser = await this.userService.findOneById(payload.userId);
      const displayName = getDisplayName(commentingUser);

      if (parentComment.user.userId !== childComment.userId) {
        await this.userNotificationsService.createNotification({
          actionType: ActionType.COMMENT_COMMENT,
          kudosId: payload.kudosId,
          commentId: childComment.id,
          userId: parentComment.user.userId,
          message: `${displayName} replied to your comment`,
        });
      }

      return childComment;
    } catch (error) {
      console.error(['Create Child Comment Error'], error);
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
      console.error(['Update Comment Error'], error);
      throw new InternalServerErrorException('Could not update comment');
    }
  }

  async increaseLikes(id: string) {
    try {
      return await this.prismaService.comment.update({
        where: { id },
        data: {
          likes: {
            increment: 1,
          },
        },
        select: {
          id: true,
          kudosId: true,
          user: {
            select: {
              userId: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(['Increase Comment Likes Error'], error);
      throw new InternalServerErrorException('Could not like Comment');
    }
  }
  async decreaseLikes(id: string) {
    try {
      return await this.prismaService.comment.update({
        where: { id },
        data: {
          likes: {
            decrement: 1,
          },
        },
        select: {
          usernotifications: { select: { id: true } },
          id: true,
          user: { select: { userId: true } },
        },
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
      console.error(['Delete Comment Error'], error);
      throw new InternalServerErrorException('Could not delete comment');
    }
  }

  async findNestedComments(comment: any) {
    const stack = [comment];

    while (stack.length > 0) {
      const currentComment = stack.pop();
      currentComment.comments = await this.prismaService.comment.findMany({
        where: { parentId: currentComment.id },
        include: {
          commentLikes: true,
          user: { select: userSelectOptions },
        },
        orderBy: { createdAt: 'asc' },
      });

      for (const childComment of currentComment.comments) {
        stack.push(childComment);
      }
    }
  }
}
