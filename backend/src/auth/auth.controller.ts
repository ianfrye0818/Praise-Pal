import {
  Controller,
  Request,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { createUserDTO } from '../(user)/user/dto/createUser.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { TokenType } from 'src/types';
import { PasswordResetGuard } from './guards/password-reset.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipThrottle()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return await this.authService.refreshToken(req.user, refreshToken);
  }

  @Post('register')
  async registerUser(@Body() data: createUserDTO) {
    return await this.authService.registerUser(data);
  }

  @Post('logout')
  async logout(@Request() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return this.authService.logout(refreshToken);
  }

  @Post('reset-password')
  async updatePassword(@Body() data: { email: string }) {
    return await this.authService.sendUpdatePasswordEmail(data);
  }

  @Get('verify-token/:token')
  async verifyToken(
    @Param('token') token: string,
    @Query('type') type: TokenType,
  ) {
    return await this.authService.verifyToken(type, token);
  }

  @UseGuards(PasswordResetGuard)
  @Post('update-password/:token')
  async verifyPasswordResetToken(
    @Body() data: { password: string },
    @Req() req: any,
  ) {
    await this.authService.updatedVerifiedPassword(req.email, data.password);
  }
}
