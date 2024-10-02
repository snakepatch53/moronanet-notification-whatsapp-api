import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'moronanet_notification_whatsapp_api',
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
