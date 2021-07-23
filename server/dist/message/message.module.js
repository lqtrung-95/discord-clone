"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_controller_1 = require("./message.controller");
const message_service_1 = require("./message.service");
const typeorm_1 = require("@nestjs/typeorm");
const channel_entity_1 = require("../entities/channel.entity");
const message_entity_1 = require("../entities/message.entity");
const user_entity_1 = require("../entities/user.entity");
const socket_module_1 = require("../socket/socket.module");
const pcmember_entity_1 = require("../entities/pcmember.entity");
const member_entity_1 = require("../entities/member.entity");
const dmmember_entity_1 = require("../entities/dmmember.entity");
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([message_entity_1.Message, channel_entity_1.Channel, user_entity_1.User, pcmember_entity_1.PCMember, member_entity_1.Member, dmmember_entity_1.DMMember]),
            socket_module_1.SocketModule
        ],
        controllers: [message_controller_1.MessageController],
        providers: [message_service_1.MessageService]
    })
], MessageModule);
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.module.js.map