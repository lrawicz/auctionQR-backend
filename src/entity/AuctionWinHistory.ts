import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AuctionWinHistory {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'date' })
    date: Date

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number

    @Column()
    url: string

}
