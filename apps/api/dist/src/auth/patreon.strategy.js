"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatreonStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_patreon_1 = require("passport-patreon");
const auth_service_1 = require("./auth.service");
let PatreonStrategy = class PatreonStrategy extends (0, passport_1.PassportStrategy)(passport_patreon_1.Strategy, 'patreon') {
    constructor(authService) {
        super({
            clientID: process.env.PATREON_CLIENT_ID,
            clientSecret: process.env.PATREON_CLIENT_SECRET,
            callbackURL: process.env.PATREON_REDIRECT_URI,
            scope: 'identity identity[email] campaigns',
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = await this.authService.validateUser(profile);
        if (!user) {
            return done(new Error('User not found'), null);
        }
        return done(null, user);
    }
};
exports.PatreonStrategy = PatreonStrategy;
exports.PatreonStrategy = PatreonStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], PatreonStrategy);
//# sourceMappingURL=patreon.strategy.js.map