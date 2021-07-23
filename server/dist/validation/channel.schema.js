"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelSchema = void 0;
const yup = require("yup");
exports.ChannelSchema = yup.object().shape({
    name: yup.string().min(3).max(30).required(),
    isPublic: yup.boolean().optional().default(true),
    members: yup
        .array(yup.string().optional().max(20, 'Must provide memberId'))
        .optional()
});
//# sourceMappingURL=channel.schema.js.map