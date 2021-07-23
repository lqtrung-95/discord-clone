"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberGuard = void 0;
const common_1 = require("@nestjs/common");
const member_entity_1 = require("../../entities/member.entity");
let MemberGuard = class MemberGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!(request === null || request === void 0 ? void 0 : request.session["userId"]))
            return false;
        const { guildId } = request.params;
        const member = await member_entity_1.Member.findOne({
            where: { guildId, userId: request.session["userId"] },
        });
        return !!member;
    }
};
MemberGuard = __decorate([
    common_1.Injectable()
], MemberGuard);
exports.MemberGuard = MemberGuard;
//# sourceMappingURL=member.guard.js.map