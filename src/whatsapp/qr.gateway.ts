import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LogEntity } from './entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway()
export class QrGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectRepository(LogEntity)
        private logRepository: Repository<LogEntity>,
    ) {}

    async handleConnection(client: any) {
        console.log('Socket client connected:', client.id);
        const logs = await this.logRepository.find();
        this.server.emit('log-response', logs);
    }

    sendQrCode(qr: string) {
        this.server.emit('qrCode', qr); // Enviará el QR a todos los clientes conectados
    }

    async sendLog(name: string, detail: string) {
        await this.logRepository.save({
            nombre: name,
            detail,
            dateTime: new Date(),
        });
        const logs = await this.logRepository.find();
        this.server.emit('log-response', logs);
    }
}
