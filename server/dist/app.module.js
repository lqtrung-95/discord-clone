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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redisStore = require("cache-manager-redis-store");
const database_1 = require("./config/database");
const user_module_1 = require("./user/user.module");
const guild_module_1 = require("./guild/guild.module");
const channel_module_1 = require("./channel/channel.module");
const message_module_1 = require("./message/message.module");
const socket_module_1 = require("./socket/socket.module");
const typeorm_2 = require("typeorm");
const constants_1 = require("./utils/constants");
let AppModule = class AppModule {
    constructor(connection) {
        this.connection = connection;
    }
    async onModuleInit() {
        if (constants_1.PRODUCTION) {
            await this.connection.runMigrations();
        }
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: database_1.DatabaseConnectionService,
            }),
            common_1.CacheModule.register({
                store: redisStore,
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD,
            }),
            user_module_1.UserModule,
            guild_module_1.GuildModule,
            channel_module_1.ChannelModule,
            message_module_1.MessageModule,
            socket_module_1.SocketModule,
        ],
        controllers: [],
        providers: [],
    }),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map