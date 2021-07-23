import { Server, Socket } from 'socket.io';
import { MessageResponse } from '../models/response/MessageResponse';
import { MemberResponse } from '../models/response/MemberResponse';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ChannelResponse } from '../models/response/ChannelResponse';
import { Channel } from '../entities/channel.entity';
import { Member } from '../entities/member.entity';
import { PCMember } from '../entities/pcmember.entity';
import { DMMember } from '../entities/dmmember.entity';
import { Guild } from '../entities/guild.entity';
export declare class SocketService {
    private userRepository;
    private channelRepository;
    private memberRepository;
    private pcMemberRepository;
    private dmMemberRepository;
    socket: Server;
    constructor(userRepository: Repository<User>, channelRepository: Repository<Channel>, memberRepository: Repository<Member>, pcMemberRepository: Repository<PCMember>, dmMemberRepository: Repository<DMMember>);
    joinChannel(client: Socket, room: string): Promise<void>;
    sendMessage(message: {
        room: string;
        message: MessageResponse;
    }): void;
    editMessage(message: {
        room: string;
        message: MessageResponse;
    }): void;
    deleteMessage(message: {
        room: string;
        message: MessageResponse;
    }): void;
    addChannel(message: {
        room: string;
        channel: ChannelResponse;
    }): void;
    editChannel(message: {
        room: string;
        channel: ChannelResponse;
    }): void;
    deleteChannel(message: {
        room: string;
        channelId: string;
    }): void;
    editGuild(guild: Guild): Promise<void>;
    deleteGuild(memberIds: string[], guildId: string): void;
    removeFromGuild(memberId: string, guildId: string): void;
    addMember(message: {
        room: string;
        member: MemberResponse;
    }): void;
    removeMember(message: {
        room: string;
        memberId: string;
    }): void;
    pushDMToTop(message: {
        room: string;
        channelId: string;
    }): Promise<void>;
    newNotification(guildId: string, channelId: string): Promise<void>;
    toggleOnlineStatus(client: Socket): Promise<void>;
    toggleOfflineStatus(client: Socket): Promise<void>;
    updateLastSeen(client: Socket, room: string): Promise<void>;
    setOnlineStatus(userId: string, isOnline: boolean): Promise<void>;
    addTyping(room: string, username: string): void;
    stopTyping(room: string, username: string): void;
    sendRequest(room: string): void;
    addFriend(room: string, member: MemberResponse): void;
    removeFriend(room: string, memberId: string): void;
    private isChannelMember;
    getPendingFriendRequestCount(userId: string): Promise<void>;
    private getGuildMemberIds;
}
