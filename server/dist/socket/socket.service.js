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
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const channel_entity_1 = require("../entities/channel.entity");
const member_entity_1 = require("../entities/member.entity");
const pcmember_entity_1 = require("../entities/pcmember.entity");
const websockets_1 = require("@nestjs/websockets");
const dmmember_entity_1 = require("../entities/dmmember.entity");
let SocketService = class SocketService {
    constructor(userRepository, channelRepository, memberRepository, pcMemberRepository, dmMemberRepository) {
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.memberRepository = memberRepository;
        this.pcMemberRepository = pcMemberRepository;
        this.dmMemberRepository = dmMemberRepository;
        this.socket = null;
    }
    async joinChannel(client, room) {
        const id = client.handshake.session['userId'];
        const channel = await this.channelRepository.findOne({
            where: { id: room },
            relations: ['guild']
        });
        if (!channel) {
            throw new websockets_1.WsException('Not Found');
        }
        await this.isChannelMember(channel, id);
        client.join(room);
    }
    sendMessage(message) {
        this.socket.to(message.room).emit('new_message', message.message);
    }
    editMessage(message) {
        this.socket.to(message.room).emit('edit_message', message.message);
    }
    deleteMessage(message) {
        this.socket.to(message.room).emit('delete_message', message.message);
    }
    addChannel(message) {
        this.socket.to(message.room).emit('add_channel', message.channel);
    }
    editChannel(message) {
        this.socket.to(message.room).emit('edit_channel', message.channel);
    }
    deleteChannel(message) {
        this.socket.to(message.room).emit('delete_channel', message.channelId);
    }
    async editGuild(guild) {
        const ids = await this.getGuildMemberIds(guild.id);
        ids.forEach(id => {
            const uid = id['userId'];
            this.socket.to(uid).emit('edit_guild', guild);
        });
    }
    deleteGuild(memberIds, guildId) {
        memberIds.forEach(id => {
            const uid = id['userId'];
            this.socket.to(uid).emit('delete_guild', guildId);
        });
    }
    removeFromGuild(memberId, guildId) {
        this.socket.to(memberId).emit('remove_from_guild', guildId);
    }
    addMember(message) {
        this.socket.to(message.room).emit('add_member', message.member);
    }
    removeMember(message) {
        this.socket.to(message.room).emit('remove_member', message.memberId);
    }
    async pushDMToTop(message) {
        const members = await this.dmMemberRepository.find({ where: { channelId: message.channelId } });
        members.forEach(m => {
            this.socket.to(m.userId).emit('push_to_top', message.channelId);
        });
    }
    async newNotification(guildId, channelId) {
        const members = await this.memberRepository.find({ where: { guildId } });
        members.forEach(m => {
            this.socket.to(m.userId).emit('new_notification', guildId);
        });
        this.socket.to(guildId).emit('new_notification', channelId);
    }
    async toggleOnlineStatus(client) {
        const id = client.handshake.session['userId'];
        await this.setOnlineStatus(id, true);
        const manager = typeorm_1.getManager();
        const ids = await manager.query(`
          select g.id
          from guilds g
          join members m on m."guildId" = g."id"
          where m."userId" = $1
          UNION
          SELECT "User__friends"."id"
          FROM "users" "User" LEFT JOIN "friends" "User_User__friends" ON "User_User__friends"."user"="User"."id" LEFT
              JOIN "users" "User__friends" ON "User__friends"."id"="User_User__friends"."friend"
          WHERE ( "User"."id" = $1 )
      `, [id]);
        ids.forEach(i => {
            const dId = i['id'];
            this.socket.to(dId).emit('toggle_online', id);
        });
    }
    async toggleOfflineStatus(client) {
        const id = client.handshake.session['userId'];
        await this.setOnlineStatus(id, false);
        const manager = typeorm_1.getManager();
        const ids = await manager.query(`
          select g.id
          from guilds g
         join members m on m."guildId" = g."id"
          where m."userId" = $1
          UNION
          SELECT "User__friends"."id"
          FROM "users" "User" LEFT JOIN "friends" "User_User__friends" ON "User_User__friends"."user"="User"."id" LEFT
              JOIN "users" "User__friends" ON "User__friends"."id"="User_User__friends"."friend"
          WHERE ( "User"."id" = $1 )

       `, [id]);
        ids.forEach(i => {
            const dId = i['id'];
            this.socket.to(dId).emit('toggle_offline', id);
        });
    }
    async updateLastSeen(client, room) {
        const id = client.handshake.session['userId'];
        const manager = typeorm_1.getManager();
        manager.query(`
          update members
          set "lastSeen" = CURRENT_TIMESTAMP
          where "userId" = $1 and "guildId" = $2
      `, [id, room]);
    }
    async setOnlineStatus(userId, isOnline) {
        await this.userRepository.update(userId, { isOnline });
    }
    addTyping(room, username) {
        this.socket.to(room).emit('addToTyping', username);
    }
    stopTyping(room, username) {
        this.socket.to(room).emit('removeFromTyping', username);
    }
    sendRequest(room) {
        this.socket.to(room).emit('send_request');
    }
    addFriend(room, member) {
        this.socket.to(room).emit('add_friend', member);
    }
    removeFriend(room, memberId) {
        this.socket.to(room).emit('remove_friend', memberId);
    }
    async isChannelMember(channel, userId) {
        if (!channel.isPublic) {
            if (channel.dm) {
                const member = await this.dmMemberRepository.findOne({
                    where: { channelId: channel.id, userId },
                });
                if (!member) {
                    throw new websockets_1.WsException('Not Authorized');
                }
            }
            else {
                const member = await this.pcMemberRepository.findOne({
                    where: { channelId: channel.id, userId }
                });
                if (!member) {
                    throw new websockets_1.WsException('Not Authorized');
                }
            }
        }
        else {
            const member = await this.memberRepository.findOneOrFail({
                where: { guildId: channel.guild.id, userId }
            });
            if (!member) {
                throw new websockets_1.WsException('Not Authorized');
            }
        }
        return true;
    }
    async getPendingFriendRequestCount(userId) {
        const manager = typeorm_1.getManager();
        const result = await manager.query(`
          select count(u.id)
          from users u
                   join friends_request fr on u.id = fr."senderId"
          where fr."receiverId" = $1
      `, [userId]);
        this.socket.to(userId).emit('requestCount', result[0]['count']);
    }
    async getGuildMemberIds(guildId) {
        const manager = typeorm_1.getManager();
        return await manager.query(`
          select m."userId"
          from guilds g
                   join members m on m."guildId" = g."id"
          where g.id = $1
      `, [guildId]);
    }
};
SocketService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_2.InjectRepository(channel_entity_1.Channel)),
    __param(2, typeorm_2.InjectRepository(member_entity_1.Member)),
    __param(3, typeorm_2.InjectRepository(pcmember_entity_1.PCMember)),
    __param(4, typeorm_2.InjectRepository(dmmember_entity_1.DMMember)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], SocketService);
exports.SocketService = SocketService;
//# sourceMappingURL=socket.service.js.map