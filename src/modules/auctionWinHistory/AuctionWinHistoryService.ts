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

    async findOne(id: number): Promise<AuctionWinHistory | null> {
        return this.auctionWinHistoryRepository.findOneBy({ id });
    }

    async getLatest(): Promise<AuctionWinHistory | null> {

        const startOfYesterday = new Date();
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0); 

        const endOfYesterday = new Date();
        endOfYesterday.setDate(startOfYesterday.getDate() );
        endOfYesterday.setHours(23, 59, 59, 999); 
        const result = await this.auctionWinHistoryRepository.findOne({
            where:
                {date: Between(startOfYesterday, endOfYesterday)}
            ,
            order: {
                date: "DESC",
                id: "DESC"
            }
        });
        return result
    }
}
