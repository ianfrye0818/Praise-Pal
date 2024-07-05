import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CommentsService } from './comments.service';
import { CreateCommentDTO, UpdateCommentDTO } from './dto/createComment.dto';
import { FilterCommentDTO } from './dto/filterCommentDTO';
import { CompanyGuard } from 'src/core-guards/company.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { EditCommentGuard } from 'src/core-guards/update-delete-comment.guard';

@UseGuards(CompanyGuard)
@UseGuards(JwtGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @SkipThrottle()
  @Get()
  async findAllComments(@Query() filter: FilterCommentDTO) {
    return this.commentsService.findAllComments(filter);
  }

  @SkipThrottle()
  @Get(':commentId')
  async findCommentById(@Param('commentId') commentId: string) {
    return this.commentsService.findCommentById(commentId);
  }

  @Post()
  async createComment(@Body() comment: CreateCommentDTO) {
    return this.commentsService.createKudoComment(comment);
  }

  @Post(':commentId')
  async createReplay(@Body() comment: CreateCommentDTO) {
    return this.commentsService.createChildComment(comment);
  }

  @UseGuards(EditCommentGuard)
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() comment: UpdateCommentDTO,
  ) {
    return this.commentsService.updateCommentById(commentId, comment);
  }

  @UseGuards(EditCommentGuard)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteCommentsById(commentId);
  }
}
