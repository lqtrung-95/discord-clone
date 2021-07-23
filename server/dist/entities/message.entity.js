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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const channel_entity_1 = require("./channel.entity");
const user_entity_1 = require("./user.entity");
const abstract_entity_1 = require("./abstract.entity");
const class_transformer_1 = require("class-transformer");
let Message = class Message extends abstract_entity_1.AbstractEntity {
    toJSON(userId) {
        const response = class_transformer_1.classToPlain(this);
        response.user = this.user.toMember(userId);
        return response;
    }
};
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "url", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 50, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "filetype", void 0);
__decorate([
    typeorm_1.ManyToOne(() => channel_entity_1.Channel, { onDelete: 'CASCADE' }),
    class_transformer_1.Exclude(),
    __metadata("design:type", channel_entity_1.Channel)
], Message.prototype, "channel", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_entity_1.User, (user) => user.id),
    class_transformer_1.Exclude(),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "user", void 0);
Message = __decorate([
    typeorm_1.Entity('messages')
], Message);
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map