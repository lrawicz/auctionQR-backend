import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    create_date!: Date;

    @Column({ type: 'text' })
    address!: string;

    @Column({ type: 'text' })
    @Index("IDX_messages_room")
    room!: string;

    @Column({ type: 'bigint' })
    amount!: number;

    @Column({ type: 'text' })
    url!: string;

}