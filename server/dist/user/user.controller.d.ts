import { UserService } from './user.service';
import { LoginInput } from '../models/input/LoginInput';
import e from 'express';
import { RegisterInput } from '../models/input/RegisterInput';
import { ChangePasswordInput } from '../models/input/ChangePasswordInput';
import { ForgotPasswordInput, ResetPasswordInput } from '../models/input/ResetPasswordInput';
import { UpdateInput } from '../models/input/UpdateInput';
import { BufferFile } from '../types/BufferFile';
import { UserResponse } from '../models/response/UserResponse';
import { MemberResponse } from '../models/response/MemberResponse';
import { RequestResponse } from '../models/response/RequestResponse';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    register(credentials: RegisterInput, req: e.Request): Promise<UserResponse>;
    login(credentials: LoginInput, req: e.Request): Promise<UserResponse>;
    logout(req: e.Request, res: e.Response): Promise<any>;
    changePassword(input: ChangePasswordInput, id: string): Promise<boolean>;
    forgotPassword({ email }: ForgotPasswordInput): Promise<boolean>;
    resetPassword(input: ResetPasswordInput, req: e.Request): Promise<UserResponse>;
    findCurrentUser(id: string): Promise<UserResponse>;
    update(id: string, data: UpdateInput, image?: BufferFile): Promise<UserResponse>;
    getFriends(id: string): Promise<MemberResponse[]>;
    getFriendRequests(id: string): Promise<RequestResponse[]>;
    sendFriendRequest(memberId: string, userId: string): Promise<boolean>;
    addFriend(memberId: string, userId: string): Promise<boolean>;
    cancelFriendRequest(memberId: string, userId: string): Promise<boolean>;
    removeFriend(memberId: string, userId: string): Promise<boolean>;
}
