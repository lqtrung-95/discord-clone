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
exports.RegisterInput = void 0;
const swagger_1 = require("@nestjs/swagger");
class RegisterInput {
}
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'Min 3, max 30 characters.',
    }),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'Unique. Must be a valid email.'
    }),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String, description: 'Min 6, max 150 characters.' }),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
exports.RegisterInput = RegisterInput;
//# sourceMappingURL=RegisterInput.js.map