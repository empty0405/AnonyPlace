import { MembershipService } from './membership.service';
export declare class MembershipController {
    private readonly membershipService;
    constructor(membershipService: MembershipService);
    getMyMemberships(req: any): Promise<({
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
    subscribe(req: any, body: {
        creatorId: string;
        tierId: string;
    }): Promise<{
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
    cancelMembership(req: any, membershipId: string): Promise<{
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
