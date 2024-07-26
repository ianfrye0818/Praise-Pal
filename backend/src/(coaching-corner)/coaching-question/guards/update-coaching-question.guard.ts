import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientUser } from 'src/types';
import { CoachingQuestionService } from '../coaching-question.service';

@Injectable()
export class UpdateCoachingQuestionGuard implements CanActivate {
  constructor(private coachingQuestionService: CoachingQuestionService) {}

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

    const questionId = request.params.questionId || request.query.questionId;

    const coachingQuestion =
      await this.coachingQuestionService.getCoachingQuestionById(questionId);

    if (!coachingQuestion) {
      throw new ForbiddenException('Kudos not found');
    }

    if (coachingQuestion.author.userId === jwtUser.userId) return true;

    throw new ForbiddenException('You are not allowed to update this kudos');
  }
}
