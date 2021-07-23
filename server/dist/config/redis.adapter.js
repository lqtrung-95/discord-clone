"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redisIoAdapter = require("socket.io-redis");
const dotenv_1 = require("dotenv");
const redis_1 = require("./redis");
dotenv_1.config();
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        const pubClient = redis_1.redis;
        const subClient = redis_1.redis.duplicate();
        const redisAdapter = redisIoAdapter({
            pubClient,
            subClient,
        });
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis.adapter.js.map