import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientUser } from '../types';
import { Request } from 'express';
import { CommentsService } from 'src/(comments)/comments/comments.service';

@Injectable()
export class EditCommentGuard implements CanActivate {
  constructor(private commentService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const jwtUser = request.user as ClientUser;

    const method = request.method;
    const companyId = jwtUser.companyId;
    const commentId = request.params.commentId || request.query.commentId;

    const comment = await this.commentService.findCommentById(
      commentId as string,
    );

    if (jwtUser.role === Role.SUPER_ADMIN) return true;

    if (
      jwtUser.role === Role.ADMIN &&
      jwtUser.companyId === companyId &&
      method === 'DELETE'
    )
      return true;

    if (jwtUser.userId === comment.user.userId) return true;

    const message = method === 'PATCH' ? 'update' : 'delete';

    throw new ForbiddenException(
      `You are not allowed to ${message} this comment`,
    );
  }
}
