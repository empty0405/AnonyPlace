import { PrismaService } from '../prisma/prisma.service';
export declare class TierService {
    private prisma;
    constructor(prisma: PrismaService);
    getTiersByCreatorId(creatorId: string): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }[]>;
    createTier(createDto: any): Promise<{
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
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }>;
    getTierById(id: string): Promise<{
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
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }>;
    updateTier(id: string, updateDto: any): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }>;
    deleteTier(id: string): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
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
}
