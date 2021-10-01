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
exports.GuildController = void 0;
const common_1 = require("@nestjs/common");
const guild_service_1 = require("./guild.service");
const auth_guard_1 = require("../guards/http/auth.guard");
const user_decorator_1 = require("../config/user.decorator");
const member_guard_1 = require("../guards/http/member.guard");
const MemberResponse_1 = require("../models/response/MemberResponse");
const yupValidationPipe_1 = require("../utils/yupValidationPipe");
const guild_schema_1 = require("../validation/guild.schema");
const GuildInput_1 = require("../models/input/GuildInput");
const GuildResponse_1 = require("../models/response/GuildResponse");
const swagger_1 = require("@nestjs/swagger");
const GuildMemberInput_1 = require("../models/input/GuildMemberInput");
const member_schema_1 = require("../validation/member.schema");
const platform_express_1 = require("@nestjs/platform-express");
let GuildController = class GuildController {
    constructor(guildService) {
        this.guildService = guildService;
    }
    async getGuildMembers(guildId, userId) {
        return await this.guildService.getGuildMembers(guildId);
    }
    async getGuilds(userId) {
        return await this.guildService.getUserGuilds(userId);
    }
    async createGuild(input, user) {
        const { name } = input;
        return await this.guildService.createGuild(name, user);
    }
    async generateTeamInvite(id, isPermanent) {
        return await this.guildService.generateInviteLink(id, isPermanent);
    }
    async deleteAllInvites(id, userId) {
        return await this.guildService.invalidateGuildInvites(id, userId);
    }
    async joinGuild(link, user) {
        return await this.guildService.joinGuild(link, user);
    }
    async getMemberSettings(user, guildId) {
        return await this.guildService.getMemberSettings(user, guildId);
    }
    async editMember(user, guildId, input) {
        return await this.guildService.changeMemberSettings(user, guildId, input);
    }
    async leaveGuild(userId, guildId) {
        return await this.guildService.leaveGuild(userId, guildId);
    }
    async editGuild(user, guildId, input, image) {
        return await this.guildService.editGuild(user, guildId, input, image);
    }
    async deleteGuild(userId, guildId) {
        return await this.guildService.deleteGuild(userId, guildId);
    }
    async getBannedUsers(userId, guildId) {
        return await this.guildService.getBannedUsers(userId, guildId);
    }
    async banUser(userId, guildId, memberId) {
        return await this.guildService.banMember(userId, guildId, memberId);
    }
    async kickUser(userId, guildId, memberId) {
        return await this.guildService.kickMember(userId, guildId, memberId);
    }
    async unbanUser(userId, guildId, memberId) {
        return await this.guildService.unbanUser(userId, guildId, memberId);
    }
};
__decorate([
    (0, common_1.Get)("/:guildId/members"),
    (0, common_1.UseGuards)(member_guard_1.MemberGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get Guild Members' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: [MemberResponse_1.MemberResponse] }),
    __param(0, (0, common_1.Param)('guildId')),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "getGuildMembers", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get Users Guilds' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: [GuildResponse_1.GuildResponse] }),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "getGuilds", null);
__decorate([
    (0, common_1.Post)("/create"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create Guild' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiBody)({ type: GuildInput_1.GuildInput }),
    (0, swagger_1.ApiOkResponse)({ type: [GuildResponse_1.GuildResponse] }),
    __param(0, (0, common_1.Body)(new yupValidationPipe_1.YupValidationPipe(guild_schema_1.GuildSchema))),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuildInput_1.GuildInput, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "createGuild", null);
__decorate([
    (0, common_1.Get)("/:guildId/invite"),
    (0, common_1.UseGuards)(member_guard_1.MemberGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create Invite Link' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiBody)({ type: String, description: "The guildId" }),
    (0, swagger_1.ApiOkResponse)({ type: String, description: "The invite link" }),
    __param(0, (0, common_1.Param)('guildId')),
    __param(1, (0, common_1.Query)('isPermanent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "generateTeamInvite", null);
__decorate([
    (0, common_1.Delete)("/:guildId/invite"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all permanent invite links' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiBody)({ type: String, description: "The guildId" }),
    (0, swagger_1.ApiOkResponse)({ type: Boolean }),
    __param(0, (0, common_1.Param)('guildId')),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "deleteAllInvites", null);
__decorate([
    (0, common_1.Post)("/join"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Join Guild' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiBody)({ type: String, description: "The invite link" }),
    (0, swagger_1.ApiOkResponse)({ type: GuildResponse_1.GuildResponse }),
    __param(0, (0, common_1.Body)('link')),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "joinGuild", null);
__decorate([
    (0, common_1.Get)("/:guildId/member"),
    (0, common_1.UseGuards)(member_guard_1.MemberGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get Member Settings' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "getMemberSettings", null);
__decorate([
    (0, common_1.Put)("/:guildId/member"),
    (0, common_1.UseGuards)(member_guard_1.MemberGuard),
    (0, swagger_1.ApiBody)({ type: GuildMemberInput_1.GuildMemberInput }),
    (0, swagger_1.ApiOperation)({ summary: 'Edit Member Settings' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __param(2, (0, common_1.Body)(new yupValidationPipe_1.YupValidationPipe(member_schema_1.MemberSchema), new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, GuildMemberInput_1.GuildMemberInput]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "editMember", null);
__decorate([
    (0, common_1.Delete)("/:guildId"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Leave Guild' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: Boolean }),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("guildId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "leaveGuild", null);
__decorate([
    (0, common_1.Put)("/:guildId"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Edit Guild' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Edit Success', type: Boolean }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, swagger_1.ApiBody)({ type: GuildInput_1.GuildInput }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __param(2, (0, common_1.Body)(new yupValidationPipe_1.YupValidationPipe(guild_schema_1.UpdateGuildSchema), new common_1.ValidationPipe({ transform: true }))),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, GuildInput_1.GuildInput, Object]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "editGuild", null);
__decorate([
    (0, common_1.Delete)("/:guildId/delete"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Guild' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete Success', type: Boolean }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "deleteGuild", null);
__decorate([
    (0, common_1.Get)("/:guildId/bans"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Guild\'s ban list' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of users', type: [MemberResponse_1.MemberResponse] }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "getBannedUsers", null);
__decorate([
    (0, common_1.Post)("/:guildId/bans"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ban a user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Successfully banned', type: Boolean }),
    (0, swagger_1.ApiBody)({ type: String, description: "MemberId" }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __param(2, (0, common_1.Body)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "banUser", null);
__decorate([
    (0, common_1.Post)("/:guildId/kick"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kick a user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Successfully kicked', type: Boolean }),
    (0, swagger_1.ApiBody)({ type: String, description: "MemberId" }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __param(2, (0, common_1.Body)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "kickUser", null);
__decorate([
    (0, common_1.Delete)("/:guildId/bans"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Unban a user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Successfully unbanned', type: Boolean }),
    (0, swagger_1.ApiBody)({ type: String, description: "MemberId" }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('guildId')),
    __param(2, (0, common_1.Body)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GuildController.prototype, "unbanUser", null);
GuildController = __decorate([
    (0, swagger_1.ApiTags)('Guild Operation'),
    (0, common_1.Controller)('guilds'),
    __metadata("design:paramtypes", [guild_service_1.GuildService])
], GuildController);
exports.GuildController = GuildController;
//# sourceMappingURL=guild.controller.js.map