import { Message } from './../interfaces/interfaces';
import { PublicKey } from '@solana/web3.js';

export class BidMessageFactory {
    public static createFromLogs(logs: string[]): Message | null {
        const newBidLog = logs.find((log) => log.includes("newBid->"));
        if (!newBidLog) {
            return null;
        }

        try {
            const amountStr = this.extractLogValue(logs, "newBid->amount:");
            const url = this.extractLogValue(logs, "newBid->newContent:");
            const address = this.extractLogValue(logs, "newBid->address:");
            const timestampStr = this.extractLogValue(logs, "newBid->timestamp:");

            if (amountStr === null || url === null || address === null || timestampStr === null) {
                return null;
            }

            const amount = Number(amountStr);
            const timestamp = new Date(Number(timestampStr));

            if (isNaN(amount) || isNaN(timestamp.getTime())) {
                console.error("Failed to parse numeric values from logs");
                return null;
            }

            const message: Message = {
                content: { url, amount, address, timestamp },
                meta: "new_bid_placed",
                room: `bidRoom_${new Date().toISOString().slice(0,10)}`
            };

            return message;

        } catch (error) {
            console.error("Error parsing bid logs:", error);
            return null;
        }
    }

    public static createFromAnchorEvent(event: any): Message | null {
        try {
            const { bidder, amount, newContent } = event;

            const message: Message = {
                content: {
                    url: newContent,
                    amount: Number(amount.toString()), // Anchor's u64 is a BN object, convert to number
                    address: new PublicKey(bidder).toBase58(),
                    timestamp: new Date(), // Use current timestamp for event
                },
                meta: "new_bid_placed",
                room: `bidRoom_${new Date().toISOString().slice(0,10)}`
            };

            return message;
        } catch (error) {
            console.error("Error parsing BidPlaced event:", error);
            return null;
        }
    }

    private static extractLogValue(logs: string[], prefix: string): string | null {
        const logEntry = logs.find((log) => log.includes(prefix));
        if (!logEntry) {
            return null;
        }
        // The full prefix is "Program log: " + prefix
        const fullPrefix = `Program log: ${prefix} `;
        return logEntry.split(fullPrefix)[1] || null;
    }
}
