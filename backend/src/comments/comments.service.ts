import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../core-services/prisma.service';
import { ClientComment } from '../types';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/createComment.dto';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../core-services/email.service';

@Injectable()
export class CommentsService {
  private readonly userSelectProps = {
    select: {
      userId: true,
      displayName: true,
      firstName: true,
      lastName: true,
      email: true,
      companyId: true,
      role: true,
      createdAt: true,
    },
  };
  private readonly commentSelectProps = {
    select: {
      id: true,
      content: true,
      kudosId: true,
      parentId: true,
      user: this.userSelectProps,
    },
  };
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAllComments(filter?: Partial<Comment>): Promise<ClientComment[]> {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: filter,
        orderBy: { id: 'desc' },
        ...this.commentSelectProps,
      });
      if (!comments) throw new NotFoundException('No comments found');
      return comments;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async findCommentById(commentId: string): Promise<ClientComment> {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
        ...this.commentSelectProps,
      });
      if (!comment) throw new NotFoundException('Comment not found');
      return comment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async createComment(comment: CreateCommentDTO): Promise<ClientComment> {
    try {
      const newComment = await this.prismaService.comment.create({
        data: comment,
        ...this.commentSelectProps,
      });
      return newComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create comment');
    }
  }

  async updateCommentById(
    commentId: string,
    comment: UpdateCommentDTO,
  ): Promise<ClientComment> {
    try {
      const updatedComment = await this.prismaService.comment.update({
        where: { id: commentId },
        data: comment,
        ...this.commentSelectProps,
      });
      return updatedComment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not update comment');
    }
  }

  async softDeleteCommentById(commentId: string): Promise<ClientComment> {
    try {
      const deletedComment = await this.updateCommentById(commentId, {});
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
