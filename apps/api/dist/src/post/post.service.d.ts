import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bull';
export declare class PostService {
    private prisma;
    private videoQueue;
    constructor(prisma: PrismaService, videoQueue: Queue);
    createPost(createDto: any): Promise<{
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
    getPostById(id: string, userId?: string): Promise<{
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
    updatePost(id: string, updateDto: any): Promise<{
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
    deletePost(id: string): Promise<{
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
    getStreamUrl(postId: string, userId?: string): Promise<{
        streamUrl: string;
        thumbnailUrl: string;
    }>;
    getCreatorById(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    }>;
    private checkAccess;
}
