import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class RefreshTokenService {
  private tokenCache: Map<string, string> = new Map();

  constructor(private readonly prismaService: PrismaService) {}

  async getRefreshToken(token: string) {
    const refreshTokenRecord = await this.prismaService.refreshToken.findFirst({
      where: { token },
    });

    return refreshTokenRecord || null;
  }

  async updateUserRefreshToken({
    userId,
    newToken,
    oldToken,
  }: {
    userId: string;
    newToken: string;
    oldToken?: string;
  }) {
    try {
      this.cacheToken(oldToken, newToken);
      await this.saveRefreshToken(userId, newToken);

      if (oldToken) {
        this.scheduleOldTokenDeletion(oldToken);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  getCachedToken(oldToken: string): string | undefined {
    return this.tokenCache.get(oldToken);
  }

  private cacheToken(oldToken?: string, newToken?: string) {
    if (oldToken && newToken) {
      this.tokenCache.set(oldToken, newToken);
    }
  }

  private async saveRefreshToken(userId: string, newToken: string) {
    try {
      await this.prismaService.refreshToken.create({
        data: { userId, token: newToken },
      });
    } catch (error) {
      console.error(['safeRefreshToken Error', error]);
      if (error.code === 'p2003') {
        throw new HttpException('Error Refreshing Token', 401);
      }
      throw new HttpException('Something went wrong refreshing token', 500);
    }
  }

  private scheduleOldTokenDeletion(oldToken: string) {
    setTimeout(async () => {
      try {
        await this.deleteToken(oldToken);
        this.tokenCache.delete(oldToken);
      } catch (error) {
        console.error(`Error deleting old token ${oldToken}:`, error);
      }
    }, 5000);
  }

  async deleteToken(token: string) {
    await this.prismaService.refreshToken.deleteMany({ where: { token } });
  }
}
