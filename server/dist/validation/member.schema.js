"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberSchema = void 0;
const yup = require("yup");
exports.MemberSchema = yup.object().shape({
    nickname: yup
        .string()
        .nullable()
        .min(3)
        .max(30),
    color: yup
        .string()
        .nullable()
        .matches(/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i, "The color must be a valid hex color")
});
//# sourceMappingURL=member.schema.js.map