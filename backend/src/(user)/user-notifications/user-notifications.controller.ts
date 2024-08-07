import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { FilterUserNotificationsDTO } from './dto/filterUserNotifications.dto';
@UseGuards(JwtGuard)
@Controller('user-notifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationService: UserNotificationsService,
  ) {}

  @Get()
  async getUserNotifications(
    @Query() query: FilterUserNotificationsDTO,
    @Req() req: any,
  ) {
    return await this.userNotificationService.getNotifications(
      req.user.userId,
      query,
    );
  }

  @Patch(':id/mark-as-read')
  async markNotificationAsRead(@Param('id') id: string) {
    return await this.userNotificationService.markNotificationAsRead(id);
  }

  @Patch('mark-all-as-read')
  async markAllNotificationAsRead(@Req() req: any) {
    return await this.userNotificationService.markAllNotificationAsRead(
      req.user.userId,
    );
  }

  @Delete(':id')
  async deleteNotificaiton(@Param('id') id: string) {
    return await this.userNotificationService.deleteNotificationById(id);
  }
}
