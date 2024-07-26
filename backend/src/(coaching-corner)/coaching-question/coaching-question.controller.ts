import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoachingQuestionService } from './coaching-question.service';
import { CompanyGuard } from 'src/core-guards/company.guard';
import { CoachingQuestionFilterDTO } from './dto/filter-coaching-question.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  CreateCoachingQuestionDTO,
  UpdateCoachingQuestionDTO,
} from './dto/create-coaching-question.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdateCoachingQuestionGuard } from './guards/update-coaching-question.guard';

@UseGuards(JwtGuard)
@Controller('coaching-question')
export class CoachingQuestionController {
  constructor(
    private readonly coachingQuestionService: CoachingQuestionService,
  ) {}

  @SkipThrottle()
  @UseGuards(CompanyGuard)
  @Get()
  async findall(@Query() filter: CoachingQuestionFilterDTO) {
    return await this.coachingQuestionService.getAllCoachingQuestions(filter);
  }

  @SkipThrottle()
  @UseGuards(CompanyGuard)
  @Get(':questionId')
  async findQuestionById(@Param('questionId') questionId: string) {
    return await this.coachingQuestionService.getCoachingQuestionById(
      questionId,
    );
  }

  @UseGuards(CompanyGuard)
  @Post()
  async createQuestion(@Body() payload: CreateCoachingQuestionDTO) {
    return await this.coachingQuestionService.createCoachingQuestion(payload);
  }

  @UseGuards(UpdateCoachingQuestionGuard)
  @Patch(':questionId')
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() payload: UpdateCoachingQuestionDTO,
  ) {
    return await this.coachingQuestionService.upddateCoachingQuestionById(
      questionId,
      payload,
    );
  }

  @UseGuards(UpdateCoachingQuestionGuard)
  @Delete(':questionId')
  async deleteQuestion(@Param('questionId') questionId: string) {
    return await this.coachingQuestionService.deleteCoachingQuestionById(
      questionId,
    );
  }
}
