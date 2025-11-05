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
exports.MembershipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MembershipService = class MembershipService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserMemberships(userId) {
        return this.prisma.membership.findMany({
            where: {
                userId,
                status: 'ACTIVE',
                expiresAt: {
                    gte: new Date(),
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        displayName: true,
                    },
                },
                tier: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
            },
        });
    }
    async createMembership(userId, creatorId, tierId) {
        const tier = await this.prisma.tier.findFirst({
            where: {
                id: tierId,
                creatorId,
            },
        });
        if (!tier) {
            throw new common_1.NotFoundException('Tier not found for this creator');
        }
        const existing = await this.prisma.membership.findFirst({
            where: {
                userId,
                creatorId,
                status: 'ACTIVE',
                expiresAt: {
                    gte: new Date(),
                },
            },
        });
        if (existing) {
            throw new common_1.ForbiddenException('Already subscribed to this creator');
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        return this.prisma.membership.create({
            data: {
                userId,
                creatorId,
                tierId,
                status: 'ACTIVE',
                expiresAt,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        displayName: true,
                    },
                },
                tier: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
            },
        });
    }
    async cancelMembership(membershipId, userId) {
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        if (membership.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to cancel this membership');
        }
        return this.prisma.membership.update({
            where: { id: membershipId },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.MembershipService = MembershipService;
exports.MembershipService = MembershipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipService);
//# sourceMappingURL=membership.service.js.map