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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const webhooks_service_1 = require("./webhooks.service");
let WebhooksController = class WebhooksController {
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    async handlePatreonWebhook(payload, signature) {
        const isValid = this.webhooksService.verifyPatreonSignature(payload, signature);
        if (!isValid) {
            throw new common_1.HttpException('Invalid signature', common_1.HttpStatus.UNAUTHORIZED);
        }
        await this.webhooksService.processPatreonEvent(payload);
        return { received: true };
    }
    async handleHoodpayWebhook(payload, signature) {
        const isValid = this.webhooksService.verifyHoodpaySignature(payload, signature);
        if (!isValid) {
            throw new common_1.HttpException('Invalid signature', common_1.HttpStatus.UNAUTHORIZED);
        }
        await this.webhooksService.processHoodpayEvent(payload);
        return { received: true };
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('patreon'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-patreon-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handlePatreonWebhook", null);
__decorate([
    (0, common_1.Post)('hoodpay'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-hoodpay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleHoodpayWebhook", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map