import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../../auth/guards/jwt.guard';
import { ClientUser } from '../../types';
import { CommentLikesService } from './comment_likes.service';

@UseGuards(JwtGuard)
@Controller('comment-likes')
export class CommentLikesController {
  constructor(private commentLikeService: CommentLikesService) {}

  @Post(':id')
  async updateLike(@Param('id') commentId: string, @Request() req: any) {
    return await this.commentLikeService.createLike({
      commentId,
      userId: (req.user as ClientUser).userId,
    });
  }

  @Delete(':id')
  async deleteLike(@Param('id') commentId: string, @Request() req: any) {
    return await this.commentLikeService.deleteLike({
      commentId,
      userId: (req.user as ClientUser).userId,
    });
  }
}
