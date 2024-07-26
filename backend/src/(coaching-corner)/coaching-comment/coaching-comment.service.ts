import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma.service';
import {
  coachingCommentSelectOptions,
  userSelectOptions,
} from 'src/utils/constants';
import { FilterCoachingCommentDTO } from './dto/filter-coaching-comment.dto';
import {
  CreateCoachingCommentDTO,
  UpdateCoachingCommentDTO,
} from './dto/create-coaching-comment.dto';
import { UserService } from 'src/(user)/user/user.service';
import { getDisplayName } from 'src/utils';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { ActionType } from '@prisma/client';

@Injectable()
export class CoachingCommentService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private userNotificationService: UserNotificationsService,
  ) {}

  async findAllCoachingComments(filter?: FilterCoachingCommentDTO) {
    const { take, skip, sort, ...otherFilters } = filter;
    try {
      return await this.prismaService.coachingComment.findMany({
        where: { ...otherFilters },
        orderBy: { createdAt: sort || 'asc' },
        select: coachingCommentSelectOptions,
        take,
        skip: skip || 0,
      });
    } catch (error) {
      console.error(['findAllCoachingComments', error]);
      throw new InternalServerErrorException(
        'Could not retrieve coaching comments',
      );
    }
  }

  async findCoachingCommentById(id: string) {
    try {
      return await this.prismaService.coachingComment.findUnique({
        where: { id },
        select: coachingCommentSelectOptions,
      });
    } catch (error) {
      console.error(['findCoachingCommentById', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException('Comment not found');
      } else {
        throw new InternalServerErrorException(
          'Could not retrieve coaching comment',
        );
      }
    }
  }

  async createCoachingComment(data: CreateCoachingCommentDTO) {
    if (data.parentId) return this.createChildCommnet(data);
    try {
      const newComment = await this.prismaService.coachingComment.create({
        data,
        select: { coachingQuestion: true, id: true },
      });

      const commentingUser = await this.userService.findOneById(data.userId);

      const displayName = getDisplayName(commentingUser);

      if (commentingUser.userId !== newComment.coachingQuestion.authorId) {
        await this.userNotificationService.createNotification({
          actionType: ActionType.COACHING_COMMENT,
          coachingQuestionId: data.coachingQuestionId,
          message: `${displayName} commented on your coaching question`,
          userId: data.userId,
        });
      }

      return newComment;
    } catch (error) {
      console.error(['createCoachingComment', error]);
      throw new InternalServerErrorException(
        'Could not create coaching comment',
      );
    }
  }

  async createChildCommnet(data: CreateCoachingCommentDTO) {
    try {
      const parentComment = await this.findCoachingCommentById(data.parentId);

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      const childComment = await this.prismaService.coachingComment.create({
        data,
        select: { id: true, parentComment: true, userId: true },
      });

      const commentingUser = await this.userService.findOneById(data.userId);

      const displayName = getDisplayName(commentingUser);

      if (parentComment.user.userId !== childComment.userId) {
        await this.userNotificationService.createNotification({
          actionType: ActionType.COACHING_COMMENT_COMMENT,
          coachingQuestionId: data.coachingQuestionId,
          message: `${displayName} replied to your coaching comment`,
          userId: parentComment.user.userId,
        });
      }

      return childComment;
    } catch (error) {
      console.error(['createChildComment', error]);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Could not create coaching comment',
        );
      }
    }
  }

  async updateCoachingCommentById(id: string, data: UpdateCoachingCommentDTO) {
    try {
      return await this.prismaService.coachingComment.update({
        where: { id },
        data,
        select: coachingCommentSelectOptions,
      });
    } catch (error) {
      console.error(['updateCoachingCommentById', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException('Comment not found');
      } else {
        throw new InternalServerErrorException(
          'Could not update coaching comment',
        );
      }
    }
  }

  async deleteCoachingCommentById(id: string) {
    try {
      return await this.prismaService.coachingComment.delete({
        where: { id },
        select: coachingCommentSelectOptions,
      });
    } catch (error) {
      console.error(['deleteCoachingCommentById', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException('Comment not found');
      } else {
        throw new InternalServerErrorException(
          'Could not delete coaching comment',
        );
      }
    }
  }

  async findNestedCoachingComments(comment: any) {
    const stack = [comment];

    while (stack.length > 0) {
      const currentComment = stack.pop();
      currentComment.comments =
        await this.prismaService.coachingComment.findMany({
          where: { parentId: currentComment.id },
          include: {
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
