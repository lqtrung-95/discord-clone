"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.redis = new ioredis_1.default(process.env.REDIS_URL);
//# sourceMappingURL=redis.js.map