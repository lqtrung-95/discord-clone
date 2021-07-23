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
exports.ForgotPasswordInput = exports.ResetPasswordInput = void 0;
const swagger_1 = require("@nestjs/swagger");
class ResetPasswordInput {
}
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'The from the email provided token.',
    }),
    __metadata("design:type", String)
], ResetPasswordInput.prototype, "token", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String, description: 'Min 6, max 150 characters.' }),
    __metadata("design:type", String)
], ResetPasswordInput.prototype, "newPassword", void 0);
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'Must be the same as the newPassword value.',
    }),
    __metadata("design:type", String)
], ResetPasswordInput.prototype, "confirmNewPassword", void 0);
exports.ResetPasswordInput = ResetPasswordInput;
class ForgotPasswordInput {
}
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'User Email.',
    }),
    __metadata("design:type", String)
], ForgotPasswordInput.prototype, "email", void 0);
exports.ForgotPasswordInput = ForgotPasswordInput;
//# sourceMappingURL=ResetPasswordInput.js.map