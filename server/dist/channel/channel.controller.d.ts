import { ChannelService } from './channel.service';
import { DMChannelResponse } from '../models/response/DMChannelResponse';
import { ChannelResponse } from '../models/response/ChannelResponse';
import { ChannelInput } from '../models/input/ChannelInput';
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    getGuildChannels(guildId: string, userId: string): Promise<ChannelResponse[]>;
    getPrivateChannelMembers(channelId: string, userId: string): Promise<string[]>;
    createChannel(userId: string, guildId: string, input: ChannelInput): Promise<boolean>;
    getDirectMessageChannels(userId: string): Promise<DMChannelResponse[]>;
    getOrCreateChannel(userId: string, memberId: string): Promise<DMChannelResponse>;
    editChannel(user: string, channelId: string, input: ChannelInput): Promise<boolean>;
    closeDirectMessage(userId: string, channelId: string): Promise<boolean>;
    deleteChannel(userId: string, channelId: string): Promise<boolean>;
}
