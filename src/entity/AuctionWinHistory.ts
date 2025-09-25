import { Entity, Column } from "typeorm";

@Entity()
export class AuctionWinHistory {

    @Column({ type: 'text',unique: true, nullable: false,primary: true })
    room!: String

    @Column( {type:"bigint" })
    amount!: number

    @Column({ type: 'bigint',default:1 })
    auction_number!: number

    @Column()
    url!: string

}
