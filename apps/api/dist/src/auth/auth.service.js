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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(profile) {
        var _a, _b;
        const patreonId = profile.id;
        const email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || profile.email || `${profile.id}@patreon.user`;
        let user = await this.prisma.user.findUnique({ where: { patreonId } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    patreonId,
                    email,
                    patreonConnectedAt: new Date(),
                },
            });
        }
        else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    patreonConnectedAt: new Date(),
                },
            });
        }
        return user;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async createTestUser(email, role = 'FAN') {
        const user = await this.prisma.user.create({
            data: {
                email,
                role,
            },
        });
        if (role === 'CREATOR') {
            await this.prisma.creator.create({
                data: {
                    userId: user.id,
                    displayName: email.split('@')[0],
                    bio: 'Test creator account',
                    isAdult: false,
                },
            });
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map