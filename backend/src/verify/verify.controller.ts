import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/core-guards/admin.guard';
import { PasswordResetGuard } from 'src/auth/guards/password-reset.guard';

@Controller('verify')
export class VerifyController {
  constructor(private verifyService: VerifyService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  @Post('verify-user/:userId')
  async verifyUser(@Param('userId') userId: string) {
    return await this.verifyService.verifyUser(userId);
  }

  @UseGuards(PasswordResetGuard)
  @Post('update-password/:token')
  async verifyPasswordResetToken(
    @Body() data: { password: string },
    @Req() req: any,
  ) {
    await this.verifyService.updatedVerifiedPassword(req.email, data.password);
  }
}
