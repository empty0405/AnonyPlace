import { TierService } from './tier.service';
import { CreatorService } from '../creator/creator.service';
export declare class TierController {
    private readonly tierService;
    private readonly creatorService;
    constructor(tierService: TierService, creatorService: CreatorService);
    getUserTiers(req: any): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }[]>;
    createTier(req: any, createDto: any): Promise<{
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
    getTier(id: string): Promise<{
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
    updateTier(req: any, id: string, updateDto: any): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }>;
    deleteTier(req: any, id: string): Promise<{
        level: number;
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        name: string;
        external: string;
        externalTierId: string | null;
    }>;
}
