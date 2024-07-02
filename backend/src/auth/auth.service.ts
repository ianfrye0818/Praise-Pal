import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../(user)/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ClientUser } from '../types';
import { RefreshTokenService } from '../core-services/refreshToken.service';
import { generateClientSideUserProperties } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ClientUser | null> {
    const user = await this.userService.findOneByEmail(email.toLowerCase());
    if (user && user.deletedAt !== null)
      throw new HttpException(
        'Your account has been deleted! See admin for access.',
        404,
      );
    if (user && (await bcrypt.compare(password, user.password))) {
      return generateClientSideUserProperties(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async logout(token: string): Promise<void> {
    return await this.refreshTokenService.deleteToken(token);
  }

  async login(user: User) {
    const payload = generateClientSideUserProperties(user);
    const refreshToken = await this.generateRefreshToken(payload);
    await this.refreshTokenService.updateUserRefreshToken({
      newToken: refreshToken,
      userId: user.userId,
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

      const newRefreshToken = await this.generateRefreshToken(user);
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

  async resetPassword(email: string, newPassword: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) throw new UnauthorizedException('User not found');
      const updatedUser = await this.userService.updatePassword(
        user.userId,
        await bcrypt.hash(newPassword, 10),
      );
      return updatedUser;
    } catch (error) {
      console.error(['Reset Password Error'], error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Could not reset password');
    }
  }

  private generateAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
  }

  private async generateRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }
}
