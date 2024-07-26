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
import { CoachingCommentService } from './coaching-comment.service';
import { SkipThrottle } from '@nestjs/throttler';
import { FilterCoachingCommentDTO } from './dto/filter-coaching-comment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  CreateCoachingCommentDTO,
  UpdateCoachingCommentDTO,
} from './dto/create-coaching-comment.dto';
import { CompanyGuard } from 'src/core-guards/company.guard';
import { UpdateCoachingCommentGuard } from './guards/update-coaching-comment.guard';

@UseGuards(JwtGuard, CompanyGuard)
@Controller('coaching-comment')
export class CoachingCommentController {
  constructor(
    private readonly coachingCommentService: CoachingCommentService,
  ) {}

  @SkipThrottle()
  @Get()
  async findAllCoachingComments(@Query() filter: FilterCoachingCommentDTO) {
    return this.coachingCommentService.findAllCoachingComments(filter);
  }

  @SkipThrottle()
  @Get(':commentId')
  async findCoachingCommentById(@Param('commentId') commentId: string) {
    return this.coachingCommentService.findCoachingCommentById(commentId);
  }

  @Post()
  async createCoachingComment(@Body() payload: CreateCoachingCommentDTO) {
    return this.coachingCommentService.createCoachingComment(payload);
  }

  @UseGuards(UpdateCoachingCommentGuard)
  @Patch(':commentId')
  async updateCoachingCommentById(
    @Param('commentId') commentId: string,
    @Body() payload: UpdateCoachingCommentDTO,
  ) {
    return this.coachingCommentService.updateCoachingCommentById(
      commentId,
      payload,
    );
  }

  @UseGuards(UpdateCoachingCommentGuard)
  @Delete(':commentId')
  async deleteCoachingCommentById(@Param('commentId') commentId: string) {
    return this.coachingCommentService.deleteCoachingCommentById(commentId);
  }
}
