import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async likePost(userId: string, postId: string) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if already liked
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    const like = await this.prisma.like.create({
      data: {
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Send notification
    try {
      await this.notificationService.notifyNewLike(postId, like.user.email);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    return like;
  }

  async unlikePost(userId: string, postId: string) {
    try {
      return await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Like not found');
    }
  }

  async getPostLikes(postId: string) {
    const likes = await this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return {
      count: likes.length,
      likes,
    };
  }

  async checkUserLike(userId: string, postId: string): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return !!like;
  }
}
