import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { DMMember } from '../entities/dmmember.entity';
import { Member } from '../entities/member.entity';
import { Message } from '../entities/message.entity';
import { PCMember } from '../entities/pcmember.entity';
import { User } from '../entities/user.entity';
import { MessageInput } from '../models/input/MessageInput';
import { MessageResponse } from '../models/response/MessageResponse';
import { SocketService } from '../socket/socket.service';
import { BufferFile } from '../types/BufferFile';
export declare class MessageService {
    private userRepository;
    private messageRepository;
    private channelRepository;
    private memberRepository;
    private pcMemberRepository;
    private dmMemberRepository;
    private readonly socketService;
    constructor(userRepository: Repository<User>, messageRepository: Repository<Message>, channelRepository: Repository<Channel>, memberRepository: Repository<Member>, pcMemberRepository: Repository<PCMember>, dmMemberRepository: Repository<DMMember>, socketService: SocketService);
    getMessages(channelId: string, userId: string, cursor?: string | null): Promise<MessageResponse[]>;
    createMessage(userId: string, channelId: string, input: MessageInput, file?: BufferFile): Promise<void>;
    editMessage(userId: string, id: string, text: string): Promise<boolean>;
    deleteMessage(userId: string, id: string): Promise<boolean>;
    private isChannelMember;
}
