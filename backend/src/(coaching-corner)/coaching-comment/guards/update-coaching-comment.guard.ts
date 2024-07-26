import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientUser } from 'src/types';
import { CoachingCommentService } from '../coaching-comment.service';

@Injectable()
export class UpdateCoachingCommentGuard implements CanActivate {
  constructor(private coachingCommentService: CoachingCommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user as ClientUser;

    if (jwtUser.role === Role.SUPER_ADMIN) return true;

    const companyCode = request.params.companyCode || request.query.companyCode;

    if (
      (jwtUser.role === Role.ADMIN || jwtUser.role === Role.COMPANY_OWNER) &&
      jwtUser.companyCode === companyCode
    ) {
      return true;
    }

    const commentId = request.params.commentId || request.query.commentId;

    const comment =
      await this.coachingCommentService.findCoachingCommentById(commentId);

    if (!comment) {
      throw new ForbiddenException('Kudos not found');
    }

    if (comment.user.userId === jwtUser.userId) return true;

    throw new ForbiddenException('You are not allowed to update this kudos');
  }
}
