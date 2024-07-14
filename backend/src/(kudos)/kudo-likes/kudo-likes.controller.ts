import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { KudoLikesService } from './kudo-likes.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { ClientUser } from '../../types';

@UseGuards(JwtGuard)
@Controller('likes')
export class KudoLikesController {
  constructor(private kudoLikesService: KudoLikesService) {}

  @Post(':id')
  async updateLike(@Param('id') kudosId: string, @Request() req: any) {
    return await this.kudoLikesService.createLike({
      kudosId,
      userId: (req.user as ClientUser).userId,
    });
  }

  @Delete(':id')
  async deleteLike(@Param('id') kudosId: string, @Request() req: any) {
    return await this.kudoLikesService.deleteLike({
      kudosId,
      userId: (req.user as ClientUser).userId,
    });
  }
}
