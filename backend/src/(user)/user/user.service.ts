import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../core-services/prisma.service';
import { createUserDTO, updateUserDTO } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { Cron } from '@nestjs/schedule';
import { ActionType, Prisma, Role } from '@prisma/client';
import { EmailService } from '../../core-services/email.service';
import { generateClientSideUserProperties } from '../../utils';
import { ClientUser } from '../../types';
import { FilterUserDTO } from './dto/filterUser.dto';
import { UserNotificationsService } from '../user-notifications/user-notifications.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private notificationService: UserNotificationsService,
  ) {}

  async findAllUsers(filter: FilterUserDTO) {
    const { take, skip, sort, roles, cursor, ...otherFilters } = filter;
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          role: { in: roles },
          ...otherFilters,
        },
        orderBy: [
          { role: sort || 'desc' },
          { lastName: 'asc' },
          { userId: 'asc' },
        ],
        take,
        skip: skip || 0,
        cursor: cursor ? { userId: cursor } : undefined,
      });
      return users.map((user) => generateClientSideUserProperties(user));
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findAllByCompany(
    companyCode: string,
    query?: FilterUserDTO,
  ): Promise<ClientUser[]> {
    try {
      return await this.findAllUsers({ ...query, companyCode });
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findOneById(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { userId },
      });
      return generateClientSideUserProperties(user);
    } catch (error) {
      console.error(error);
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({ where: { email } });
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async create(data: createUserDTO) {
    const { companyCode, password, ...userData } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const formattedEmail = userData.email.toLowerCase();
    const company = await this.prismaService.company.findUnique({
      where: { companyCode },
      include: {
        users: {
          where: { OR: [{ role: Role.ADMIN }, { role: Role.COMPANY_OWNER }] },
        },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    const newUser = await this.prismaService.user.create({
      data: {
        ...userData,
        companyCode,
        password: hashedPassword,
        email: formattedEmail,
      },
    });
    await Promise.all(
      company.users.map((user) =>
        this.notificationService.createNotification({
          actionType: ActionType.NEW_USER,
          message: `${newUser.firstName} ${newUser.lastName[0]} is waiting for your approval`,
          userId: user.userId,
          newUserId: newUser.userId,
        }),
      ),
    );
    return { newUser, company };
  }
  catch(error) {
    console.error(error);
    if (error instanceof NotFoundException) throw error;
    if (error.code === 'P2002') {
      throw new HttpException('Email already exists', 400);
    }
    throw new HttpException('Something went wrong', 500);
  }

  async updateUserById(userId: string, data: updateUserDTO) {
    try {
      await this.findOneById(userId);

      if (data.password) data.password = await bcrypt.hash(data.password, 10);

      const updatedUser = await this.prismaService.user.update({
        where: { userId },
        data,
      });

      return generateClientSideUserProperties(updatedUser);
    } catch (error) {
      console.error(error);
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new HttpException('Something went wrong', 500);
    }
  }

  async updateByEmail(email: string, data: Prisma.UserUpdateInput) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data,
    });

    return generateClientSideUserProperties(updatedUser);
  }

  async softDeleteUserById(id: string) {
    return this.updateUserById(id, { deletedAt: new Date() });
  }

  async restoreUserById(id: string) {
    return this.updateUserById(id, { deletedAt: null });
  }

  @Cron('0 0 * * *') // Run every night at midnight
  async permanentlyDeleteOldUsers() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    try {
      await this.prismaService.user.deleteMany({
        where: {
          deletedAt: {
            lte: dateThreshold,
          },
        },
      });
    } catch (error) {
      console.error(error);
      this.emailService.sendCronErrorNotification(
        error.message,
        'Delete Users',
      );
    }
  }
}
