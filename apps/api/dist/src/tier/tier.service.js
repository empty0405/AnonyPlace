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
exports.TierService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TierService = class TierService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTiersByCreatorId(creatorId) {
        return this.prisma.tier.findMany({
            where: { creatorId },
            orderBy: { level: 'asc' },
        });
    }
    async createTier(createDto) {
        const { creatorId, name, level, externalTierId } = createDto;
        return this.prisma.tier.create({
            data: {
                creatorId,
                name,
                level: level || 1,
                externalTierId,
            },
            include: {
                creator: true,
            },
        });
    }
    async getTierById(id) {
        const tier = await this.prisma.tier.findUnique({
            where: { id },
            include: {
                creator: true,
            },
        });
        if (!tier) {
            throw new common_1.NotFoundException('Tier not found');
        }
        return tier;
    }
    async updateTier(id, updateDto) {
        return this.prisma.tier.update({
            where: { id },
            data: updateDto,
        });
    }
    async deleteTier(id) {
        return this.prisma.tier.delete({
            where: { id },
        });
    }
    async getCreatorById(id) {
        const creator = await this.prisma.creator.findUnique({
            where: { id },
        });
        if (!creator) {
            throw new common_1.NotFoundException('Creator not found');
        }
        return creator;
    }
};
exports.TierService = TierService;
exports.TierService = TierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TierService);
//# sourceMappingURL=tier.service.js.map