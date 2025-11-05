import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(userId: string, type: string, title: string, message: string, link?: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyNewPost(creatorId: string, postTitle: string, postId: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    notifyNewComment(postId: string, commenterEmail: string, commentContent: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    notifyNewLike(postId: string, likerEmail: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
}
