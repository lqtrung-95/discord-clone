import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';
import { Guild } from './guild.entity';
export declare class Member extends AbstractEntity {
    userId: string;
    guildId: string;
    user: User;
    guild: Guild;
    nickname?: string;
    color?: string;
    lastSeen?: string;
}
