"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierModule = void 0;
const common_1 = require("@nestjs/common");
const tier_controller_1 = require("./tier.controller");
const tier_service_1 = require("./tier.service");
const prisma_module_1 = require("../prisma/prisma.module");
const creator_module_1 = require("../creator/creator.module");
let TierModule = class TierModule {
};
exports.TierModule = TierModule;
exports.TierModule = TierModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, creator_module_1.CreatorModule],
        controllers: [tier_controller_1.TierController],
        providers: [tier_service_1.TierService],
        exports: [tier_service_1.TierService],
    })
], TierModule);
//# sourceMappingURL=tier.module.js.map