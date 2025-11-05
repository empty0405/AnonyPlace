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
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = require("crypto");
let WebhooksService = class WebhooksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    verifyPatreonSignature(payload, signature) {
        const secret = process.env.PATREON_WEBHOOK_SECRET;
        if (!secret)
            return false;
        const hash = crypto
            .createHmac('md5', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        return hash === signature;
    }
    verifyHoodpaySignature(payload, signature) {
        const secret = process.env.HOODPAY_WEBHOOK_SECRET;
        if (!secret)
            return false;
        const hash = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        return signature === hash;
    }
    async processPatreonEvent(payload) {
        var _a, _b, _c;
        const { data, included } = payload;
        if (!data)
            return;
        const eventType = data.type;
        const userId = (_c = (_b = (_a = data.relationships) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id;
        if (!userId)
            return;
        const user = await this.prisma.user.findUnique({
            where: { patreonId: userId },
        });
        if (!user)
            return;
        switch (eventType) {
            case 'members:pledge:create':
            case 'members:pledge:update':
                await this.handleMembershipUpdate(user.id, data, included);
                break;
            case 'members:pledge:delete':
                await this.handleMembershipDelete(user.id);
                break;
        }
    }
    async handleMembershipUpdate(userId, data, included) {
        var _a, _b, _c, _d;
        const tierId = (_d = (_c = (_b = (_a = data.relationships) === null || _a === void 0 ? void 0 : _a.currently_entitled_tiers) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.id;
        if (!tierId)
            return;
        const tier = await this.prisma.tier.findFirst({
            where: { externalTierId: tierId },
        });
        if (!tier)
            return;
        const existing = await this.prisma.membership.findFirst({
            where: {
                userId,
                tierId: tier.id,
            },
        });
        if (!existing) {
            await this.prisma.membership.create({
                data: {
                    userId,
                    creatorId: tier.creatorId,
                    tierId: tier.id,
                    status: 'ACTIVE',
                },
            });
        }
        else {
            await this.prisma.membership.update({
                where: { id: existing.id },
                data: {
                    status: 'ACTIVE',
                },
            });
        }
    }
    async handleMembershipDelete(userId) {
        await this.prisma.membership.updateMany({
            where: { userId },
            data: {
                status: 'CANCELLED',
                expiresAt: new Date(),
            },
        });
    }
    async processHoodpayEvent(payload) {
        const { event, data } = payload;
        switch (event) {
            case 'payment.success':
                await this.handleHoodpayPayment(data);
                break;
            case 'subscription.updated':
            case 'subscription.cancelled':
                await this.handleHoodpaySubscription(data);
                break;
        }
    }
    async handleHoodpayPayment(data) {
        const { customer_email, product_id, amount } = data;
        const user = await this.prisma.user.findUnique({
            where: { email: customer_email },
        });
        if (!user)
            return;
        console.log('Hoodpay payment received:', { customer_email, product_id, amount });
    }
    async handleHoodpaySubscription(data) {
        const { customer_email, subscription_id, status } = data;
        const user = await this.prisma.user.findUnique({
            where: { email: customer_email },
        });
        if (!user)
            return;
        if (status === 'cancelled') {
            await this.prisma.membership.updateMany({
                where: { userId: user.id },
                data: {
                    status: 'CANCELLED',
                    expiresAt: new Date(),
                },
            });
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map