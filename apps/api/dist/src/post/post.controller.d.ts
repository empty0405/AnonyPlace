import { PostService } from './post.service';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    createPost(req: any, createDto: any, file: Express.Multer.File): Promise<{
        creator: {
            id: string;
            created_at: Date;
            updated_at: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            links: import("@prisma/client/runtime/library").JsonValue | null;
            isAdult: boolean;
        };
    } & {
        id: string;
        title: string;
        body: string | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        thumbnail: string | null;
        publishedAt: Date | null;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
    }>;
    getPost(id: string, req: any): Promise<{
        hasAccess: boolean;
        creator: {
            id: string;
            created_at: Date;
            updated_at: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            links: import("@prisma/client/runtime/library").JsonValue | null;
            isAdult: boolean;
        };
        assets: {
            id: string;
            created_at: Date;
            updated_at: Date;
            postId: string;
            type: import(".prisma/client").$Enums.AssetType;
            s3Key: string;
            duration: number | null;
            encodingsJson: import("@prisma/client/runtime/library").JsonValue | null;
            drmPolicy: string | null;
            watermarkPolicy: string | null;
        }[];
        tiers: {
            level: number;
            id: string;
            created_at: Date;
            updated_at: Date;
            creatorId: string;
            name: string;
            external: string;
            externalTierId: string | null;
        }[];
        id: string;
        title: string;
        body: string | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        thumbnail: string | null;
        publishedAt: Date | null;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
    }>;
    updatePost(req: any, id: string, updateDto: any): Promise<{
        id: string;
        title: string;
        body: string | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        thumbnail: string | null;
        publishedAt: Date | null;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
    }>;
    deletePost(req: any, id: string): Promise<{
        id: string;
        title: string;
        body: string | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        thumbnail: string | null;
        publishedAt: Date | null;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
    }>;
    getStreamUrl(id: string, req: any): Promise<{
        streamUrl: string;
        thumbnailUrl: string;
    }>;
}
