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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const abstract_entity_1 = require("./abstract.entity");
const guild_entity_1 = require("./guild.entity");
const pcmember_entity_1 = require("./pcmember.entity");
let Channel = class Channel extends abstract_entity_1.AbstractEntity {
};
__decorate([
    typeorm_1.Column('varchar'),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('boolean', { default: true }),
    __metadata("design:type", Boolean)
], Channel.prototype, "isPublic", void 0);
__decorate([
    typeorm_1.Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Channel.prototype, "dm", void 0);
__decorate([
    typeorm_1.ManyToOne(() => guild_entity_1.Guild, (guild) => guild.id, {
        nullable: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", guild_entity_1.Guild)
], Channel.prototype, "guild", void 0);
__decorate([
    typeorm_1.ManyToMany(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    typeorm_1.JoinTable({
        name: 'channel_member',
        joinColumn: {
            name: 'channels',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'users',
            referencedColumnName: 'id'
        }
    }),
    __metadata("design:type", Array)
], Channel.prototype, "members", void 0);
__decorate([
    typeorm_1.OneToMany(() => pcmember_entity_1.PCMember, (pcmember) => pcmember.channel),
    __metadata("design:type", Array)
], Channel.prototype, "pcmembers", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Channel.prototype, "lastActivity", void 0);
Channel = __decorate([
    typeorm_1.Entity('channels')
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=channel.entity.js.map