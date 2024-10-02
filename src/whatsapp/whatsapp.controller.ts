import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Render,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) {}

    @Get()
    @Render('qr') // Nombre de la vista (qr.hbs)
    async getQrCode() {
        const qrCode = this.whatsappService.getQrCode();
        const logs = await this.whatsappService.getLogs();

        return { qrCode, logs }; // Pasar el código QR a la vista
    }

    @Get('send-message')
    async sendMessage(
        @Query('secret') secret: string,
        @Query('message') message: string,
    ) {
        // Validar que se reciban ambos parámetros
        if (!secret || !message) {
            throw new BadRequestException(
                'Se requieren los parámetros secret y message',
            );
        }

        return await this.whatsappService.sendMessageToContacts(
            secret,
            message,
        );
    }
}
