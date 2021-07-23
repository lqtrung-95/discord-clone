import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Guild } from './guild.entity';
export declare class BanEntity extends AbstractEntity {
    userId: string;
    guildId: string;
    user: User;
    guild: Guild;
}
