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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_service_1 = require("./socket.service");
const sharedsession = require("express-socket.io-session");
const sessionmiddleware_1 = require("../config/sessionmiddleware");
const ws_guild_guard_1 = require("../guards/ws/ws.guild.guard");
const ws_auth_guard_1 = require("../guards/ws/ws.auth.guard");
let AppGateway = class AppGateway {
    constructor(socketService) {
        this.socketService = socketService;
    }
    afterInit(server) {
        server.use(sharedsession(sessionmiddleware_1.sessionMiddleware, { autoSave: true }));
        this.socketService.socket = server;
    }
    async handleConnection(socket) {
    }
    async handleDisconnect(client) {
    }
    handleToggleOnline(client) {
        this.socketService.toggleOnlineStatus(client);
    }
    handleToggleOffline(client) {
        this.socketService.toggleOfflineStatus(client);
    }
    handleUserJoin(client, room) {
        client.join(room);
    }
    handleChannelJoin(client, room) {
        this.socketService.joinChannel(client, room);
    }
    handleGuildJoin(client, room) {
        client.join(room);
    }
    handleGuildLeave(client, room) {
        client.leave(room);
        this.socketService.updateLastSeen(client, room);
    }
    handleRoomLeave(client, room) {
        client.leave(room);
    }
    handleStartTyping(client, data) {
        const room = data[0];
        const username = data[1];
        this.socketService.addTyping(room, username);
    }
    handleStopTyping(client, data) {
        const room = data[0];
        const username = data[1];
        this.socketService.stopTyping(room, username);
    }
    async handleGetFriendRequestCount(client) {
        const id = client.handshake.session['userId'];
        await this.socketService.getPendingFriendRequestCount(id);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], AppGateway.prototype, "server", void 0);
__decorate([
    common_1.UseGuards(ws_auth_guard_1.WsAuthGuard),
    websockets_1.SubscribeMessage('toggleOnline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleToggleOnline", null);
__decorate([
    common_1.UseGuards(ws_auth_guard_1.WsAuthGuard),
    websockets_1.SubscribeMessage('toggleOffline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleToggleOffline", null);
__decorate([
    common_1.UseGuards(ws_auth_guard_1.WsAuthGuard),
    websockets_1.SubscribeMessage('joinUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleUserJoin", null);
__decorate([
    common_1.UseGuards(ws_auth_guard_1.WsAuthGuard),
    websockets_1.SubscribeMessage('joinChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleChannelJoin", null);
__decorate([
    common_1.UseGuards(ws_guild_guard_1.WsMemberGuard),
    websockets_1.SubscribeMessage('joinGuild'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleGuildJoin", null);
__decorate([
    websockets_1.SubscribeMessage('leaveGuild'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleGuildLeave", null);
__decorate([
    websockets_1.SubscribeMessage('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleRoomLeave", null);
__decorate([
    websockets_1.SubscribeMessage('startTyping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleStartTyping", null);
__decorate([
    websockets_1.SubscribeMessage('stopTyping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleStopTyping", null);
__decorate([
    common_1.UseGuards(ws_auth_guard_1.WsAuthGuard),
    websockets_1.SubscribeMessage('getRequestCount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleGetFriendRequestCount", null);
AppGateway = __decorate([
    websockets_1.WebSocketGateway({ namespace: '/ws', transports: ['websocket'], upgrade: false }),
    __metadata("design:paramtypes", [socket_service_1.SocketService])
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=app.gateway.js.map