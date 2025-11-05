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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const tier_service_1 = require("./tier.service");
const creator_service_1 = require("../creator/creator.service");
let TierController = class TierController {
    constructor(tierService, creatorService) {
        this.tierService = tierService;
        this.creatorService = creatorService;
    }
    async getUserTiers(req) {
        const creator = await this.creatorService.getCreatorByUserId(req.user.id);
        if (!creator) {
            throw new common_1.HttpException('Creator profile not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.tierService.getTiersByCreatorId(creator.id);
    }
    async createTier(req, createDto) {
        const creator = await this.creatorService.getCreatorByUserId(req.user.id);
        if (!creator) {
            throw new common_1.HttpException('Creator profile not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.tierService.createTier(Object.assign(Object.assign({}, createDto), { creatorId: creator.id }));
    }
    async getTier(id) {
        return this.tierService.getTierById(id);
    }
    async updateTier(req, id, updateDto) {
        const tier = await this.tierService.getTierById(id);
        const creator = await this.creatorService.getCreatorById(tier.creatorId);
        if (creator.userId !== req.user.id) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.FORBIDDEN);
        }
        return this.tierService.updateTier(id, updateDto);
    }
    async deleteTier(req, id) {
        const tier = await this.tierService.getTierById(id);
        const creator = await this.creatorService.getCreatorById(tier.creatorId);
        if (creator.userId !== req.user.id) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.FORBIDDEN);
        }
        return this.tierService.deleteTier(id);
    }
};
exports.TierController = TierController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TierController.prototype, "getUserTiers", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TierController.prototype, "createTier", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TierController.prototype, "getTier", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TierController.prototype, "updateTier", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TierController.prototype, "deleteTier", null);
exports.TierController = TierController = __decorate([
    (0, common_1.Controller)('tier'),
    __metadata("design:paramtypes", [tier_service_1.TierService,
        creator_service_1.CreatorService])
], TierController);
//# sourceMappingURL=tier.controller.js.map