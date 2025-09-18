import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { AuctionManager } from "../modules/smartContract/AuctionManager";
import { AuctionWinHistoryService } from "../modules/auctionWinHistory/AuctionWinHistoryService";

async function manageAuction() {
    console.log("Initializing data source...");
    await AppDataSource.initialize();
    console.log("Data source initialized.");

    const auctionManager = new AuctionManager();
    const auctionWinHistoryService = new AuctionWinHistoryService();

    try {
        // 1. End the current auction
        console.log("Ending auction...");
        await auctionManager.endAuction();
        console.log("Auction ended.");

        // 2. Get the state of the ended auction to find the winner
        console.log("Getting auction state...");
        const auctionState = await auctionManager.getAuctionState();

        // 3. Save the winner to the database
        if (auctionState) {
            console.log("Saving auction winner...");
            await auctionWinHistoryService.create({
                date: new Date(), // Or derive from auctionState if available
                amount: auctionState.highestBid.toNumber(),
                url: auctionState.newContent,
            });
            console.log("Auction winner saved.");
        }

        // 4. Start a new auction
        console.log("Starting new auction...");
        await auctionManager.startAuction();
        console.log("New auction started.");

    } catch (error) {
        console.error("An error occurred during auction management:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("Data source connection closed.");
    }
}

manageAuction();
