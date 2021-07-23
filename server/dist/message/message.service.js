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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("../entities/channel.entity");
const dmmember_entity_1 = require("../entities/dmmember.entity");
const member_entity_1 = require("../entities/member.entity");
const message_entity_1 = require("../entities/message.entity");
const pcmember_entity_1 = require("../entities/pcmember.entity");
const user_entity_1 = require("../entities/user.entity");
const socket_service_1 = require("../socket/socket.service");
const constants_1 = require("../utils/constants");
const fileUtils_1 = require("../utils/fileUtils");
let MessageService = class MessageService {
    constructor(userRepository, messageRepository, channelRepository, memberRepository, pcMemberRepository, dmMemberRepository, socketService) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.memberRepository = memberRepository;
        this.pcMemberRepository = pcMemberRepository;
        this.dmMemberRepository = dmMemberRepository;
        this.socketService = socketService;
    }
    async getMessages(channelId, userId, cursor) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['guild'],
        });
        if (!channel) {
            throw new common_1.NotFoundException();
        }
        await this.isChannelMember(channel, userId);
        let time;
        if (cursor) {
            const timeString = new Date(cursor).getTime().toString();
            time = timeString.substring(0, timeString.length - 3);
        }
        const manager = typeorm_2.getManager();
        const results = await manager.query(`
          SELECT "message".id,
                  "message".text,
                  "message".filetype,
                  "message".url,
                  "message"."createdAt",
                  "message"."updatedAt",
                  "user"."id" as "userId",
                  "user"."createdAt" as "ucreatedAt",
                  "user"."updatedAt" as "uupdatedAt",
                  "user"."username",
                  "user"."image",
                  "user"."isOnline",
                  ${!channel.dm ? 'member.nickname, member.color,' : ''}
                  exists(
                          select 1
                          from users
                                   left join friends f on users.id = f."user"
                          where f."friend" = "message"."userId"
                            and f."user" = $2
                      ) as "isFriend"
          FROM "messages" "message"
                   LEFT JOIN "users" "user" ON "user"."id" = "message"."userId"
                   ${!channel.dm
            ? 'LEFT JOIN members member on "message"."userId" = member."userId"'
            : ''}
          WHERE message."channelId" = $1 
          ${!channel.dm
            ? `AND member."guildId" = ${channel.guild.id}::text`
            : ''}
          ${cursor ? `AND message."createdAt" < (to_timestamp(${time}))` : ``}
          ORDER BY "message"."createdAt" DESC
              LIMIT 35
      `, [channelId, userId]);
        const messages = [];
        results.map((m) => messages.push({
            id: m.id,
            text: m.text,
            filetype: m.filetype,
            url: m.url,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            user: {
                id: m.userId,
                username: m.username,
                image: m.image,
                isOnline: m.isOnline,
                createdAt: m.ucreatedAt,
                updatedAt: m.uupdatedAt,
                isFriend: m.isFriend,
                nickname: m.nickname,
                color: m.color,
            },
        }));
        return messages;
    }
    async createMessage(userId, channelId, input, file) {
        const channel = await this.channelRepository.findOneOrFail({
            where: { id: channelId },
            relations: ['guild'],
        });
        await this.isChannelMember(channel, userId);
        if (!file && !input.text) {
            throw new common_1.BadRequestException();
        }
        const message = this.messageRepository.create(Object.assign({}, input));
        if (file && !constants_1.PRODUCTION) {
            const directory = `channels/${channelId}`;
            const data = await fileUtils_1.uploadFromBuffer(file);
            message.filetype = file.mimetype;
            message.url = data.secure_url;
        }
        message.user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['friends'],
        });
        message.channel = channel;
        await message.save();
        const response = message.toJSON(userId);
        if (!channel.dm) {
            const member = await this.memberRepository.findOne({
                where: {
                    userId,
                    guildId: channel.guild.id,
                },
            });
            response.user.nickname = member === null || member === void 0 ? void 0 : member.nickname;
            response.user.color = member === null || member === void 0 ? void 0 : member.color;
        }
        this.socketService.sendMessage({ room: channelId, message: response });
        if (channel.dm) {
            typeorm_2.getManager().query(`
            update dm_members
            set "isOpen" = true,
                "updatedAt" = CURRENT_TIMESTAMP
            where "channelId" = $1
        `, [channelId]);
            this.socketService.pushDMToTop({ room: channelId, channelId });
        }
        else {
            typeorm_2.getManager().query(`
            update channels
            set "lastActivity" = CURRENT_TIMESTAMP
            where "id" = $1
        `, [channel.id]);
            this.socketService.newNotification(message.channel.guild.id, channelId);
        }
    }
    async editMessage(userId, id, text) {
        let message = await this.messageRepository.findOneOrFail({
            where: { id },
            relations: ['user', 'channel'],
        });
        if (!message) {
            throw new common_1.NotFoundException();
        }
        if (message.user.id !== userId) {
            throw new common_1.UnauthorizedException();
        }
        await this.messageRepository.update(id, { text });
        message = await this.messageRepository.findOneOrFail({
            where: { id },
            relations: ['user', 'channel'],
        });
        this.socketService.editMessage({
            room: message.channel.id,
            message: message.toJSON(userId),
        });
        return true;
    }
    async deleteMessage(userId, id) {
        const message = await this.messageRepository.findOneOrFail({
            where: { id },
            relations: ['user', 'channel'],
        });
        if (!message) {
            throw new common_1.NotFoundException();
        }
        if (message.user.id !== userId) {
            throw new common_1.UnauthorizedException();
        }
        const deleteId = message.id;
        await this.messageRepository.remove(message);
        message.id = deleteId;
        this.socketService.deleteMessage({
            room: message.channel.id,
            message: message.toJSON(userId),
        });
        return true;
    }
    async isChannelMember(channel, userId) {
        if (!channel.isPublic) {
            if (channel.dm) {
                const member = await this.dmMemberRepository.findOne({
                    where: { channelId: channel.id, userId },
                });
                if (!member) {
                    throw new common_1.UnauthorizedException('Not Authorized');
                }
            }
            else {
                const member = await this.pcMemberRepository.findOne({
                    where: { channelId: channel.id, userId },
                });
                if (!member) {
                    throw new common_1.UnauthorizedException('Not Authorized');
                }
            }
        }
        else {
            const member = await this.memberRepository.findOneOrFail({
                where: { guildId: channel.guild.id, userId },
            });
            if (!member) {
                throw new common_1.UnauthorizedException('Not Authorized');
            }
        }
    }
};
MessageService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_1.InjectRepository(message_entity_1.Message)),
    __param(2, typeorm_1.InjectRepository(channel_entity_1.Channel)),
    __param(3, typeorm_1.InjectRepository(member_entity_1.Member)),
    __param(4, typeorm_1.InjectRepository(pcmember_entity_1.PCMember)),
    __param(5, typeorm_1.InjectRepository(dmmember_entity_1.DMMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        socket_service_1.SocketService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map