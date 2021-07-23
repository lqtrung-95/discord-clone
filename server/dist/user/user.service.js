"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const argon2 = require("argon2");
const md5 = require("md5");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const redis_1 = require("../config/redis");
const user_entity_1 = require("../entities/user.entity");
const socket_service_1 = require("../socket/socket.service");
const constants_1 = require("../utils/constants");
const fileUtils_1 = require("../utils/fileUtils");
const sendEmail_1 = require("../utils/sendEmail");
let UserService = class UserService {
    constructor(userRepository, socketService) {
        this.userRepository = userRepository;
        this.socketService = socketService;
    }
    async register(credentials, req) {
        const { email, username, password } = credentials;
        const emailTaken = await this.userRepository.findOne({
            where: { email },
        });
        if (emailTaken) {
            throw new common_1.HttpException({
                errors: [
                    {
                        field: 'email',
                        message: 'Email must be unique.',
                    },
                ],
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = this.userRepository.create({
            email: email.trim(),
            username: username.trim(),
            password: await argon2.hash(password),
        });
        user.image = `https://gravatar.com/avatar/${md5(email)}?d=identicon`;
        await user.save();
        req.session['userId'] = user.id;
        return user.toJSON();
    }
    async login(credentials, req) {
        const { email, password } = credentials;
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            throw new common_1.UnauthorizedException();
        }
        req.session['userId'] = user.id;
        return user.toJSON();
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            return true;
        }
        const token = uuid_1.v4();
        await redis_1.redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3);
        await sendEmail_1.sendEmail(email, `<a href='${process.env.CORS_ORIGIN}/reset-password/${token}'>Reset Password</a>`);
        return true;
    }
    async resetPassword(input, req) {
        const { newPassword, token } = input;
        const key = constants_1.FORGET_PASSWORD_PREFIX + token;
        const userId = await redis_1.redis.get(key);
        if (!userId) {
            throw new common_1.HttpException({
                errors: [
                    {
                        field: 'token',
                        message: 'Token expired',
                    },
                ],
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException();
        user.password = await argon2.hash(newPassword);
        await user.save();
        await redis_1.redis.del(key);
        req.session['userId'] = user.id;
        return user.toJSON();
    }
    async changePassword(input, userId) {
        const { newPassword, currentPassword } = input;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const valid = await argon2.verify(user.password, currentPassword);
        if (!valid) {
            throw new common_1.UnauthorizedException();
        }
        user.password = await argon2.hash(newPassword);
        await user.save();
        return true;
    }
    async findCurrentUser(id) {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException({
                message: 'An account with that username or email does not exist.',
            });
        }
        return user.toJSON();
    }
    async updateUser(id, data, image) {
        const { email } = data;
        const user = await this.userRepository.findOneOrFail(id);
        if (user.email !== email) {
            const checkUsername = await this.userRepository.findOne({ email });
            if (checkUsername) {
                throw new common_1.HttpException({
                    errors: [
                        {
                            field: 'email',
                            message: 'Email must be unique.',
                        },
                    ],
                }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (image) {
            const uImage = await fileUtils_1.uploadFromBuffer(image);
            data.image = uImage.secure_url;
        }
        if (!data.image || data.image === '')
            data.image = user.image;
        await this.userRepository.update({ id: user.id }, data);
        return this.findCurrentUser(user.id);
    }
    async getFriends(userId) {
        const user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['friends'],
        });
        const friends = [];
        user.friends.map((f) => friends.push(f.toFriend()));
        return friends.sort((a, b) => a.username.localeCompare(b.username));
    }
    async getPendingFriendRequests(userId) {
        const manager = typeorm_2.getManager();
        return await manager.query(`
          select u.id, u.username, u.image, 1 as "type" from users u
          join friends_request fr on u.id = fr."senderId"
          where fr."receiverId" = $1
          UNION
          select u.id, u.username, u.image, 0 as "type" from users u
          join friends_request fr on u.id = fr."receiverId"
          where fr."senderId" = $1
          order by username
      `, [userId]);
    }
    async sendFriendRequest(userId, memberId) {
        if (userId === memberId) {
            throw new common_1.BadRequestException('You cannot add yourself');
        }
        const user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['requests', 'friends'],
        });
        const member = await this.userRepository.findOneOrFail({
            where: { id: memberId },
            relations: ['requests'],
        });
        if (!user.friends.includes(member) && !user.requests.includes(member)) {
            user.requests.push(member);
            await user.save();
            this.socketService.sendRequest(memberId);
        }
        return true;
    }
    async acceptFriendRequest(userId, memberId) {
        const user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['friends'],
        });
        const member = await this.userRepository.findOneOrFail({
            where: { id: memberId },
            relations: ['friends', 'requests'],
        });
        let hasRequest = false;
        member.requests.map((r) => {
            if (r.id === userId) {
                hasRequest = true;
            }
        });
        if (hasRequest) {
            user.friends.push(member);
            member.requests = member.requests.filter((r) => r === user);
            member.friends.push(user);
            await user.save();
            await member.save();
            this.socketService.addFriend(memberId, user.toFriend());
        }
        return true;
    }
    async cancelFriendRequest(userId, memberId) {
        const user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['requests'],
        });
        const member = await this.userRepository.findOneOrFail({
            where: { id: memberId },
            relations: ['requests'],
        });
        user.requests = user.requests.filter((r) => r === member);
        member.requests = member.requests.filter((r) => r === user);
        await user.save();
        await member.save();
        return true;
    }
    async removeFriend(userId, memberId) {
        const user = await this.userRepository.findOneOrFail({
            where: { id: userId },
            relations: ['friends'],
        });
        const member = await this.userRepository.findOneOrFail({
            where: { id: memberId },
            relations: ['friends'],
        });
        user.friends = user.friends.filter((m) => m === member);
        member.friends = member.friends.filter((m) => m === user);
        await user.save();
        await member.save();
        this.socketService.removeFriend(memberId, userId);
        return true;
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        socket_service_1.SocketService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map