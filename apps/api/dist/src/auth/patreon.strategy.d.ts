import { Strategy } from 'passport-patreon';
import { AuthService } from './auth.service';
declare const PatreonStrategy_base: new (...args: any[]) => Strategy;
export declare class PatreonStrategy extends PatreonStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any>;
}
export {};
