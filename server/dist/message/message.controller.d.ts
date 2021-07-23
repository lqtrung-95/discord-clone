import { MessageService } from './message.service';
import { BufferFile } from '../types/BufferFile';
import { MessageResponse } from '../models/response/MessageResponse';
import { MessageInput } from '../models/input/MessageInput';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    messages(channelId: string, userId: string, cursor?: string | null): Promise<MessageResponse[]>;
    createMessage(userId: string, channelId: string, input: MessageInput, file?: BufferFile): Promise<void>;
    editMessage(user: string, messageId: string, input: MessageInput): Promise<boolean>;
    deleteMessage(userId: string, messageId: string): Promise<boolean>;
}
