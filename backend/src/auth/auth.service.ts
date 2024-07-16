import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../(user)/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ClientUser } from '../types';
import { RefreshTokenService } from '../core-services/refreshToken.service';
import { generateClientSideUserProperties } from '../utils';
import { EmailService } from 'src/core-services/email.service';
import { env } from 'src/env';
import {
  newUserEmailOwner,
  newUserEmailUser,
  resetPasswordHtml,
} from 'src/email-templates';
import { createUserDTO } from 'src/(user)/user/dto/createUser.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ClientUser | null> {
    const user = await this.userService.findOneByEmail(email.toLowerCase());

    //make sure user is not deleted
    if (user && user.deletedAt !== null)
      throw new HttpException(
        'Your account has been deleted! See admin for access.',
        404,
      );

    //make sure user is verified
    if (user && user.isActive === false)
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );

    //create client side user properties and return
    if (user && (await bcrypt.compare(password, user.password))) {
      return generateClientSideUserProperties(user);
    }
  }

  async logout(token: string): Promise<void> {
    return await this.refreshTokenService.deleteToken(token);
  }

  async login(payload: ClientUser) {
    const refreshToken = this.generateRefreshToken(payload);
    await this.refreshTokenService.updateUserRefreshToken({
      newToken: refreshToken,
      userId: payload.userId,
    });

    const accessToken = this.generateAccessToken(payload);

    return {
      ...payload,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: ClientUser, oldToken: string) {
    try {
      await this.refreshTokenService.getRefreshToken(oldToken);

      const cachedToken = this.refreshTokenService.getCachedToken(oldToken);
      if (cachedToken) {
        const accessToken = this.generateAccessToken(user);
        return {
          accessToken,
          refreshToken: cachedToken,
        };
      }

      const newRefreshToken = this.generateRefreshToken(user);
      const newAccessToken = this.generateAccessToken(user);

      await this.refreshTokenService.updateUserRefreshToken({
        userId: user.userId,
        newToken: newRefreshToken,
        oldToken,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async sendUpdatePasswordEmail(data: { email: string }) {
    try {
      const user = await this.userService.findOneByEmail(data.email);
      if (!user) throw new NotFoundException('User not found');

      const token = this.generatePasswordResetToken(user.email);

      const url = `${env.CLIENT_URL}/reset-password/${token}`;

      this.emailService.sendEmail({
        html: resetPasswordHtml(url),
        subject: 'Reset your password',
        to: [user.email],
      });
      return {
        message: 'Check email for password reset link',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error(['Update Password Error'], error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not update password');
    }
  }

  async updatedVerifiedPassword(email: string, newPassword: string) {
    try {
      await this.userService.updateByEmail(email, {
        password: newPassword,
        firstName: 'Ian',
      });
      return { message: 'Password updated', status: HttpStatus.OK };
    } catch (error) {
      console.error(['Verify Password Reset Token Error'], error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Could not verify token');
    }
  }

  async registerUser(data: createUserDTO) {
    try {
      const newUserData = await this.userService.create(data);
      const companyOwnerEmail = newUserData.company.users.find(
        (user) => user.role === Role.COMPANY_OWNER,
      ).email;
      return await this.sendNewUserEmail({
        newUserEmail: newUserData.newUser.email,
        newUserFullName: `${newUserData.newUser.firstName} ${newUserData.newUser.lastName}`,
        newUserId: newUserData.newUser.userId,
        companyOwnerEmail,
      });
    } catch (error) {
      console.error(['Register User Error'], error);
      if (error.code === 'P2002') {
        throw new HttpException('User already exists', 400);
      } else {
        throw new InternalServerErrorException('Could not register user');
      }
    }
  }

  async sendNewUserEmail({
    newUserId,
    companyOwnerEmail,
    newUserFullName,
  }: {
    newUserId: string;
    companyOwnerEmail?: string;
    newUserFullName: string;
    newUserEmail: string;
  }) {
    try {
      const url = `${env.CLIENT_URL}/admin/verify-user/${newUserId}`;
      // console.log(url);
      // console.log('owner email: ', newUserEmailOwner(url, newUserFullName));
      // console.log('user email: ', newUserEmailUser(newUserFullName));

      // if (companyOwnerEmail) {
      //   await this.emailService.sendEmail({
      //     html: newUserEmailOwner(url, newUserFullName),
      //     subject: 'Verify New User',
      //     to: [companyOwnerEmail],
      //   });
      // }

      // await this.emailService.sendEmail({
      //   html: newUserEmailUser(newUserFullName),
      //   subject: 'Pending Verification',
      //   to: [newUserEmail],
      // });
      return {
        message: '',
        status: HttpStatus.OK,
        url,
      };
    } catch (error) {
      console.error(['Verify Email Error'], error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Could not verify email');
    }
  }

  async verifyEmailToken(email: string) {
    try {
      await this.userService.updateByEmail(email, { isActive: true });
      return { message: 'Email verified', status: HttpStatus.OK };
    } catch (error) {
      console.error(['Verify Email Token Error'], error);
      throw new InternalServerErrorException('Could not verify token');
    }
  }

  private generateAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
  }

  private generateRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  private generateEmailVerificationToken(payload: any) {
    return this.jwtService.sign(
      { payload },
      { secret: env.EMAIL_VERIFICATION_SECRET, expiresIn: '1d' },
    );
  }

  private generatePasswordResetToken(email: string) {
    return this.jwtService.sign(
      { email },
      { secret: env.PASSWORD_RESET_SECRET, expiresIn: '1h' },
    );
  }
}
