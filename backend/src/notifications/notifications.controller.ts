import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications (paginated)' })
  async getNotifications(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.notificationsService.getUserNotifications(
      req.user.id,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    await this.notificationsService.markAsRead(req.user.id, id);
    return { success: true };
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Request() req: any) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { success: true };
  }

  @Post(':id/action')
  @ApiOperation({ summary: 'Action a notification (accept/reject)' })
  async actionNotification(
    @Request() req: any,
    @Param('id') id: string,
    @Query('result') result: string,
  ) {
    await this.notificationsService.actionNotification(req.user.id, id, result);
    return { success: true };
  }
}
