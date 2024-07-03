import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core-services/prisma.service';
import { createKudosDTO, UpdateKudosDTO } from './dto/createKudos.dto';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../core-services/email.service';
import { ActionType, Kudos } from '@prisma/client';
import { KudosFilterDTO } from './dto/kudosFilter.dto';
import { UserNotificationsService } from '../(user)/user-notifications/user-notifications.service';
import {
  commentSelectOptions,
  kudoSelectOptions,
  singleCommentSelectOptions,
  singleKudoSelectOptions,
  userSelectOptions,
} from 'src/utils/constants';

@Injectable()
export class KudosService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private userNotificationsService: UserNotificationsService,
  ) {}

  async getAllKudos(filter: KudosFilterDTO) {
    const { limit, offset, sort, ...otherFilters } = filter;
    try {
      const kudos = await this.prismaService.kudos.findMany({
        where: { deletedAt: filter.deletedAt || null, ...otherFilters },
        orderBy: { createdAt: sort || 'desc' },
        take: limit,
        skip: offset,
        select: {
          ...kudoSelectOptions,
          comments: {
            where: { parentId: null },
            select: {
              ...commentSelectOptions,
            },
            orderBy: {
              createdAt: 'asc',
            },
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

  // async getKudosByCompanyId(companyId: string) {
  //   try {
  //     return await this.getAllKudos({ companyId });
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException('Could not retreive Kudos');
  //   }
  // }

  // async getKudosBySenderId(senderId: string) {
  //   try {
  //     return await this.getAllKudos({ senderId });
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException('Could not retreive Kudos');
  //   }
  // }

  // async getKudosByreceiverId(receiverId: string) {
  //   try {
  //     return this.getAllKudos({ receiverId });
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException('Could not retreive Kudos');
  //   }
  // }

  async getKudoById(id: string) {
    try {
      const kudo = await this.prismaService.kudos.findUnique({
        where: { id },
        select: {
          ...kudoSelectOptions,
          comments: {
            where: { parentId: null },
            include: {
              user: true,
              comments: {
                include: {
                  user: { select: userSelectOptions },
                  comments: {
                    include: { user: { select: userSelectOptions } },
                  },
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!kudo) throw new NotFoundException('Unable to locate Kudo ' + id);
      console.log({ kudoComments: kudo.comments });
      return kudo;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retreive Kudo');
    }
  }

  async createKudo(data: createKudosDTO) {
    try {
      const newKudos = await this.prismaService.$transaction(async (prisma) => {
        const kudo = await prisma.kudos.create({
          data,
          select: {
            ...kudoSelectOptions,
            comments: {
              where: { parentId: null },
              select: {
                ...commentSelectOptions,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

        const displayName = kudo.isAnonymous
          ? 'Someone Special'
          : `${kudo.sender.firstName} ${kudo.sender.lastName[0]}` ||
            kudo.sender.displayName;

        if (kudo.sender.userId !== kudo.receiver.userId) {
          await prisma.userNotifications.create({
            data: {
              userId: kudo.receiver.userId,
              actionType: ActionType.KUDOS,
              referenceId: kudo.id,
              message: `${displayName} sent you a kudos`,
            },
          });
        }

        return kudo;
      });
      return newKudos;
    } catch (error) {
      console.error(['Create Kudo Error'], error);
      throw new InternalServerErrorException('Could not create Kudo');
    }
  }

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

  async increaseLikes(id: string, userId: string): Promise<void> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const updatedKudo = await prisma.kudos.update({
          where: { id },
          data: {
            likes: {
              increment: 1,
            },
          },
          select: {
            ...kudoSelectOptions,
            comments: {
              where: { parentId: null },
              select: {
                ...commentSelectOptions,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

        if (updatedKudo.sender.userId !== userId) {
          const likingUser = await prisma.user.findUnique({
            where: { userId },
          });

          if (likingUser) {
            const displayName =
              `${likingUser.firstName} ${likingUser.lastName[0]}` ||
              likingUser.displayName;

            await prisma.userNotifications.create({
              data: {
                userId: updatedKudo.sender.userId,
                actionType: ActionType.KUDOS_LIKE,
                referenceId: updatedKudo.id,
                message: `${displayName} liked your kudos`,
              },
            });
          }
        }
      });
    } catch (error) {
      console.error(['Increase Likes Error'], error);
      throw new InternalServerErrorException('Could not like Kudo');
    }
  }
  async decreaseLikes(id: string, userId: string): Promise<void> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const updatedKudo = await prisma.kudos.update({
          where: { id },
          data: {
            likes: {
              decrement: 1,
            },
          },
          select: {
            ...kudoSelectOptions,
            comments: {
              where: { parentId: null },
              select: {
                ...commentSelectOptions,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

        if (updatedKudo.sender.userId !== userId) {
          const unlikingUser = await prisma.user.findUnique({
            where: { userId },
          });

          if (unlikingUser) {
            const deltedNotification =
              await prisma.userNotifications.deleteMany({
                where: {
                  AND: [
                    { userId: updatedKudo.sender.userId },
                    { referenceId: updatedKudo.id },
                  ],
                },
              });
            console.log({ unlikingUser, deltedNotification, updatedKudo });
          }
        }
      });
    } catch (error) {
      console.error(['Decrease Likes Error'], error);
      throw error;
    }
  }

  async softDeleteKudoById(id: string) {
    try {
      const kudo = await this.updateKudoById(id, { deletedAt: new Date() });
      if (!kudo)
        throw new NotFoundException('Could not find kudo with id ' + id);
      await this.userNotificationsService.hardDeleteNotification({
        referenceId: kudo.id,
      });
      return kudo;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong deleting Kudo',
      );
    }
  }

  @Cron('0 0 * * *') // Run every night at midnight
  async permanentlyDeleteOldUsers() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    try {
      await this.prismaService.kudos.deleteMany({
        where: {
          deletedAt: {
            lte: dateThreshold,
          },
        },
      });
    } catch (error) {
      console.error(error);
      this.emailService.sendCronErrorNotification(
        'Kudos cleanup failed' + error.message,
        'Delete Kudos',
      );
    }
  }
}
