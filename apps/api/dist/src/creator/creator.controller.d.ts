import { CreatorService } from './creator.service';
export declare class CreatorController {
    private readonly creatorService;
    constructor(creatorService: CreatorService);
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
    createCreator(req: any, createDto: any): Promise<{
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
    getCreator(id: string): Promise<{
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
    updateCreator(req: any, updateDto: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        links: import("@prisma/client/runtime/library").JsonValue | null;
        isAdult: boolean;
    }>;
    getCreatorPosts(id: string, req: any): Promise<{
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
