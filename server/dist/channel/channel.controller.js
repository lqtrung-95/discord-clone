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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const channel_service_1 = require("./channel.service");
const auth_guard_1 = require("../guards/http/auth.guard");
const user_decorator_1 = require("../config/user.decorator");
const DMChannelResponse_1 = require("../models/response/DMChannelResponse");
const ChannelResponse_1 = require("../models/response/ChannelResponse");
const member_guard_1 = require("../guards/http/member.guard");
const ChannelInput_1 = require("../models/input/ChannelInput");
const yupValidationPipe_1 = require("../utils/yupValidationPipe");
const channel_schema_1 = require("../validation/channel.schema");
let ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    async getGuildChannels(guildId, userId) {
        return this.channelService.getGuildChannels(guildId, userId);
    }
    async getPrivateChannelMembers(channelId, userId) {
        return this.channelService.getPrivateChannelMembers(userId, channelId);
    }
    async createChannel(userId, guildId, input) {
        return this.channelService.createChannel(guildId, userId, input);
    }
    async getDirectMessageChannels(userId) {
        return this.channelService.getDirectMessageChannels(userId);
    }
    async getOrCreateChannel(userId, memberId) {
        return this.channelService.getOrCreateChannel(userId, memberId);
    }
    async editChannel(user, channelId, input) {
        return this.channelService.editChannel(user, channelId, input);
    }
    async closeDirectMessage(userId, channelId) {
        return this.channelService.setDirectMessageStatus(channelId, userId, false);
    }
    async deleteChannel(userId, channelId) {
        return this.channelService.deleteChannel(userId, channelId);
    }
};
__decorate([
    common_1.Get('/:guildId'),
    common_1.UseGuards(member_guard_1.MemberGuard),
    swagger_1.ApiOperation({ summary: 'Get Guild Channels' }),
    swagger_1.ApiBody({ description: 'guildId', type: String }),
    swagger_1.ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOkResponse({ type: [ChannelResponse_1.ChannelResponse] }),
    __param(0, common_1.Param('guildId')),
    __param(1, user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getGuildChannels", null);
__decorate([
    common_1.Get('/:channelId/members'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiOperation({ summary: 'Get Private Guild Members' }),
    swagger_1.ApiBody({ description: 'channelId', type: String }),
    swagger_1.ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOkResponse({ description: 'Member Ids', type: [String] }),
    __param(0, common_1.Param('channelId')),
    __param(1, user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getPrivateChannelMembers", null);
__decorate([
    common_1.Post('/:guildId'),
    common_1.UseGuards(member_guard_1.MemberGuard),
    swagger_1.ApiOperation({ summary: 'Create Guild Channels' }),
    swagger_1.ApiBody({ type: ChannelInput_1.ChannelInput }),
    swagger_1.ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiCreatedResponse({ type: Boolean }),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('guildId')),
    __param(2, common_1.Body(new yupValidationPipe_1.YupValidationPipe(channel_schema_1.ChannelSchema), new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ChannelInput_1.ChannelInput]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
__decorate([
    common_1.Get('/me/dm'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiOperation({ summary: 'Get User\'s DMs' }),
    swagger_1.ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOkResponse({ type: [DMChannelResponse_1.DMChannelResponse] }),
    __param(0, user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getDirectMessageChannels", null);
__decorate([
    common_1.Post(':memberId/dm'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiOperation({ summary: 'Start or get DMs with the given user' }),
    swagger_1.ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOkResponse({ type: DMChannelResponse_1.DMChannelResponse }),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getOrCreateChannel", null);
__decorate([
    common_1.Put("/:guildId/:channelId"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOperation({ summary: 'Edit Channel' }),
    swagger_1.ApiOkResponse({ description: 'Edit Success', type: Boolean }),
    swagger_1.ApiUnauthorizedResponse(),
    swagger_1.ApiBody({ type: ChannelInput_1.ChannelInput }),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('channelId')),
    __param(2, common_1.Body(new yupValidationPipe_1.YupValidationPipe(channel_schema_1.ChannelSchema), new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ChannelInput_1.ChannelInput]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "editChannel", null);
__decorate([
    common_1.Delete('/:channelId/dm'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOperation({ summary: 'Close the DM' }),
    swagger_1.ApiOkResponse({ description: 'Close Success', type: Boolean }),
    swagger_1.ApiUnauthorizedResponse(),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "closeDirectMessage", null);
__decorate([
    common_1.Delete("/:guildId/:channelId"),
    common_1.UseGuards(member_guard_1.MemberGuard),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Channel' }),
    swagger_1.ApiOkResponse({ description: 'Delete Success', type: Boolean }),
    swagger_1.ApiUnauthorizedResponse(),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannel", null);
ChannelController = __decorate([
    swagger_1.ApiTags('Channel Operation'),
    common_1.Controller('channels'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
exports.ChannelController = ChannelController;
//# sourceMappingURL=channel.controller.js.map