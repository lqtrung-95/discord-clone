"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const common_1 = require("@nestjs/common");
const socket_service_1 = require("./socket.service");
const app_gateway_1 = require("./app.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const channel_entity_1 = require("../entities/channel.entity");
const member_entity_1 = require("../entities/member.entity");
const pcmember_entity_1 = require("../entities/pcmember.entity");
const dmmember_entity_1 = require("../entities/dmmember.entity");
let SocketModule = class SocketModule {
};
SocketModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, channel_entity_1.Channel, member_entity_1.Member, pcmember_entity_1.PCMember, dmmember_entity_1.DMMember])
        ],
        providers: [socket_service_1.SocketService, app_gateway_1.AppGateway],
        exports: [socket_service_1.SocketService],
    })
], SocketModule);
exports.SocketModule = SocketModule;
//# sourceMappingURL=socket.module.js.map