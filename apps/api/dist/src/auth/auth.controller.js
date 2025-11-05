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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async patreonLogin() {
    }
    async patreonCallback(req, res) {
        const { accessToken } = await this.authService.login(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'https://turbo-meme-jjqj97vrrvwwf5w5w-80.app.github.dev';
        res.redirect(`${frontendUrl}/?token=${accessToken}`);
    }
    async testLogin(body) {
        const { email, role = 'FAN' } = body;
        let user = await this.authService.findUserByEmail(email);
        if (!user) {
            user = await this.authService.createTestUser(email, role);
        }
        const { accessToken } = await this.authService.login(user);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('patreon'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('patreon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patreonLogin", null);
__decorate([
    (0, common_1.Get)('patreon/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('patreon')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patreonCallback", null);
__decorate([
    (0, common_1.Post)('test-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map