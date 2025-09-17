import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import * as anchor from "@coral-xyz/anchor";
import idl from './info/idl.json';
import { BidMessageFactory } from './BidMessageFactory';
import { Subject } from '../events/Observer';

const triggerType: "log" | "event" = "log";

export class SolanaEventListener extends Subject {
    private connection: anchor.web3.Connection;
    private programId: anchor.web3.PublicKey;

    constructor() {
        super();
        console.log("Initializing Solana Event Listener...");
        this.programId = new anchor.web3.PublicKey(idl.address);
        this.connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), 'confirmed');
    }

    public start() {
        console.log("Starting event listeners...");
        this.listenForLogs();
        this.listenForAnchorEvents();
    }

    private listenForLogs() {
        this.connection.onLogs(this.programId, (logs, context) => {
            if (triggerType === "event") return;
            if (logs.err) {
                console.error("Transaction Error:", logs.err);
                return;
            }

            const message = BidMessageFactory.createFromLogs(logs.logs);

            if (message) {
                console.log("New bid message created, notifying observers...");
                this.notify(message); // Notify observers
            }
        });
    }

    private listenForAnchorEvents() {
        // This part remains mostly for demonstration as it's disabled by triggerType
        const keypair = anchor.web3.Keypair.generate();
        const wallet = new anchor.Wallet(keypair);
        const provider = new AnchorProvider(this.connection, wallet, { commitment: 'confirmed' });
        const program = new Program(idl as Idl, provider) as unknown as Program<Idl>;

        program.addEventListener("BidPlaced", (event, slot) => {
            if (triggerType === "log") return;
            console.log("----------------------------");
            console.log("BidPlaced event received!", event);
            // In a real scenario, you would convert the Anchor event to your standard Message format
            // const message = BidMessageFactory.createFromAnchorEvent(event);
            // if (message) {
            //     this.notify(message);
            // }
        });
    }
}
