import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
export declare class CommentService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    createComment(userId: string, postId: string, content: string): Promise<{
        user: {
            email: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        postId: string;
        content: string;
    }>;
    getPostComments(postId: string): Promise<({
        user: {
            email: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        postId: string;
        content: string;
    })[]>;
    deleteComment(commentId: string, userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        postId: string;
        content: string;
    }>;
}
