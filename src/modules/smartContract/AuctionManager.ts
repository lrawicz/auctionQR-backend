
import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import * as anchor from "@coral-xyz/anchor";
import devnetIdl from './info/devnet/idl.json';
import mainnetIdl from './info/mainnet/idl.json';
import { DailyAuction as DailyAuctionDevnet } from './info/devnet/daily_auction';
import { DailyAuction as DailyAuctionMainnet } from './info/mainnet/types';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import settings from '../../settings/settigs';

export class AuctionManager {
    private program: Program<DailyAuctionDevnet|DailyAuctionMainnet>;
    private authority: Keypair;
    private auctionPda: anchor.web3.PublicKey;
    private bump: number;

    constructor() {
        const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl(settings.solanaNetwork), 'confirmed');
        
        // Load authority keypair from file
        const secretKey = JSON.parse(fs.readFileSync('./authority.json', 'utf-8'));
        this.authority = Keypair.fromSecretKey(new Uint8Array(secretKey));

        const wallet = new anchor.Wallet(this.authority);
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
        setProvider(provider);

        switch(settings.solanaNetwork) {
            case "devnet":
                this.program = new Program(devnetIdl as any, provider);
                break;
            case "mainnet-beta":
                this.program = new Program(mainnetIdl as any, provider);
                break;
            default:
                throw new Error(`Unsupported Solana network: ${settings.solanaNetwork}`);
        }

        const [pda, pda_bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("auction")],
            this.program.programId
        );
        this.auctionPda = pda;
        this.bump = pda_bump;
    }

    public async endAuction() {
        console.log("Attempting to end the auction...");
        try {
            const tx = await this.program.methods
                .endAuction()
                .accounts({
                    auction: this.auctionPda,
                    authority: this.authority.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            console.log("End auction transaction signature", tx);
            return tx;
        } catch (error) {
            console.error("Error ending auction:", error);
            throw error;
        }
    }

    public async startAuction(newContent: string ="") {
        console.log("Attempting to start a new auction...");
        try {
            const tx = await this.program.methods
                .startAuction(newContent)
                .accounts({
                    auction: this.auctionPda,
                    authority: this.authority.publicKey,
                })
                .rpc();
            console.log("Start auction transaction signature", tx);
            return tx;
        } catch (error) {
            console.error("Error starting auction:", error);
            throw error;
        }
    }

    public async getAuctionState() {
        console.log("Fetching auction state...");
        try {
            const auctionState = await this.program.account.auction.fetch(this.auctionPda);
            console.log("Auction state:", auctionState);
            return auctionState;
        } catch (error) {
            console.error("Error fetching auction state:", error);
            throw error;
        }
    }

    public async endAndStartAuction(newContent: string) {
        console.log("Attempting to end and start a new auction...");
        try {
            const tx = await this.program.methods
                .endAndStartAuction(newContent)
                .accounts({
                    auction: this.auctionPda,
                    authority: this.authority.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();
            console.log("End and start auction transaction signature", tx);
            return tx;
        } catch (error) {
            console.error("Error ending and starting auction:", error);
            throw error;
        }
    }
}
