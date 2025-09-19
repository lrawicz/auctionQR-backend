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
        return this.auctionWinHistoryRepository.findOne({
            order: {
                date: "DESC",
                id: "DESC" // Added id as a secondary sort to ensure consistent ordering for entries with the same date
            }
        });
    }
}
