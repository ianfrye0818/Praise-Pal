import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { Request } from 'express';
import { CommentsService } from 'src/(comments)/comments/comments.service';
import { ClientUser } from 'src/types';

@Injectable()
export class EditCommentGuard implements CanActivate {
  constructor(private commentService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const jwtUser = request.user as ClientUser;

    const method = request.method;
    const companyCode = jwtUser.companyCode;
    const commentId = request.params.commentId || request.query.commentId;

    const comment = await this.commentService.findCommentById(
      commentId as string,
    );

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }

    // Super admin can do anything
    if (jwtUser.role === Role.SUPER_ADMIN) return true;

    // Company owner and admin can delete comments in their company
    if (
      (jwtUser.role === Role.ADMIN || jwtUser.role === Role.COMPANY_OWNER) &&
      jwtUser.companyCode === companyCode &&
      method === 'DELETE'
    ) {
      return true;
    }

    // Users can update or delete their own comments
    if (jwtUser.userId === comment.user.userId) return true;

    const message = method === 'PATCH' ? 'update' : 'delete';

    throw new ForbiddenException(
      `You are not allowed to ${message} this comment`,
    );
  }
}
