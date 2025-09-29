import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import * as anchor from "@coral-xyz/anchor";
import devnetIdl from './info/devnet/idl.json';
import mainnetIdl from './info/mainnet/idl.json';
import { BidMessageFactory } from './BidMessageFactory';
import { Subject } from '../events/Observer';
import settings from '../../settings/settigs';

const triggerType: ("log" | "event")[] = ["log","event"];

export class SolanaEventListener extends Subject {
    private connection: anchor.web3.Connection;
    private programId: anchor.web3.PublicKey;
    private logSubscriptionId: number | null = null;
    private eventListenerId: number | null = null;
    private program: Program<Idl>;

    constructor() {
        super();
        console.log(`Initializing Solana Event Listener, loading IDL...network ${settings.solanaNetwork}}`);
        this.programId = new anchor.web3.PublicKey(devnetIdl.address);
        this.connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl(settings.solanaNetwork), 'confirmed');
        const keypair = anchor.web3.Keypair.generate();
        const wallet = new anchor.Wallet(keypair);
        const provider = new AnchorProvider(this.connection, wallet, { commitment: 'confirmed' });
        switch(settings.solanaNetwork) {
            case "devnet":
                this.program = new Program(devnetIdl as Idl, provider) as unknown as Program<Idl>;
                break;
            case "mainnet-beta":
                this.program = new Program(mainnetIdl as Idl, provider) as unknown as Program<Idl>;
                break;
            default:
                throw new Error(`Unsupported Solana network: ${settings.solanaNetwork}`);
        }
    }

    public start() {
        console.log("Starting event listeners...");
        //this.listenForLogs();
        this.listenForAnchorEvents();
    }

    public stop() {
        console.log("Stopping event listeners...");
        if (this.logSubscriptionId !== null) {
            this.connection.removeOnLogsListener(this.logSubscriptionId);
            console.log("Removed logs listener.");
        }
        if (this.eventListenerId !== null) {
            this.program.removeEventListener(this.eventListenerId);
            console.log("Removed event listener.");
        }
    }

    private listenForLogs() {
        this.logSubscriptionId = this.connection.onLogs(this.programId, (logs, context) => {
            if (!triggerType.includes("log") ) return;
            if (logs.err) {
                console.error("Transaction Error:", logs.err);
                return;
            }

            const message = BidMessageFactory.createFromLogs(logs.logs);

            if (message) {
                console.log(" message created, notifying observers...");
                this.notify(message); // Notify observers
            }
        });
    }

    private listenForAnchorEvents() {
        console.log("start eventin lissening!!!")
        this.eventListenerId = this.program.addEventListener("bidPlaced", (event, slot) => {
            //if (!triggerType.includes("event")) return;
            console.log("----------------------------");
            console.log("BidPlaced event received!", event);
            const message = BidMessageFactory.createFromAnchorEvent(event);
            if (message) {
                this.notify(message);
            }
        });
    }
}