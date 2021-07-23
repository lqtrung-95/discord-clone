import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';
export declare class AppModule implements OnModuleInit {
    private readonly connection;
    constructor(connection: Connection);
    onModuleInit(): Promise<void>;
}
