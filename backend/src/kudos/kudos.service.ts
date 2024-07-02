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

@Injectable()
export class KudosService {
  private readonly userSelectProps = {
    select: {
      userId: true,
      displayName: true,
      firstName: true,
      lastName: true,
      email: true,
      companyId: true,
      role: true,
      createdAt: true,
    },
  };
  private readonly commentSelectProps = {
    select: {
      id: true,
      content: true,
      kudosId: true,
      parentId: true,
      user: this.userSelectProps,
    },
  };

  private readonly userLikeSelectProps = {
    select: {
      userId: true,
      kudosId: true,
    },
  };

  private readonly kudosSelectOptions = {
    include: {
      sender: this.userSelectProps,
      receiver: this.userSelectProps,
      comments: this.commentSelectProps,
      userLikes: this.userLikeSelectProps,
    },
  };

  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private userNotificationsService: UserNotificationsService,
  ) {}

  async getAllKudos(filter: KudosFilterDTO): Promise<Kudos[]> {
    const { limit, offset, sort, ...otherFilters } = filter;
    try {
      return await this.prismaService.kudos.findMany({
        where: { deletedAt: null, ...otherFilters },
        orderBy: { createdAt: sort || 'desc' },
        take: limit,
        skip: offset,
        ...this.kudosSelectOptions,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retrieve Kudos');
    }
  }

  async getKudosByCompanyId(companyId: string): Promise<Kudos[]> {
    try {
      return await this.getAllKudos({ companyId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async getKudosBySenderId(senderId: string): Promise<Kudos[]> {
    try {
      return await this.getAllKudos({ senderId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async getKudosByreceiverId(receiverId: string): Promise<Kudos[]> {
    try {
      return this.getAllKudos({ receiverId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not retreive Kudos');
    }
  }

  async getKudoById(id: string): Promise<Kudos> {
    try {
      const kudo = await this.prismaService.kudos.findUnique({
        where: { id },
        ...this.kudosSelectOptions,
      });

      if (!kudo) throw new NotFoundException('Unable to locate Kudo ' + id);
      return kudo;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retreive Kudo');
    }
  }

  async createKudo(data: createKudosDTO): Promise<Kudos> {
    try {
      const newKudos = await this.prismaService.$transaction(async (prisma) => {
        const kudo = await prisma.kudos.create({
          data,
          include: this.kudosSelectOptions.include,
        });

        const displayName = kudo.isAnonymous
          ? 'Someone Special'
          : `${kudo.sender.firstName} ${kudo.sender.lastName[0]}` ||
            kudo.sender.displayName;

        if (kudo.senderId !== kudo.receiverId) {
          await prisma.userNotifications.create({
            data: {
              userId: kudo.receiverId,
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
          include: this.kudosSelectOptions.include,
        });

        if (updatedKudo.senderId !== userId) {
          const likingUser = await prisma.user.findUnique({
            where: { userId },
          });

          if (likingUser) {
            const displayName =
              `${likingUser.firstName} ${likingUser.lastName[0]}` ||
              likingUser.displayName;

            await prisma.userNotifications.create({
              data: {
                userId: updatedKudo.senderId,
                actionType: ActionType.LIKE,
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
          include: this.kudosSelectOptions.include,
        });

        if (updatedKudo.senderId !== userId) {
          const unlikingUser = await prisma.user.findUnique({
            where: { userId },
          });

          if (unlikingUser) {
            await prisma.userNotifications.deleteMany({
              where: {
                userId,
                referenceId: updatedKudo.id,
              },
            });
          }
        }
      });
    } catch (error) {
      console.error(['Decrease Likes Error'], error);
      throw error;
    }
  }

  async softDeleteKudoById(id: string): Promise<Kudos> {
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
