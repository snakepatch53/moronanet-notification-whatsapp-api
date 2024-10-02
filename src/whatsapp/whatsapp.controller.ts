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
        @Query('token') token: string,
        @Query('message') message: string,
    ) {
        // Validar que se reciban ambos parámetros
        if (!token || !message) {
            throw new BadRequestException(
                'Both token and message are required',
            );
        }

        return await this.whatsappService.sendMessageToContacts(token, message);
    }
}
