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
exports.DMMember = void 0;
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("./abstract.entity");
const user_entity_1 = require("./user.entity");
const channel_entity_1 = require("./channel.entity");
let DMMember = class DMMember extends abstract_entity_1.AbstractEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], DMMember.prototype, "userId", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], DMMember.prototype, "channelId", void 0);
__decorate([
    typeorm_1.ManyToMany(() => user_entity_1.User, (user) => user.channels, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], DMMember.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToMany(() => channel_entity_1.Channel, (channel) => channel.members, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'channelId' }),
    __metadata("design:type", channel_entity_1.Channel)
], DMMember.prototype, "channel", void 0);
__decorate([
    typeorm_1.Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], DMMember.prototype, "isOpen", void 0);
DMMember = __decorate([
    typeorm_1.Entity('dm_members')
], DMMember);
exports.DMMember = DMMember;
//# sourceMappingURL=dmmember.entity.js.map