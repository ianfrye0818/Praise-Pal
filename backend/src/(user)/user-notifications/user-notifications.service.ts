import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core-services/prisma.service';
import { CreateUserNotificationDTO } from './dto/createUserNotification.dto';
import { Cron } from '@nestjs/schedule';
import { EmailService } from 'src/core-services/email.service';
import { FilterUserNotificationsDTO } from './dto/filterUserNotifications.dto';
import { UserNotifications } from '@prisma/client';
import { userNotificationSelectOptions } from 'src/utils/constants';

@Injectable()
export class UserNotificationsService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async getNotifications(userId: string, filter: FilterUserNotificationsDTO) {
    const { limit, offset, sort, actionTypes, ...otherFilters } = filter;

    return this.prismaservice.userNotifications.findMany({
      where: {
        userId,
        deletedAt: filter.deletedAt || null,
        actionType: { in: actionTypes },
        ...otherFilters,
      },
      orderBy: { createdAt: sort || 'desc' },
      take: limit,
      skip: offset,
      select: userNotificationSelectOptions,
    });
  }

  async getSingleNotification(filter: Partial<UserNotifications>) {
    return this.prismaservice.userNotifications.findFirst({
      where: filter,
    });
  }

  async createNotification(notificaitonData: CreateUserNotificationDTO) {
    return this.prismaservice.userNotifications.create({
      data: notificaitonData,
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

  async hardDeleteNotification(filter: Partial<UserNotifications>) {
    return this.prismaservice.userNotifications.deleteMany({
      where: filter,
    });
  }

  async softDeleteNotification(id: string) {
    return this.prismaservice.userNotifications.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  @Cron('0 0 * * *') // Run every night at midnight
  async permDeleteOldNotificaitons() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    try {
      await this.prismaservice.userNotifications.deleteMany({
        where: {
          OR: [
            {
              AND: [
                {
                  isRead: true,
                },
                {
                  updatedAt: {
                    lt: dateThreshold,
                  },
                },
              ],
            },
            {
              deletedAt: {
                lt: dateThreshold,
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
      this.emailService.sendCronErrorNotification(
        'User Notification deletion failed' + error.message,
        'Delete User Notifications',
      );
    }
  }
}
