"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsMemberGuard = void 0;
const common_1 = require("@nestjs/common");
const member_entity_1 = require("../../entities/member.entity");
let WsMemberGuard = class WsMemberGuard {
    async canActivate(context) {
        var _a, _b;
        const client = context.switchToWs().getClient();
        if (!((_a = client === null || client === void 0 ? void 0 : client.handshake) === null || _a === void 0 ? void 0 : _a.session["userId"]))
            return false;
        const id = (_b = client === null || client === void 0 ? void 0 : client.handshake) === null || _b === void 0 ? void 0 : _b.session["userId"];
        const guildId = context.getArgs()[1];
        if (!guildId)
            return false;
        const member = await member_entity_1.Member.findOne({
            where: { guildId, userId: id },
        });
        return !!member;
    }
};
WsMemberGuard = __decorate([
    common_1.Injectable()
], WsMemberGuard);
exports.WsMemberGuard = WsMemberGuard;
//# sourceMappingURL=ws.guild.guard.js.map