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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bull_1 = require("@nestjs/bull");
let PostService = class PostService {
    constructor(prisma, videoQueue) {
        this.prisma = prisma;
        this.videoQueue = videoQueue;
    }
    async createPost(createDto) {
        const { creatorId, title, description, tierId, videoPath, videoSize, videoMimeType, thumbnailUrl, isPublic, } = createDto;
        const post = await this.prisma.post.create({
            data: {
                creatorId,
                title,
                body: description,
                visibility: isPublic === 'true' ? 'PUBLIC' : 'TIER',
                thumbnail: thumbnailUrl,
            },
            include: {
                creator: true,
            },
        });
        return post;
    }
    async getPostById(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                creator: true,
                tiers: true,
                assets: true,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const hasAccess = await this.checkAccess(post, userId);
        return Object.assign(Object.assign({}, post), { hasAccess });
    }
    async updatePost(id, updateDto) {
        return this.prisma.post.update({
            where: { id },
            data: updateDto,
        });
    }
    async deletePost(id) {
        return this.prisma.post.delete({
            where: { id },
        });
    }
    async getStreamUrl(postId, userId) {
        const post = await this.getPostById(postId, userId);
        if (!post.hasAccess) {
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        return {
            streamUrl: `/media/${postId}/playlist.m3u8`,
            thumbnailUrl: post.thumbnail,
        };
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
    async checkAccess(post, userId) {
        if (post.visibility === 'PUBLIC')
            return true;
        if (!post.tiers || post.tiers.length === 0)
            return true;
        if (!userId)
            return false;
        const postTierIds = post.tiers.map((t) => t.id);
        const membership = await this.prisma.membership.findFirst({
            where: {
                userId,
                tierId: { in: postTierIds },
                status: 'ACTIVE',
            },
        });
        return !!membership;
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('video-processing')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], PostService);
//# sourceMappingURL=post.service.js.map