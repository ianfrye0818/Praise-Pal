import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createKudosDTO, UpdateKudosDTO } from './dto/createKudos.dto';
import { ActionType, Kudos, Prisma } from '@prisma/client';
import { KudosFilterDTO } from './dto/kudosFilter.dto';
import {
  commentSelectOptions,
  kudoSelectOptions,
  userSelectOptions,
} from 'src/utils/constants';
import { CommentsService } from 'src/(comments)/comments/comments.service';
import { getDisplayName } from 'src/utils';
import { UserService } from 'src/(user)/user/user.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';

@Injectable()
export class KudosService {
  constructor(
    private prismaService: PrismaService,
    private userNotificationsService: UserNotificationsService,
    private commentService: CommentsService,
    private userService: UserService,
  ) {}

  async getAllKudos(filter: KudosFilterDTO, select?: Prisma.KudosSelect) {
    const { take, skip, sort, ...otherFilters } = filter;
    try {
      const kudos = await this.prismaService.kudos.findMany({
        where: { ...otherFilters },
        orderBy: [{ createdAt: sort || 'desc' }, { id: sort || 'asc' }],
        take,
        skip,
        select: select || {
          ...kudoSelectOptions,
          comments: {
            where: { parentId: null },
            select: {
              ...commentSelectOptions,
            },
            orderBy: [
              {
                createdAt: sort || 'asc',
              },
              { id: 'asc' },
            ],
          },
        },
      });
      if (!kudos) throw new NotFoundException('No Kudos found');
      return kudos;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retrieve Kudos');
    }
  }

  async getKudoById(id: string, select?: Prisma.KudosSelect) {
    try {
      const kudo = await this.prismaService.kudos.findUnique({
        where: { id },
        select: select || {
          ...kudoSelectOptions,
          comments: {
            where: { parentId: null },
            include: {
              commentLikes: true,
              user: { select: userSelectOptions },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!kudo) throw new NotFoundException('Unable to locate Kudo ' + id);

      for (const comment of kudo.comments) {
        await this.commentService.findNestedComments(comment);
      }
      return kudo;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retrieve Kudo');
    }
  }

  async createKudo(data: createKudosDTO, select?: Prisma.KudosSelect) {
    try {
      const kudo = await this.prismaService.kudos.create({
        data,
        select: select || {
          sender: true,
          receiverId: true,
          id: true,
          isAnonymous: true,
        },
      });

      const displayName = getDisplayName(kudo.sender, kudo.isAnonymous);

      if (kudo.sender.userId !== kudo.receiverId) {
        await this.userNotificationsService.createNotification({
          userId: kudo.receiverId,
          actionType: ActionType.KUDOS,
          kudosId: kudo.id,
          message: `${displayName} sent you a kudos`,
        });
      }

      return kudo;
    } catch (error) {
      console.error(['Create Kudo Error'], error);
      throw new InternalServerErrorException('Could not create Kudo');
    }
  }

  kudoIncludeOptions = {
    comments: true,
    sender: true,
  };

  async updateKudoById(id: string, data: UpdateKudosDTO): Promise<Kudos> {
    try {
      const kudo = await this.prismaService.kudos.update({
        data,
        where: { id },
      });
      if (!kudo)
        throw new NotFoundException('Could not find kudo with id of ' + id);
      return kudo;
    } catch (error) {
      console.error(['Update Kudo Error'], error);

      throw error;
    }
  }

  async increaseLikes(id: string, userId: string) {
    try {
      const updatedKudo = await this.prismaService.kudos.update({
        where: { id },
        data: {
          likes: {
            increment: 1,
          },
        },
        select: {
          senderId: true,
          isAnonymous: true,
          id: true,
        },
      });

      if (updatedKudo.senderId !== userId) {
        const likingUser = await this.userService.findOneById(userId);
        if (likingUser) {
          await this.userNotificationsService.createNotification({
            userId: updatedKudo.senderId,
            actionType: ActionType.KUDOS_LIKE,
            kudosId: updatedKudo.id,
            message: `${likingUser.firstName} liked your kudos`,
          });
        }
      }
    } catch (error) {
      console.error(['Increase Likes Error'], error);
      throw new InternalServerErrorException('Could not like Kudo');
    }
  }
  async decreaseLikes(id: string, userId: string) {
    try {
      const updatedKudo = await this.prismaService.kudos.update({
        where: { id },
        data: {
          likes: {
            decrement: 1,
          },
        },
        select: {
          id: true,
          senderId: true,
          userNotifications: { select: { id: true } },
        },
      });

      if (updatedKudo.senderId !== userId) {
        const unlikingUser = await this.userService.findOneById(userId);

        if (unlikingUser) {
          await this.userNotificationsService.deleteNotificationsByOptions({
            actionType: ActionType.KUDOS_LIKE,
            userId: updatedKudo.senderId,
            kudosId: updatedKudo.id,
          });
        }
      }
    } catch (error) {
      console.error(['Decrease Likes Error'], error);
      throw error;
    }
  }

  async deleteKudosById(id: string) {
    try {
      await this.prismaService.kudos.delete({ where: { id } });
    } catch (error) {
      console.error(['Delete Kudo Error'], error);
      throw new InternalServerErrorException('Could not delete Kudo');
    }
  }
}
