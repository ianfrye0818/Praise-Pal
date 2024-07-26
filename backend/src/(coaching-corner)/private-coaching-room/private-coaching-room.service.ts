import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { UserService } from 'src/(user)/user/user.service';
import { EmailService } from 'src/core-services/email.service';
import { PrismaService } from 'src/core-services/prisma.service';
import { privateCoachingRoomSelectOptions } from 'src/utils/constants';
import { CreatePrivateCoachingRoomDTO } from './dto/create-private-room.dto';
import { InviteUserToPrivateRoomDTO } from './dto/invite-user-to-private-room.dto';
import { ActionType } from '@prisma/client';
import { getDisplayName } from 'src/utils';

@Injectable()
export class PrivateCoachingRoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly userNotificationService: UserNotificationsService,
  ) {}

  async getRoom(id: string) {
    try {
      return await this.prismaService.privateCoachingRoom.findUnique({
        where: { id },
        select: privateCoachingRoomSelectOptions,
      });
    } catch (error) {
      console.error(['getRoom'], error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Room not found');
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async createRoom(data: CreatePrivateCoachingRoomDTO) {
    try {
      const newRoom = await this.prismaService.privateCoachingRoom.create({
        data,
        select: privateCoachingRoomSelectOptions,
      });

      const invitingUser = await this.userService.findOneById(data.userId);

      const invitingUserDisplayName = getDisplayName(invitingUser);

      await this.userNotificationService.createNotification({
        userId: newRoom.responder.userId,
        actionType: ActionType.PRIVATE_ROOM_INVITE,
        message: `${invitingUserDisplayName} has invited you to a coaching room.`,
        privateCoachingRoomId: newRoom.id,
      });
    } catch (error) {
      console.error(['createRoom'], error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async invite(roomId: string, data: InviteUserToPrivateRoomDTO) {
    try {
      const [invitingUser, room] = await Promise.all([
        this.userService.findOneById(data.creatorId),
        this.getRoom(roomId),
      ]);

      const invitingUserDisplayName = getDisplayName(invitingUser);

      await this.userNotificationService.createNotification({
        userId: data.invitedUserId,
        actionType: ActionType.PRIVATE_ROOM_INVITE,
        message: `${invitingUserDisplayName} has invited you to a private coaching room`,
        privateCoachingRoomId: room.id,
      });
    } catch (error) {
      console.error(['invite'], error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteRoom(id: string) {
    try {
      await this.prismaService.privateCoachingRoom.delete({
        where: { id },
      });
    } catch (error) {
      console.error(['deleteRoom'], error);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
