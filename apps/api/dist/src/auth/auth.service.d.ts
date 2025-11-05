import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(profile: any): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
    }>;
    findUserByEmail(email: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        role: import(".prisma/client").$Enums.Role;
        status: string;
        email: string;
        patreonId: string | null;
        patreonConnectedAt: Date | null;
    }>;
    createTestUser(email: string, role?: 'FAN' | 'CREATOR'): Promise<{
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
