import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core-services/prisma.service';
import { CreateUserNotificationDTO } from './dto/createUserNotification.dto';
import { EmailService } from 'src/core-services/email.service';
import { FilterUserNotificationsDTO } from './dto/filterUserNotifications.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserNotificationsService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async getNotifications(userId: string, filter: FilterUserNotificationsDTO) {
    const { take, skip, sort, actionTypes, ...otherFilters } = filter;

    const data = await this.prismaservice.userNotifications.findMany({
      where: {
        userId,
        deletedAt: filter.deletedAt || null,
        actionType: { in: actionTypes },
        ...otherFilters,
      },
      orderBy: { createdAt: sort || 'desc' },
      take,
      skip: skip || 0,
    });
    const filteredData = data.map((notification) => {
      const { createdAt, updatedAt, deletedAt, ...rest } = notification;
      return rest;
    });

    return filteredData;
  }

  async getSingleNotificationById(id: string) {
    return this.prismaservice.userNotifications.findFirst({
      where: { id },
    });
  }

  async createNotification(notificaitonData: CreateUserNotificationDTO) {
    return this.prismaservice.userNotifications.create({
      data: notificaitonData,
    });
  }

  async markNotificationAsRead(id: string) {
    return this.prismaservice.userNotifications.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async markAllNotificationAsRead(userId: string) {
    return this.prismaservice.userNotifications.updateMany({
      where: {
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async deleteNotificationById(id: string) {
    return await this.prismaservice.userNotifications.delete({
      where: { id },
    });
  }

  async deleteNotificationsByOptions(
    where: Prisma.UserNotificationsWhereInput,
  ) {
    return await this.prismaservice.userNotifications.deleteMany({
      where,
    });
  }

  // async deleteNotificationByReferrenceId(referenceIds: string[]) {
  //   return await this.prismaservice.userNotifications.deleteMany({
  //     where: {
  //       referenceId: {
  //         hasSome: referenceIds,
  //       },
  //     },
  //   });
  // }
}
