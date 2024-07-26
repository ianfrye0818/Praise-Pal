import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma.service';
import { CoachingQuestionFilterDTO } from './dto/filter-coaching-question.dto';
import { Prisma } from '@prisma/client';
import { coachingQuestionSelectOptions } from 'src/utils/constants';
import {
  CreateCoachingQuestionDTO,
  UpdateCoachingQuestionDTO,
} from './dto/create-coaching-question.dto';
import { CoachingCommentService } from '../coaching-comment/coaching-comment.service';

@Injectable()
export class CoachingQuestionService {
  constructor(
    private prismaService: PrismaService,
    private coachingCommentService: CoachingCommentService,
  ) {}

  async getAllCoachingQuestions(
    filter: CoachingQuestionFilterDTO,
    select?: Prisma.CoachingQuestionSelect,
  ) {
    const { take, skip, sort, ...otherFilters } = filter;

    try {
      const coachingQuestions =
        await this.prismaService.coachingQuestion.findMany({
          where: { ...otherFilters },
          orderBy: [{ createdAt: sort || 'desc' }, { id: sort || 'asc' }],
          take,
          skip,
          select: select || coachingQuestionSelectOptions,
        });

      if (!coachingQuestions)
        throw new NotFoundException('No coaching questions found');

      return coachingQuestions;
    } catch (error) {
      console.error(['getAllCoachingQuestions', error]);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Could not retrieve coaching questions',
      );
    }
  }

  async getCoachingQuestionById(
    id: string,
    select?: Prisma.CoachingQuestionSelect,
  ) {
    try {
      const coachingQuestion =
        await this.prismaService.coachingQuestion.findUnique({
          where: { id },
          select: select || coachingQuestionSelectOptions,
        });

      if (!coachingQuestion)
        throw new NotFoundException('No coaching question found');

      for (const comment of coachingQuestion.comments) {
        await this.coachingCommentService.findNestedCoachingComments(comment);
      }
      return coachingQuestion;
    } catch (error) {
      console.error(['getCoachingQuestionById', error]);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Could not retrieve coaching question',
      );
    }
  }

  async createCoachingQuestion(
    data: CreateCoachingQuestionDTO,
    select?: Prisma.CoachingQuestionSelect,
  ) {
    try {
      const newCoachingQuestion =
        await this.prismaService.coachingQuestion.create({
          data,
          select: select || coachingQuestionSelectOptions,
        });

      return newCoachingQuestion;
    } catch (error) {
      console.error(['createCoachingQuestion', error]);
      throw new InternalServerErrorException(
        'Could not create coaching question',
      );
    }
  }

  async upddateCoachingQuestionById(
    id: string,
    data: UpdateCoachingQuestionDTO,
  ) {
    try {
      const coachingQuestion = await this.prismaService.coachingQuestion.update(
        {
          where: { id },
          data,
          select: coachingQuestionSelectOptions,
        },
      );
      return coachingQuestion;
    } catch (error) {
      console.error(['updateCoachingQuestionById', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException('Coaching question not found');
      }
      throw new InternalServerErrorException(
        'Could not update coaching question',
      );
    }
  }

  async deleteCoachingQuestionById(id: string) {
    try {
      await this.prismaService.coachingQuestion.delete({
        where: { id },
      });
    } catch (error) {
      console.error(['deleteCoachingQuestionById', error]);
      throw new InternalServerErrorException(
        'Could not delete coaching question',
      );
    }
  }
}
