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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("../entities/channel.entity");
const member_entity_1 = require("../entities/member.entity");
const user_entity_1 = require("../entities/user.entity");
const guild_entity_1 = require("../entities/guild.entity");
const socket_service_1 = require("../socket/socket.service");
const pcmember_entity_1 = require("../entities/pcmember.entity");
const idGenerator_1 = require("../utils/idGenerator");
const dmmember_entity_1 = require("../entities/dmmember.entity");
let ChannelService = class ChannelService {
    constructor(channelRepository, guildRepository, memberRepository, userRepository, pcMemberRepository, dmMemberRepository, socketService) {
        this.channelRepository = channelRepository;
        this.guildRepository = guildRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.pcMemberRepository = pcMemberRepository;
        this.dmMemberRepository = dmMemberRepository;
        this.socketService = socketService;
    }
    async createChannel(guildId, userId, input) {
        const { name, isPublic } = input;
        let { members } = input;
        const data = { name: name.trim(), public: isPublic };
        const guild = await this.guildRepository.findOneOrFail({
            where: { id: guildId }
        });
        if (guild.ownerId !== userId)
            throw new common_1.UnauthorizedException();
        const count = await this.channelRepository.count({ guild });
        if (count >= 50) {
            throw new common_1.BadRequestException('Channel Limit is 50');
        }
        let channel;
        await typeorm_2.getManager().transaction(async (entityManager) => {
            channel = this.channelRepository.create(data);
            channel.guild = guild;
            await channel.save();
            if (!isPublic) {
                members = members.filter((m) => m !== userId);
                members.push(userId);
                const pcmembers = members.map((m) => ({
                    userId: m,
                    channelId: channel.id
                }));
                pcmembers.forEach((member) => {
                    entityManager.insert(pcmember_entity_1.PCMember, {
                        id: idGenerator_1.idGenerator(),
                        channelId: channel.id,
                        userId: member.userId
                    });
                });
                channel.isPublic = false;
            }
            await entityManager.save(channel);
        });
        this.socketService.addChannel({ room: guildId, channel: this.toChannelResponse(channel) });
        return true;
    }
    async getGuildChannels(guildId, userId) {
        const manager = typeorm_2.getManager();
        return await manager.query(`
          select distinct on (c.id, c."createdAt") c.id, c.name, 
                 c."isPublic", c."createdAt", c."updatedAt",
                 (c."lastActivity" > m."lastSeen") as "hasNotification"
          from channels as c
                   left outer join pcmembers as pc
                                   on c."id"::text = pc."channelId"::text
                    left outer join members m on c."guildId" = m."guildId"
          where c."guildId"::text = $1
            and (c."isPublic" = true or pc."userId"::text = $2)
          order by c."createdAt"
      `, [guildId, userId]);
    }
    async getOrCreateChannel(userId, memberId) {
        const member = await this.userRepository.findOne({
            where: { id: memberId }
        });
        if (!member) {
            throw new common_1.NotFoundException();
        }
        const data = await typeorm_2.getManager().query(`
        select c.id
        from channels as c, dm_members dm 
        where dm."channelId" = c."id" and c.dm = true and c."isPublic" = false
        group by c."id"
        having array_agg(dm."userId"::text) @> Array['${memberId}', '${userId}']
        and count(dm."userId") = 2;
        `);
        if (data.length) {
            this.setDirectMessageStatus(data[0].id, userId, true);
            return {
                id: data[0].id,
                user: member.toMember(userId)
            };
        }
        const channelId = await typeorm_2.getManager().transaction(async (entityManager) => {
            const channel = await this.channelRepository.create({
                name: idGenerator_1.idGenerator(),
                isPublic: false,
                dm: true
            });
            await channel.save();
            await entityManager.save(channel);
            const channelId = channel.id;
            const allMembers = [memberId, userId];
            const dmMembers = allMembers.map((m) => ({ userId: m, channelId }));
            dmMembers.forEach((member) => {
                entityManager.insert(dmmember_entity_1.DMMember, {
                    id: idGenerator_1.idGenerator(),
                    channelId,
                    userId: member.userId,
                    isOpen: member.userId === userId
                });
            });
            return channelId;
        });
        return {
            id: channelId,
            user: member.toMember(userId)
        };
    }
    async getDirectMessageChannels(userId) {
        const manager = typeorm_2.getManager();
        const result = await manager.query(`
          select dm."channelId", u.username, u.image, u.id, u."isOnline", u."createdAt", u."updatedAt"
          from users u
                   join dm_members dm on dm."userId" = u.id
          where u.id != $1
            and dm."channelId" in (
              select distinct c.id
              from channels as c
                       left outer join dm_members as dm
                                       on c."id" = dm."channelId"
                       join users u on dm."userId" = u.id
              where c."isPublic" = false
                and c.dm = true
                and dm."isOpen" = true
                and dm."userId" = $1
          )
          order by dm."updatedAt" DESC 
      `, [userId]);
        const dms = [];
        result.map(r => dms.push({
            id: r.channelId,
            user: {
                id: r.id,
                username: r.username,
                image: r.image,
                isOnline: r.isOnline,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                isFriend: false
            }
        }));
        return dms;
    }
    async editChannel(userId, channelId, input) {
        const channel = await this.channelRepository.findOneOrFail({
            where: { id: channelId },
            relations: ['guild']
        });
        if (!channel) {
            throw new common_1.NotFoundException();
        }
        if (channel.guild.ownerId !== userId) {
            throw new common_1.UnauthorizedException();
        }
        const { name, isPublic } = input;
        let { members } = input;
        if (isPublic && !channel.isPublic) {
            await typeorm_2.getManager().query('delete from pcmembers where "channelId" = $1;', [channelId]);
        }
        await this.channelRepository.update(channelId, {
            name: name !== null && name !== void 0 ? name : channel.name,
            isPublic: isPublic !== null && isPublic !== void 0 ? isPublic : channel.isPublic
        });
        if (!isPublic && members) {
            await typeorm_2.getManager().transaction(async (entityManager) => {
                members = members.filter((m) => m !== userId);
                members.push(userId);
                const current = await this.pcMemberRepository.find({ where: { channelId } });
                const newMembers = members.filter((m => !current.map(c => c.userId).includes(m)));
                const remove = current.filter((c => !members.map(m => m).includes(c.userId)));
                const pcmembers = newMembers.map((m) => ({
                    userId: m,
                    channelId: channel.id
                }));
                pcmembers.forEach((member) => {
                    entityManager.insert(pcmember_entity_1.PCMember, {
                        id: idGenerator_1.idGenerator(),
                        channelId: channel.id,
                        userId: member.userId
                    });
                });
                if (remove.length > 0) {
                    await entityManager.query('delete from pcmembers where "userId" IN ($1) and "channelId" = $2;', [...remove.map(r => r.userId), channelId]);
                }
            });
        }
        const updatedChannel = await this.channelRepository.findOne({
            where: { id: channelId }
        });
        this.socketService.editChannel({ room: channel.guild.id, channel: this.toChannelResponse(updatedChannel) });
        return true;
    }
    async deleteChannel(userId, channelId) {
        const channel = await this.channelRepository.findOneOrFail({
            where: { id: channelId },
            relations: ['guild', 'members']
        });
        if (!channel) {
            throw new common_1.NotFoundException();
        }
        if (channel.guild.ownerId !== userId) {
            throw new common_1.UnauthorizedException();
        }
        const count = await this.channelRepository.count({ guild: channel.guild });
        if (count === 1) {
            throw new common_1.BadRequestException("A server needs at least one channel");
        }
        if (!channel.isPublic) {
            await typeorm_2.getManager().query('delete from pcmembers where "channelId" = $1;', [channelId]);
        }
        await this.channelRepository.remove(channel);
        this.socketService.deleteChannel({ room: channel.guild.id, channelId });
        return true;
    }
    async getPrivateChannelMembers(userId, channelId) {
        const channel = await this.channelRepository.findOneOrFail({
            where: { id: channelId },
            relations: ['guild']
        });
        if (!channel) {
            throw new common_1.NotFoundException();
        }
        if (channel.guild.ownerId !== userId) {
            throw new common_1.UnauthorizedException();
        }
        if (channel.isPublic)
            return [];
        const ids = await typeorm_2.getManager().query(`
          select pc."userId"
          from pcmembers pc
                   join channels c on pc."channelId" = c.id
          where c.id = $1
      `, [channelId]);
        if (ids.length === 0)
            return [];
        return ids.map(i => i.userId);
    }
    async setDirectMessageStatus(channelId, userId, isOpen) {
        const channel = await this.dmMemberRepository.findOneOrFail({
            where: { channelId, userId }
        });
        if (!channel)
            throw new common_1.NotFoundException();
        await this.dmMemberRepository.update({ id: channel.id }, {
            isOpen
        });
        return true;
    }
    toChannelResponse(channel) {
        return {
            id: channel.id,
            name: channel.name,
            isPublic: channel.isPublic,
            createdAt: channel.createdAt.toString(),
            updatedAt: channel.updatedAt.toString()
        };
    }
};
ChannelService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(channel_entity_1.Channel)),
    __param(1, typeorm_1.InjectRepository(guild_entity_1.Guild)),
    __param(2, typeorm_1.InjectRepository(member_entity_1.Member)),
    __param(3, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(4, typeorm_1.InjectRepository(pcmember_entity_1.PCMember)),
    __param(5, typeorm_1.InjectRepository(dmmember_entity_1.DMMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        socket_service_1.SocketService])
], ChannelService);
exports.ChannelService = ChannelService;
//# sourceMappingURL=channel.service.js.map