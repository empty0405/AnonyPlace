import { PrismaService } from '../prisma/prisma.service';
export declare class CreatorService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCreators(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    })[]>;
    createCreator(userId: string, createDto: any): Promise<{
        user: {
            email: string;
            patreonId: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    }>;
    getCreatorById(id: string): Promise<{
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
        user: {
            email: string;
            patreonId: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    }>;
    getCreatorByUserId(userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    }>;
    updateCreator(id: string, updateDto: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    }>;
    getCreatorTiers(creatorId: string): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }[]>;
    getCreatorPosts(creatorId: string, userId?: string): Promise<{
        hasAccess: boolean;
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
    }[]>;
}
