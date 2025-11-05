import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    link?: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        isRead: false,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  // Helper method to notify on new post
  async notifyNewPost(creatorId: string, postTitle: string, postId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: {
        creatorId,
        status: 'ACTIVE',
      },
      include: {
        user: true,
        creator: true,
      },
    });

    const notifications = memberships.map((membership) =>
      this.createNotification(
        membership.userId,
        'NEW_POST',
        'New Post',
        `${membership.creator.displayName} posted: ${postTitle}`,
        `/post/${postId}`,
      ),
    );

    return Promise.all(notifications);
  }

  // Helper method to notify on new comment
  async notifyNewComment(
    postId: string,
    commenterEmail: string,
    commentContent: string,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { creator: true },
    });

    if (!post) return;

    return this.createNotification(
      post.creator.userId,
      'NEW_COMMENT',
      'New Comment',
      `${commenterEmail} commented: ${commentContent.substring(0, 50)}`,
      `/post/${postId}`,
    );
  }

  // Helper method to notify on new like
  async notifyNewLike(postId: string, likerEmail: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { creator: true },
    });

    if (!post) return;

    return this.createNotification(
      post.creator.userId,
      'NEW_LIKE',
      'New Like',
      `${likerEmail} liked your post: ${post.title}`,
      `/post/${postId}`,
    );
  }
}
