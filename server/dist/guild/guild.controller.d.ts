import { GuildService } from './guild.service';
import { MemberResponse } from '../models/response/MemberResponse';
import { GuildInput } from '../models/input/GuildInput';
import { GuildResponse } from '../models/response/GuildResponse';
import { GuildMemberInput } from "../models/input/GuildMemberInput";
import { BufferFile } from '../types/BufferFile';
export declare class GuildController {
    private readonly guildService;
    constructor(guildService: GuildService);
    getGuildMembers(guildId: string, userId: string): Promise<MemberResponse[]>;
    getGuilds(userId: string): Promise<GuildResponse[]>;
    createGuild(input: GuildInput, user: string): Promise<GuildResponse>;
    generateTeamInvite(id: string, isPermanent?: boolean): Promise<string>;
    deleteAllInvites(id: string, userId: string): Promise<boolean>;
    joinGuild(link: string, user: string): Promise<GuildResponse>;
    getMemberSettings(user: string, guildId: string): Promise<GuildMemberInput>;
    editMember(user: string, guildId: string, input: GuildMemberInput): Promise<boolean>;
    leaveGuild(userId: string, guildId: string): Promise<boolean>;
    editGuild(user: string, guildId: string, input: GuildInput, image?: BufferFile): Promise<boolean>;
    deleteGuild(userId: string, guildId: string): Promise<boolean>;
    getBannedUsers(userId: string, guildId: string): Promise<MemberResponse[]>;
    banUser(userId: string, guildId: string, memberId: string): Promise<boolean>;
    kickUser(userId: string, guildId: string, memberId: string): Promise<boolean>;
    unbanUser(userId: string, guildId: string, memberId: string): Promise<boolean>;
}
