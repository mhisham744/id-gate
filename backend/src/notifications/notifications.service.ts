import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notifRepo: Repository<NotificationEntity>,
  ) {}

  async createNotification(data: Partial<NotificationEntity>) {
    const notification = this.notifRepo.create(data);
    return this.notifRepo.save(notification);
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.notifRepo.findAndCount({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async getUnreadCount(userId: string) {
    return this.notifRepo.count({
      where: { recipientId: userId, isRead: false },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    await this.notifRepo.update(
      { id: notificationId, recipientId: userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string) {
    await this.notifRepo.update(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );
  }

  async actionNotification(userId: string, notificationId: string, result: string) {
    await this.notifRepo.update(
      { id: notificationId, recipientId: userId },
      { isActioned: true, actionResult: result, isRead: true },
    );
  }
}
