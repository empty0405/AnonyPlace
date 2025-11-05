import { LikeService } from './like.service';
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    likePost(req: any, body: {
        postId: string;
    }): Promise<{
        id: string;
        created_at: Date;
        userId: string;
        postId: string;
    }>;
    unlikePost(req: any, postId: string): Promise<{
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
    checkLike(req: any, postId: string): Promise<{
        liked: boolean;
    }>;
}
