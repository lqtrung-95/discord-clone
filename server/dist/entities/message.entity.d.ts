import { Channel } from './channel.entity';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';
import { MessageResponse } from '../models/response/MessageResponse';
export declare class Message extends AbstractEntity {
    text: string;
    url: string;
    filetype: string;
    channel: Channel;
    user: User;
    toJSON(userId: string): MessageResponse;
}
