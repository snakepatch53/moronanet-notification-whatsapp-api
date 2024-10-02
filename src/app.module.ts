import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: true, // Solo para desarrollo
        }),
        // configurar websocket

        WhatsappModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
