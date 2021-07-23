"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const yup = require("yup");
exports.MessageSchema = yup.object().shape({
    text: yup
        .string()
        .optional()
        .test('empty', 'Message must not be empty', (text) => (text === null || text === void 0 ? void 0 : text.length) !== 0)
        .max(2000)
});
//# sourceMappingURL=message.schema.js.map