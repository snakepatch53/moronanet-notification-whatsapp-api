import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('whatsapp_contactos')
export class ContactoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    celular: string;
}
