import { And, Between, LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../../data-source";
import { AuctionWinHistory } from "../../entity/AuctionWinHistory";

interface AuctionWinHistoryData {
    date: Date;
    amount: number;
    url: string;
}

export class AuctionWinHistoryService {
    private auctionWinHistoryRepository = AppDataSource.getRepository(AuctionWinHistory);

    async create(data: AuctionWinHistoryData): Promise<AuctionWinHistory> {
        const newEntry = this.auctionWinHistoryRepository.create(data);
        return this.auctionWinHistoryRepository.save(newEntry);
    }

    async getAll(): Promise<AuctionWinHistory[]> {
        return this.auctionWinHistoryRepository.find();
    }

    async findOne(room: string): Promise<AuctionWinHistory | null> {
        return this.auctionWinHistoryRepository.findOneBy({ room });
    }

    async getLatest(): Promise<AuctionWinHistory | null> {
        //const yesterday = new Date();
        //yesterday.setDate(yesterday.getDate() - 1);
        // const year= yesterday.getFullYear()
        // const month= (yesterday.getMonth() + 1).toString().padStart(2, '0')
        // const day= yesterday.getDate().toString().padStart(2, '0')
        // const room = `bidRoom_${year}-${month}-${day}`
        try{
            const result = await this.auctionWinHistoryRepository.find({order:{auction_number:"DESC"}})
            return result[0]
        }catch(error){
            console.log(error)
            return null
        }
    }
}
