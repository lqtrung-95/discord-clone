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
exports.UpdateInput = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateInput {
}
__decorate([
    swagger_1.ApiProperty({ type: String, description: 'Unique. Must be a valid email.' }),
    __metadata("design:type", String)
], UpdateInput.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        type: String,
        description: 'Min 3, max 30 characters.',
    }),
    __metadata("design:type", String)
], UpdateInput.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String, required: false }),
    __metadata("design:type", String)
], UpdateInput.prototype, "image", void 0);
exports.UpdateInput = UpdateInput;
//# sourceMappingURL=UpdateInput.js.map