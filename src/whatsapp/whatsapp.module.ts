import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoEntity } from './entities/contactos.entity';
import { QrGateway } from './qr.gateway';
import { LogEntity } from './entities/log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ContactoEntity, LogEntity])],
    controllers: [WhatsappController],
    providers: [WhatsappService, QrGateway],
})
export class WhatsappModule {}
