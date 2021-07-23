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
exports.GuildService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nanoid_1 = require("nanoid");
const typeorm_2 = require("typeorm");
const redis_1 = require("../config/redis");
const ban_entity_1 = require("../entities/ban.entity");
const channel_entity_1 = require("../entities/channel.entity");
const guild_entity_1 = require("../entities/guild.entity");
const member_entity_1 = require("../entities/member.entity");
const user_entity_1 = require("../entities/user.entity");
const socket_service_1 = require("../socket/socket.service");
const constants_1 = require("../utils/constants");
const fileUtils_1 = require("../utils/fileUtils");
const idGenerator_1 = require("../utils/idGenerator");
let GuildService = class GuildService {
    constructor(guildRepository, channelRepository, userRepository, memberRepository, banRepository, socketService) {
        this.guildRepository = guildRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.banRepository = banRepository;
        this.socketService = socketService;
    }
    async getGuildMembers(guildId) {
        const manager = typeorm_2.getManager();
        return await manager.query(`select distinct u.id,
                       u.username,
                       u.image,
                       u."isOnline",
                       u."createdAt",
                       u."updatedAt",
                       exists(select 1 from friends f where f.user = u.id) as "isFriend"
       from users as u
                join members m on u."id"::text = m."userId"
       where m."guildId" = $1
       order by u.username
      `, [guildId]);
    }
    async getUserGuilds(userId) {
        const manager = typeorm_2.getManager();
        return await manager.query(`select distinct g."id",
                       g."name",
                       g."ownerId",
                       g."icon",
                       g."createdAt",
                       g."updatedAt",
                       ((select c."lastActivity"
                         from channels c
                                  join guilds g on g.id = c."guildId"
                         where g.id = member."guildId"
                         order by c."lastActivity" desc
                         limit 1) > member."lastSeen") as "hasNotification",
                       (select c.id as "default_channel_id"
                        from channels c
                                 join guilds g on g.id = c."guildId"
                        where g.id = member."guildId"
                        order by c."createdAt"
                        limit 1)
       from guilds g
                join members as member
                     on g."id"::text = member."guildId"
       where member."userId" = $1
       order by g."createdAt";`, [userId]);
    }
    async createGuild(name, userId) {
        await this.checkGuildLimit(userId);
        try {
            let guild = null;
            let channel = null;
            await typeorm_2.getManager().transaction(async (entityManager) => {
                guild = this.guildRepository.create({ ownerId: userId });
                channel = this.channelRepository.create({ name: 'general' });
                guild.name = name.trim();
                await guild.save();
                await entityManager.save(guild);
                channel.guild = guild;
                await channel.save();
                await entityManager.save(channel);
                await entityManager.insert(member_entity_1.Member, {
                    id: await idGenerator_1.idGenerator(),
                    guildId: guild.id,
                    userId,
                });
            });
            return this.toGuildResponse(guild, channel.id);
        }
        catch (err) {
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async generateInviteLink(guildId, isPermanent = false) {
        const token = nanoid_1.nanoid(8);
        const json = JSON.stringify({
            guildId,
            isPermanent,
        });
        if (isPermanent) {
            await redis_1.redis.set(constants_1.INVITE_LINK_PREFIX + token, json);
        }
        else {
            await redis_1.redis.set(constants_1.INVITE_LINK_PREFIX + token, json, 'ex', 60 * 60 * 24);
        }
        if (isPermanent) {
            const guild = await this.guildRepository.findOne(guildId);
            if (!guild)
                throw new common_1.NotFoundException();
            guild.inviteLinks.push(token);
            await guild.save();
        }
        return `${process.env.CORS_ORIGIN}/${token}`;
    }
    async invalidateGuildInvites(guildId, userId) {
        const guild = await this.guildRepository.findOne(guildId);
        if (!guild)
            throw new common_1.NotFoundException();
        if (guild.ownerId !== userId)
            throw new common_1.NotFoundException();
        guild.inviteLinks.forEach((token) => {
            redis_1.redis.del(constants_1.INVITE_LINK_PREFIX + token);
        });
        guild.inviteLinks = [];
        await guild.save();
        return true;
    }
    async joinGuild(token, userId) {
        await this.checkGuildLimit(userId);
        if (token.includes('/')) {
            token = token.substring(token.lastIndexOf('/') + 1);
        }
        const args = await redis_1.redis.get(constants_1.INVITE_LINK_PREFIX + token);
        if (!args) {
            throw new common_1.NotFoundException('Invalid Link');
        }
        const { guildId, isPermanent } = JSON.parse(args);
        const guild = await this.guildRepository.findOne(guildId);
        if (!guild) {
            throw new common_1.NotFoundException('Invalid Link or the server got deleted');
        }
        await this.checkIfBanned(userId, guildId);
        const isMember = await this.memberRepository.findOne({
            where: { userId, guildId },
        });
        if (isMember) {
            throw new common_1.BadRequestException('You are already a member of this guild');
        }
        await this.memberRepository.insert({
            id: await idGenerator_1.idGenerator(),
            userId,
            guildId,
        });
        if (!isPermanent)
            await redis_1.redis.del(constants_1.INVITE_LINK_PREFIX + token);
        const defaultChannel = await this.channelRepository.findOneOrFail({
            where: { guild },
            relations: ['guild'],
            order: { createdAt: 'ASC' },
        });
        const user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['friends'],
        });
        this.socketService.addMember({
            room: guild.id,
            member: user.toMember(userId),
        });
        return this.toGuildResponse(guild, defaultChannel.id);
    }
    async leaveGuild(userId, guildId) {
        const member = await this.memberRepository.findOneOrFail({
            where: { guildId, userId },
        });
        const guild = await this.guildRepository.findOneOrFail({
            where: { id: guildId },
        });
        if (guild.ownerId === userId)
            throw new common_1.BadRequestException('The owner cannot leave their server');
        await this.memberRepository.delete({ id: member.id });
        this.socketService.removeMember({ room: guildId, memberId: userId });
        return true;
    }
    async editGuild(userId, guildId, input, image) {
        var _a;
        const guild = await this.guildRepository.findOneOrFail({
            where: { id: guildId },
        });
        if (guild.ownerId !== userId) {
            throw new common_1.UnauthorizedException();
        }
        let icon = input.image;
        if (image) {
            const uImage = await fileUtils_1.uploadFromBuffer(image);
            icon = uImage.secure_url;
        }
        if (icon === 'null')
            icon = null;
        await this.guildRepository.update(guildId, {
            name: (_a = input.name) !== null && _a !== void 0 ? _a : guild.name,
            icon,
        });
        const updatedGuild = await this.guildRepository.findOneOrFail(guildId);
        this.socketService.editGuild(updatedGuild);
        return true;
    }
    async deleteGuild(userId, guildId) {
        const guild = await this.guildRepository.findOneOrFail({
            where: { id: guildId },
        });
        if (guild.ownerId !== userId) {
            throw new common_1.UnauthorizedException();
        }
        let memberIds;
        const manager = typeorm_2.getManager();
        memberIds = await manager.query('delete from members where "guildId" = $1 returning members."userId";', [guildId]);
        await manager.query('delete from pcmembers where "channelId" = (select id from channels where "guildId" = $1);', [guildId]);
        await manager.query('delete from bans where "guildId" = $1;', [guildId]);
        await this.guildRepository.remove(guild);
        this.socketService.deleteGuild(memberIds[0], guildId);
        return true;
    }
    async changeMemberSettings(userId, guildId, input) {
        const member = await this.memberRepository.findOne({
            where: {
                userId,
                guildId,
            },
        });
        if (!member)
            throw new common_1.NotFoundException();
        const { nickname, color } = input;
        await this.memberRepository.update({ id: member.id }, {
            color,
            nickname,
        });
        return true;
    }
    async getMemberSettings(userId, guildId) {
        const member = await this.memberRepository.findOne({
            where: {
                userId,
                guildId,
            },
        });
        if (!member)
            throw new common_1.NotFoundException();
        return {
            nickname: member.nickname,
            color: member.color,
        };
    }
    async kickMember(userId, guildId, memberId) {
        if (userId === memberId) {
            throw new common_1.BadRequestException('You cannot kick yourself');
        }
        await this.checkGuildOwnership(userId, guildId);
        const member = await this.memberRepository.findOne({
            where: { guildId, userId: memberId },
        });
        if (!member) {
            throw new common_1.NotFoundException();
        }
        await this.memberRepository.delete({ id: member.id });
        this.socketService.removeMember({ room: guildId, memberId });
        this.socketService.removeFromGuild(memberId, guildId);
        return true;
    }
    async banMember(userId, guildId, memberId) {
        if (userId === memberId) {
            throw new common_1.BadRequestException('You cannot ban yourself');
        }
        await this.checkGuildOwnership(userId, guildId);
        const member = await this.memberRepository.findOne({
            where: { guildId, userId: memberId },
        });
        if (!member) {
            throw new common_1.NotFoundException();
        }
        await this.memberRepository.delete({ id: member.id });
        this.socketService.removeMember({ room: guildId, memberId: userId });
        this.socketService.removeFromGuild(memberId, guildId);
        await this.banRepository.insert({
            id: await idGenerator_1.idGenerator(),
            guildId,
            userId: memberId,
        });
        return true;
    }
    async unbanUser(userId, guildId, memberId) {
        await this.checkGuildOwnership(userId, guildId);
        await this.banRepository.delete({
            userId: memberId,
            guildId,
        });
        return true;
    }
    async getBannedUsers(userId, guildId) {
        await this.checkGuildOwnership(userId, guildId);
        const manager = typeorm_2.getManager();
        return await manager.query(`select u.id, u.username, u.image
       from bans b join users u on b."userId" = u.id
       where b."guildId" = $1`, [guildId]);
    }
    async checkGuildOwnership(userId, guildId) {
        const guild = await this.guildRepository.findOne(guildId);
        if (!guild) {
            throw new common_1.NotFoundException();
        }
        if (guild.ownerId !== userId) {
            throw new common_1.UnauthorizedException();
        }
    }
    async checkGuildLimit(userId) {
        const count = await this.memberRepository.count({ userId });
        if (count >= 100) {
            throw new common_1.BadRequestException('Server Limit is 100');
        }
    }
    async checkIfBanned(userId, guildId) {
        const isBanned = await this.banRepository.findOne({
            where: {
                userId,
                guildId,
            },
        });
        if (isBanned) {
            throw new common_1.BadRequestException('You are banned from this server');
        }
    }
    toGuildResponse(guild, defaultChannelId) {
        return {
            id: guild.id,
            name: guild.name,
            default_channel_id: defaultChannelId,
            ownerId: guild.ownerId,
            createdAt: guild === null || guild === void 0 ? void 0 : guild.createdAt.toString(),
            updatedAt: guild === null || guild === void 0 ? void 0 : guild.updatedAt.toString(),
            hasNotification: false,
        };
    }
};
GuildService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(guild_entity_1.Guild)),
    __param(1, typeorm_1.InjectRepository(channel_entity_1.Channel)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(3, typeorm_1.InjectRepository(member_entity_1.Member)),
    __param(4, typeorm_1.InjectRepository(ban_entity_1.BanEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        socket_service_1.SocketService])
], GuildService);
exports.GuildService = GuildService;
//# sourceMappingURL=guild.service.js.map