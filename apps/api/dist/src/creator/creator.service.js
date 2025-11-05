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
exports.CreatorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CreatorService = class CreatorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCreators() {
        return this.prisma.creator.findMany({
            include: {
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async createCreator(userId, createDto) {
        const { displayName, bio, links, isAdult } = createDto;
        const existingCreator = await this.prisma.creator.findUnique({
            where: { userId },
        });
        if (existingCreator) {
            throw new common_1.ConflictException('Creator profile already exists for this user');
        }
        return this.prisma.$transaction(async (tx) => {
            const creator = await tx.creator.create({
                data: {
                    displayName,
                    bio,
                    links,
                    isAdult: isAdult || false,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            patreonId: true,
                        },
                    },
                },
            });
            await tx.user.update({
                where: { id: userId },
                data: { role: 'CREATOR' },
            });
            return creator;
        });
    }
    async getCreatorById(id) {
        const creator = await this.prisma.creator.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        email: true,
                        patreonId: true,
                    },
                },
                tiers: {
                    orderBy: { level: 'asc' },
                },
            },
        });
        if (!creator) {
            throw new common_1.NotFoundException('Creator not found');
        }
        return creator;
    }
    async getCreatorByUserId(userId) {
        return this.prisma.creator.findUnique({
            where: { userId },
        });
    }
    async updateCreator(id, updateDto) {
        return this.prisma.creator.update({
            where: { id },
            data: updateDto,
        });
    }
    async getCreatorTiers(creatorId) {
        return this.prisma.tier.findMany({
            where: { creatorId },
            orderBy: { level: 'asc' },
        });
    }
    async getCreatorPosts(creatorId, userId) {
        let userMemberships = [];
        if (userId) {
            userMemberships = await this.prisma.membership.findMany({
                where: {
                    userId,
                    status: 'ACTIVE',
                },
                include: {
                    tier: true,
                },
            });
        }
        const posts = await this.prisma.post.findMany({
            where: { creatorId },
            include: {
                tiers: true,
                assets: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return posts.map(post => {
            const postTierIds = post.tiers.map(t => t.id);
            const hasAccess = post.visibility === 'PUBLIC' ||
                postTierIds.length === 0 ||
                userMemberships.some(m => postTierIds.includes(m.tierId));
            return Object.assign(Object.assign({}, post), { hasAccess, assets: hasAccess ? post.assets : [] });
        });
    }
};
exports.CreatorService = CreatorService;
exports.CreatorService = CreatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CreatorService);
//# sourceMappingURL=creator.service.js.map