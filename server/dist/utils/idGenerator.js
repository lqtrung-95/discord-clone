"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idGenerator = void 0;
const nanoid_1 = require("nanoid");
const alphabet = '0123456789';
const generator = nanoid_1.customAlphabet(alphabet, 20);
const idGenerator = () => generator();
exports.idGenerator = idGenerator;
//# sourceMappingURL=idGenerator.js.map