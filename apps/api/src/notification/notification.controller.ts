import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyNotifications(@Request() req) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('read-all')
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
