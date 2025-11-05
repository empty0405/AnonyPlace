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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNotification(userId, type, title, message, link) {
        return this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link,
                isRead: false,
            },
        });
    }
    async getUserNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { created_at: 'desc' },
            take: 50,
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification || notification.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    async notifyNewPost(creatorId, postTitle, postId) {
        const memberships = await this.prisma.membership.findMany({
            where: {
                creatorId,
                status: 'ACTIVE',
            },
            include: {
                user: true,
                creator: true,
            },
        });
        const notifications = memberships.map((membership) => this.createNotification(membership.userId, 'NEW_POST', 'New Post', `${membership.creator.displayName} posted: ${postTitle}`, `/post/${postId}`));
        return Promise.all(notifications);
    }
    async notifyNewComment(postId, commenterEmail, commentContent) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: { creator: true },
        });
        if (!post)
            return;
        return this.createNotification(post.creator.userId, 'NEW_COMMENT', 'New Comment', `${commenterEmail} commented: ${commentContent.substring(0, 50)}`, `/post/${postId}`);
    }
    async notifyNewLike(postId, likerEmail) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: { creator: true },
        });
        if (!post)
            return;
        return this.createNotification(post.creator.userId, 'NEW_LIKE', 'New Like', `${likerEmail} liked your post: ${post.title}`, `/post/${postId}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map