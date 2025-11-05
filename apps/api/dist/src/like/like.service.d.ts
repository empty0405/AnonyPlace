import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
export declare class LikeService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    likePost(userId: string, postId: string): Promise<{
        id: string;
        created_at: Date;
        userId: string;
        postId: string;
    }>;
    unlikePost(userId: string, postId: string): Promise<{
        id: string;
        created_at: Date;
        userId: string;
        postId: string;
    }>;
    getPostLikes(postId: string): Promise<{
        count: number;
        likes: ({
            user: {
                email: string;
            };
        } & {
            id: string;
            created_at: Date;
            userId: string;
            postId: string;
        })[];
    }>;
    checkUserLike(userId: string, postId: string): Promise<boolean>;
}
