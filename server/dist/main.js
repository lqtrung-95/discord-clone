"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet = require("helmet");
const dotenv_1 = require("dotenv");
const rateLimit = require("express-rate-limit");
const app_module_1 = require("./app.module");
const constants_1 = require("./utils/constants");
const sessionmiddleware_1 = require("./config/sessionmiddleware");
const redis_adapter_1 = require("./config/redis.adapter");
const redis_1 = require("./config/redis");
const path_1 = require("path");
const RedisStore = require('rate-limit-redis');
dotenv_1.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new redis_adapter_1.RedisIoAdapter(app));
    app.useStaticAssets(path_1.join(__dirname, '..', 'static'), { prefix: '/ws' });
    app.setGlobalPrefix('api');
    app.set('trust proxy', 1);
    app.use(helmet());
    app.enableCors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    });
    app.use(sessionmiddleware_1.sessionMiddleware);
    app.use(rateLimit({
        store: new RedisStore({
            client: redis_1.redis,
        }),
        windowMs: 60 * 1000,
        max: 100,
    }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Discord API')
        .setDescription('Discord REST API Specs. ' +
        'For the Websocket Endpoints and events go <a href="/ws">here</a>. ' +
        'Both services use <a href="https://github.com/expressjs/session">Express Sessions</a> ' +
        'for authentication.')
        .setVersion('1.0.0')
        .addCookieAuth(constants_1.COOKIE_NAME, {
        type: 'http',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('/', app, document);
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
//# sourceMappingURL=main.js.map