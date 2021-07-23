import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';
import { Guild } from './guild.entity';
import { PCMember } from './pcmember.entity';
export declare class Channel extends AbstractEntity {
    name: string;
    isPublic: boolean;
    dm: boolean;
    guild: Guild;
    members: User[];
    pcmembers: PCMember[];
    lastActivity?: string;
}
