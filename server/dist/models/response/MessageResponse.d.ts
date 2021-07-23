import { MemberResponse } from './MemberResponse';
export declare class MessageResponse {
    id: string;
    text?: string | null;
    url?: string | null;
    filetype?: string | null;
    user: MemberResponse;
    createdAt: string;
    updatedAt: string;
}
