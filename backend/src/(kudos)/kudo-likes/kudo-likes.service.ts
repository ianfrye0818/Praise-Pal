import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../core-services/prisma.service';
import { KudosService } from '../kudos/kudos.service';

@Injectable()
export class KudoLikesService {
  constructor(
    private prismaService: PrismaService,
    private kudosService: KudosService,
  ) {}

  async createLike({ userId, kudosId }: { userId: string; kudosId: string }) {
    try {
      await this.prismaService.kudo_Like.create({
        data: {
          kudosId,
          userId,
        },
      });

      await this.kudosService.increaseLikes(kudosId, userId);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        throw new HttpException('You already liked this kudos', 400);
      }
      throw new InternalServerErrorException('Could not create like');
    }
  }

  async deleteLike({ kudosId, userId }: { kudosId: string; userId: string }) {
    try {
      await this.prismaService.kudo_Like.delete({
        where: {
          userId_kudosId: {
            kudosId,
            userId,
          },
        },
      });

      await this.kudosService.decreaseLikes(kudosId, userId);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025')
        throw new HttpException('You already unliked this kudos', 400);
      throw new InternalServerErrorException('Could not delete like');
    }
  }
}
