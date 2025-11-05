import { PrismaService } from '../prisma/prisma.service';
export declare class WebhooksService {
    private prisma;
    constructor(prisma: PrismaService);
    verifyPatreonSignature(payload: any, signature: string): boolean;
    verifyHoodpaySignature(payload: any, signature: string): boolean;
    processPatreonEvent(payload: any): Promise<void>;
    private handleMembershipUpdate;
    private handleMembershipDelete;
    processHoodpayEvent(payload: any): Promise<void>;
    private handleHoodpayPayment;
    private handleHoodpaySubscription;
}
