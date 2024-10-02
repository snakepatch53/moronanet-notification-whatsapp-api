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

    handleConnection(client: any) {
        console.log('Socket client connected:', client.id);
    }

    sendQrCode(qr: string) {
        this.server.emit('qrCode', qr); // Enviará el QR a todos los clientes conectados
    }

    sendLog(name: string, detail: string) {
        const newLog = {
            nombre: name,
            detail,
            dateTime: new Date().toISOString(),
        };
        this.server.emit('log-response', newLog); // Enviará el QR a todos los clientes conectados
        this.logRepository.save(newLog);
    }
}
