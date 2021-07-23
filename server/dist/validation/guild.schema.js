"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGuildSchema = exports.GuildSchema = void 0;
const yup = require("yup");
exports.GuildSchema = yup.object().shape({
    name: yup.string().min(3).max(30).required(),
});
exports.UpdateGuildSchema = yup.object().shape({
    name: yup.string().nullable().min(3).max(30),
});
//# sourceMappingURL=guild.schema.js.map