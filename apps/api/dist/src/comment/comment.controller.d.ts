import { CommentService } from './comment.service';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    createComment(req: any, body: {
        postId: string;
        content: string;
    }): Promise<{
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
    deleteComment(req: any, commentId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        postId: string;
        content: string;
    }>;
}
