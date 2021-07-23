import { AbstractEntity } from './abstract.entity';
import { UserResponse } from '../models/response/UserResponse';
import { Member } from './member.entity';
import { Channel } from './channel.entity';
import { MemberResponse } from '../models/response/MemberResponse';
import { PCMember } from './pcmember.entity';
import { BanEntity } from './ban.entity';
export declare class User extends AbstractEntity {
    username: string;
    email: string;
    password: string;
    image: string;
    isOnline: boolean;
    guilds: Member[];
    channels: Channel[];
    pcmembers: PCMember[];
    friends: User[];
    requests: User[];
    bans: BanEntity[];
    toJSON(): UserResponse;
    toMember(userId?: string): MemberResponse;
    toFriend(): MemberResponse;
}
