"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const session = require("express-session");
const constants_1 = require("../utils/constants");
const redis_1 = require("./redis");
const connectRedis = require("connect-redis");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const RedisStore = connectRedis(session);
exports.sessionMiddleware = session({
    name: constants_1.COOKIE_NAME,
    store: new RedisStore({
        client: redis_1.redis,
        disableTouch: true,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: constants_1.PRODUCTION,
    },
    saveUninitialized: false,
    secret: process.env.SECRET,
    resave: true,
    rolling: true,
});
//# sourceMappingURL=sessionmiddleware.js.map