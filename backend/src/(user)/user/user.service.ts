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
import { User } from '@prisma/client';
import { EmailService } from '../../core-services/email.service';
import { generateClientSideUserProperties } from '../../utils';
import { ClientUser } from '../../types';
import { FilterUserDTO } from './dto/filterUser.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

  async findAllUsers(filter: FilterUserDTO): Promise<ClientUser[]> {
    const { limit, offset, sort, roles, ...otherFilters } = filter;
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          deletedAt: filter.deletedAt || null,
          role: { in: roles },
          ...otherFilters,
        },
        orderBy: { createdAt: sort || 'desc' },
        take: limit,
        skip: offset,
      });
      const clientUsers = users.map((user) =>
        generateClientSideUserProperties(user),
      );

      return clientUsers;
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findAllByCompany(
    companyId: string,
    deletedUsers?: boolean,
  ): Promise<ClientUser[]> {
    try {
      const users = await this.findAllUsers({
        companyId,
        deletedAt: deletedUsers ? new Date() : null,
      });
      return users;
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findOneById(userId: string): Promise<ClientUser> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { userId },
      });
      if (!user) throw new NotFoundException('User not found');
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

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.prismaService.user.findUnique({ where: { email } });
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async create(data: createUserDTO): Promise<User> {
    const { companyCode, password, ...userData } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await this.prismaService.company.findUnique({
      where: { companyCode },
    });
    if (!company) throw new NotFoundException('Company not found');
    const newUser = await this.prismaService.user.create({
      data: { ...userData, companyId: company.id, password: hashedPassword },
    });
    return newUser;
  }
  catch(error) {
    console.error(error);
    if (error instanceof NotFoundException) throw error;
    if (error.code === 'P2002') {
      throw new HttpException('Email already exists', 400);
    }
    throw new HttpException('Something went wrong', 500);
  }

  async updateUserById(
    userId: string,
    data: updateUserDTO,
  ): Promise<ClientUser> {
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

  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<ClientUser> {
    const updatedUser = await this.prismaService.user.update({
      where: { userId },
      data: { password: newPassword },
    });

    return generateClientSideUserProperties(updatedUser);
  }

  async softDeleteUserById(id: string): Promise<ClientUser> {
    return this.updateUserById(id, { deletedAt: new Date() });
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
