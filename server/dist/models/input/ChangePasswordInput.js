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
exports.ChangePasswordInput = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChangePasswordInput {
}
__decorate([
    swagger_1.ApiProperty({ type: String }),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "currentPassword", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String, description: 'Min 6, max 150 characters.' }),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "newPassword", void 0);
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'Must be the same as the newPassword value.',
    }),
    __metadata("design:type", String)
], ChangePasswordInput.prototype, "confirmNewPassword", void 0);
exports.ChangePasswordInput = ChangePasswordInput;
//# sourceMappingURL=ChangePasswordInput.js.map