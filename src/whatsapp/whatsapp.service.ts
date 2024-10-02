import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactoEntity } from './entities/contactos.entity';
import { Repository } from 'typeorm';
import { QrGateway } from './qr.gateway';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class WhatsappService {
    private client: Client;
    private qrCode: string;
    private readonly logger = new Logger(WhatsappService.name);

    constructor(
        @InjectRepository(ContactoEntity)
        private contactRepository: Repository<ContactoEntity>,
        @InjectRepository(LogEntity)
        private logRepository: Repository<LogEntity>,
        private readonly qrGateway: QrGateway,
    ) {
        this.initialize();
    }

    async initialize() {
        // const sessionData = await this.loadSessionFromDb();
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: false, // Puedes ponerlo en true si no necesitas ver el navegador
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        });

        this.client.on('qr', async (qr) => {
            this.qrCode = await qrcode.toDataURL(qr);
            this.qrGateway.sendQrCode(this.qrCode);
            this.qrGateway.sendLog('Whatsapp', 'Nuevo QR generado');
            console.log('QR Regenerado');
        });

        this.client.on('ready', () => {
            this.qrCode = null;
            this.qrGateway.sendQrCode(null);
            this.qrGateway.sendLog('Whatsapp', 'Cliente listo');
            console.log('Client is ready!');
        });

        this.client.on('authenticated', () => {
            this.qrCode = null;
            this.qrGateway.sendQrCode(null);
            this.qrGateway.sendLog('Whatsapp', 'Cliente autenticado');
            console.log('Client is authenticated');
        });

        this.client.on('auth_failure', (message) => {
            this.qrCode = null;
            this.qrGateway.sendQrCode(null);
            this.qrGateway.sendLog('Whatsapp', 'Autenticación fallida');
            console.error('Authentication failed:', message);
        });

        this.client.on('disconnected', (reason) => {
            this.qrCode = null;
            this.qrGateway.sendQrCode(null);
            this.qrGateway.sendLog('Whatsapp', 'Cliente desconectado');
            console.log('Client was logged out', reason);
            this.client.initialize();
        });

        this.client.initialize();
    }

    getQrCode() {
        return this.qrCode;
    }

    async getLogs() {
        // get 20 latest logs
        return await this.logRepository.find({
            order: {
                dateTime: 'DESC',
            },
            take: 20,
        });
    }

    async sendMessageToContacts(
        secret: string,
        message: string,
    ): Promise<string> {
        const MY_SECRET_KEY = process.env.AUTH_SECRET_KEY;
        if (!secret) return 'Secret key is required';
        if (secret !== MY_SECRET_KEY) return 'Invalid secret key';
        if (!message) return 'Message is required';

        // Verifica si el cliente está inicializado
        if (!this.client?.sendMessage) return 'Client is not ready';
        const contacts = await this.contactRepository.find(); // Obtiene todos los contactos

        for (const contact of contacts) {
            try {
                const chatId = `${contact.celular}@c.us`; // Asegúrate de que el formato sea correcto
                await this.client.sendMessage(chatId, message);
                this.qrGateway.sendLog(
                    'Whatsapp',
                    `Mensaje enviado a: ${contact.nombre}, Mensaje: ${message}`,
                );
                console.log('Sending message to:', chatId);
            } catch (error) {
                console.error(
                    'Error sending message to:',
                    contact.celular,
                    error,
                );
            }
        }

        return 'Messages sent successfully';
    }

    async signOutWhatsapp(secret: string): Promise<string> {
        const MY_SECRET_KEY = process.env.AUTH_SECRET_KEY;
        if (!secret) return 'Secret key is required';
        if (secret !== MY_SECRET_KEY) return 'Invalid secret key';

        await this.client.logout();
        await this.client.destroy();
        await this.client.initialize();
        this.qrGateway.sendLog('Whatsapp', 'Sesión cerrada');
        return 'Client destroyed';
    }
}
