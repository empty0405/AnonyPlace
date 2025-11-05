import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    patreonLogin(): Promise<void>;
    patreonCallback(req: any, res: any): Promise<void>;
    testLogin(body: {
        email: string;
        role?: 'FAN' | 'CREATOR';
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
}
