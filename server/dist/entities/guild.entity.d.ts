import { AbstractEntity } from './abstract.entity';
import { Member } from './member.entity';
import { GuildResponse } from '../models/response/GuildResponse';
import { BanEntity } from './ban.entity';
export declare class Guild extends AbstractEntity {
    name: string;
    ownerId: string;
    members: Member[];
    bans: BanEntity[];
    icon?: string;
    inviteLinks: string[];
    toJson(): GuildResponse;
}
