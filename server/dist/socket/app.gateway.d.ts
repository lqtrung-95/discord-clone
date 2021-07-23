import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private socketService;
    server: Server;
    constructor(socketService: SocketService);
    afterInit(server: Server): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<any>;
    handleToggleOnline(client: Socket): void;
    handleToggleOffline(client: Socket): void;
    handleUserJoin(client: Socket, room: string): void;
    handleChannelJoin(client: Socket, room: string): void;
    handleGuildJoin(client: Socket, room: string): void;
    handleGuildLeave(client: Socket, room: string): void;
    handleRoomLeave(client: Socket, room: string): void;
    handleStartTyping(client: Socket, data: string[]): void;
    handleStopTyping(client: Socket, data: string[]): void;
    handleGetFriendRequestCount(client: Socket): Promise<void>;
}
