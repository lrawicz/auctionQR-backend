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
        // 1. Get the state of the current auction before ending it
        console.log("Getting current auction state...");
        const currentAuctionState = await auctionManager.getAuctionState();

        if (!currentAuctionState) {
            console.error("No active auction found or error fetching state. Cannot proceed.");
            return;
        }

        // Determine new content for the next auction (e.g., the content that was just bid on)
        const newContentForNextAuction = currentAuctionState.newContent;

        // 2. End the current auction and start a new one in a single call
        console.log("Ending current auction and starting a new one...");
        await auctionManager.endAndStartAuction(newContentForNextAuction);
        console.log("Auction ended and new one started.");

        // 3. Save the winner of the *just ended* auction to the database
        console.log("Saving auction winner...");
        await auctionWinHistoryService.create({
            date: new Date(),
            amount: currentAuctionState.highestBid.toNumber(),
            url: currentAuctionState.newContent,
        });
        console.log("Auction winner saved.");

    } catch (error) {
        console.error("An error occurred during auction management:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("Data source connection closed.");
    }
}

manageAuction();
