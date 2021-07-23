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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const auth_guard_1 = require("../guards/http/auth.guard");
const user_decorator_1 = require("../config/user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const MessageResponse_1 = require("../models/response/MessageResponse");
const yupValidationPipe_1 = require("../utils/yupValidationPipe");
const MessageInput_1 = require("../models/input/MessageInput");
const message_schema_1 = require("../validation/message.schema");
const swagger_1 = require("@nestjs/swagger");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    async messages(channelId, userId, cursor) {
        return this.messageService.getMessages(channelId, userId, cursor);
    }
    async createMessage(userId, channelId, input, file) {
        return this.messageService.createMessage(userId, channelId, input, file);
    }
    async editMessage(user, messageId, input) {
        return this.messageService.editMessage(user, messageId, input.text);
    }
    async deleteMessage(userId, messageId) {
        return this.messageService.deleteMessage(userId, messageId);
    }
};
__decorate([
    common_1.Get("/:channelId"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiOperation({ summary: 'Get Channel Messages' }),
    swagger_1.ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOkResponse({ type: [MessageResponse_1.MessageResponse] }),
    __param(0, common_1.Param('channelId')),
    __param(1, user_decorator_1.GetUser()),
    __param(2, common_1.Query('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "messages", null);
__decorate([
    common_1.Post("/:channelId"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOperation({ summary: 'Send Message' }),
    swagger_1.ApiOkResponse({ description: 'Message Success', type: Boolean }),
    swagger_1.ApiUnauthorizedResponse(),
    swagger_1.ApiBody({ type: MessageInput_1.MessageInput }),
    swagger_1.ApiConsumes('multipart/form-data'),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('channelId')),
    __param(2, common_1.Body(new yupValidationPipe_1.YupValidationPipe(message_schema_1.MessageSchema))),
    __param(3, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, MessageInput_1.MessageInput, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    common_1.Put("/:messageId"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOperation({ summary: 'Edit Message' }),
    swagger_1.ApiOkResponse({ description: 'Edit Success', type: Boolean }),
    swagger_1.ApiUnauthorizedResponse(),
    swagger_1.ApiBody({ type: MessageInput_1.MessageInput }),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('messageId')),
    __param(2, common_1.Body(new yupValidationPipe_1.YupValidationPipe(message_schema_1.MessageSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, MessageInput_1.MessageInput]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "editMessage", null);
__decorate([
    common_1.Delete("/:messageId"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    swagger_1.ApiCookieAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Message' }),
    swagger_1.ApiOkResponse({ description: 'Delete Success', type: Boolean }),
    swagger_1.ApiUnauthorizedResponse(),
    __param(0, user_decorator_1.GetUser()),
    __param(1, common_1.Param('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
MessageController = __decorate([
    swagger_1.ApiTags('Message Operation'),
    common_1.Controller('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map