import { Controller, Request, UseGuards, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../(user)/user/user.service';
import { LocalAuthGuard } from './guards/local.guard';
import { createUserDTO } from '../(user)/user/dto/createUser.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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
    return this.authService.refreshToken(req.user, refreshToken);
  }

  @Post('register')
  async registerUser(@Body() data: createUserDTO) {
    const newUser = await this.userService.create(data);

    return await this.authService.login(newUser);
  }

  @Post('logout')
  async logout(@Request() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return this.authService.logout(refreshToken);
  }

  @Post('update-password')
  async updatePassword(
    @Body() data: { email: string; oldPassword: string; newPassword: string },
  ) {
    await this.authService.updatePassword(data);
  }

  //TODO secure this by verifying email with link
  @Post('forgot-password')
  async resetPassword(@Body() data: { email: string; newPassword: string }) {
    const updatedUser = await this.authService.resetPassword(
      data.email,
      data.newPassword,
    );
    if (updatedUser) return { message: 'Password reset successfully' };
  }
}
