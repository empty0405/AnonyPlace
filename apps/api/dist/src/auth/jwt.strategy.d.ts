import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        role: import(".prisma/client").$Enums.Role;
        status: string;
        email: string;
        patreonId: string | null;
        patreonConnectedAt: Date | null;
    }>;
}
export {};
