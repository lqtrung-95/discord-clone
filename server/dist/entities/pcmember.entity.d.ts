import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Channel } from './channel.entity';
export declare class PCMember extends AbstractEntity {
    userId: string;
    channelId: string;
    user: User;
    channel: Channel;
}
