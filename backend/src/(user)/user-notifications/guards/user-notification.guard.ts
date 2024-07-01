import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserNotificationsService } from '../user-notifications.service';
import { ClientUser } from 'src/types';

@Injectable()
export class UserNotificationsGuard implements CanActivate {
  constructor(private userNotificationService: UserNotificationsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log({ request });
    const user = request.user as ClientUser;

    const notificationId = request.params.id || request.query.id;

    console.log({ user, notificationId });

    if (!user) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    const notificaiton =
      await this.userNotificationService.getNotificationById(notificationId);

    if (!notificaiton) {
      throw new NotFoundException('Notification not found');
    }

    if (notificaiton.userId !== user.userId) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    return true;
  }
}
