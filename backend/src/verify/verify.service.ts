import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserNotificationsService } from 'src/(user)/user-notifications/user-notifications.service';
import { UserService } from 'src/(user)/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { EmailService } from 'src/core-services/email.service';

@Injectable()
export class VerifyService {
  constructor(
    private userService: UserService,
    private userNotificaitonService: UserNotificationsService,
    private emailService: EmailService,
    private companyService: CompanyService,
  ) {}

  async verifyUser(userId: string) {
    const updatedUser = await this.userService.updateUserById(userId, {
      isActive: true,
    });
    const company = await this.companyService.findOneById(
      updatedUser.companyCode,
    );

    await this.userNotificaitonService.deleteNotificationsByOptions({
      actionType: 'NEW_USER',
      newUserId: userId,
    });

    await this.emailService.sendUserVerifiedEmail({
      companyName: company.name,
      newUserEmail: updatedUser.email,
      newUserFirstName: updatedUser.firstName,
    });
    return { message: 'User verified!', HttpStatus: HttpStatus.OK, userId };
  }

  async updatedVerifiedPassword(email: string, newPassword: string) {
    try {
      await this.userService.updateByEmail(email, {
        password: newPassword,
      });
      return { message: 'Password updated', status: HttpStatus.OK };
    } catch (error) {
      console.error(['Verify Password Reset Token Error'], error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Could not verify token');
    }
  }
}
