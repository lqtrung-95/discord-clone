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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("./abstract.entity");
const class_transformer_1 = require("class-transformer");
const member_entity_1 = require("./member.entity");
const channel_entity_1 = require("./channel.entity");
const pcmember_entity_1 = require("./pcmember.entity");
const ban_entity_1 = require("./ban.entity");
let User = User_1 = class User extends abstract_entity_1.AbstractEntity {
    toJSON() {
        return class_transformer_1.classToPlain(this, { groups: ['user'] });
    }
    toMember(userId = null) {
        var _a;
        const response = class_transformer_1.classToPlain(this);
        response.isFriend = (userId && ((_a = this.friends) === null || _a === void 0 ? void 0 : _a.findIndex(f => f.id === userId)) !== -1);
        return response;
    }
    toFriend() {
        const response = class_transformer_1.classToPlain(this);
        response.isFriend = true;
        return response;
    }
};
__decorate([
    typeorm_1.Column('varchar'),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column('varchar', { unique: true }),
    class_transformer_1.Expose({ groups: ['user'] }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('text'),
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isOnline", void 0);
__decorate([
    typeorm_1.OneToMany(() => member_entity_1.Member, (member) => member.user),
    __metadata("design:type", Array)
], User.prototype, "guilds", void 0);
__decorate([
    typeorm_1.ManyToMany(() => channel_entity_1.Channel),
    typeorm_1.JoinColumn({ name: 'channel_member' }),
    __metadata("design:type", Array)
], User.prototype, "channels", void 0);
__decorate([
    typeorm_1.OneToMany(() => pcmember_entity_1.PCMember, (pcmember) => pcmember.user),
    __metadata("design:type", Array)
], User.prototype, "pcmembers", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1, { cascade: true }),
    typeorm_1.JoinTable({
        name: 'friends',
        joinColumn: { name: 'user' },
        inverseJoinColumn: { name: 'friend' }
    }),
    class_transformer_1.Exclude(),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1, { cascade: true }),
    typeorm_1.JoinTable({
        name: 'friends_request',
        joinColumn: { name: 'senderId' },
        inverseJoinColumn: { name: 'receiverId' }
    }),
    class_transformer_1.Exclude(),
    __metadata("design:type", Array)
], User.prototype, "requests", void 0);
__decorate([
    typeorm_1.OneToMany(() => ban_entity_1.BanEntity, (bans) => bans.user),
    __metadata("design:type", Array)
], User.prototype, "bans", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity('users')
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map