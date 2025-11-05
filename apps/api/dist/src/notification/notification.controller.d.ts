import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getMyNotifications(req: any): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(req: any, id: string): Promise<{
        id: string;
        title: string;
        created_at: Date;
        userId: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
