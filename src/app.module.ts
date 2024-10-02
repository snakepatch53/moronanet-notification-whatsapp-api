import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database:
                process.env.DB_NAME || 'moronanet_notification_whatsapp_api',
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
