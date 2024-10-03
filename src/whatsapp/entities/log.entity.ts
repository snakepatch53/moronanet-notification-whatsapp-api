import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('whatsapp_logs')
export class LogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    detail: string;

    @Column()
    dateTime: Date;
}
