import { PrismaService } from '../prisma/prisma.service';
export declare class MembershipService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserMemberships(userId: string): Promise<({
        creator: {
            id: string;
            displayName: string;
        };
        tier: {
            level: number;
            id: string;
            name: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        userId: string;
        tierId: string;
        status: string;
        expiresAt: Date | null;
        lastSyncAt: Date | null;
    })[]>;
    createMembership(userId: string, creatorId: string, tierId: string): Promise<{
        creator: {
            id: string;
            displayName: string;
        };
        tier: {
            level: number;
            id: string;
            name: string;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        userId: string;
        tierId: string;
        status: string;
        expiresAt: Date | null;
        lastSyncAt: Date | null;
    }>;
    cancelMembership(membershipId: string, userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        creatorId: string;
        userId: string;
        tierId: string;
        status: string;
        expiresAt: Date | null;
        lastSyncAt: Date | null;
    }>;
}
