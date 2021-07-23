import { User } from '../../entities/user.entity';
export declare class RegisterInput implements Partial<User> {
    username: string;
    email: string;
    password: string;
}
