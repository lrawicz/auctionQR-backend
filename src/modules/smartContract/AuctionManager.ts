
import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import * as anchor from "@coral-xyz/anchor";
import idl from './info/idl.json';
import { DailyAuction } from './info/daily_auction';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

export class AuctionManager {
    private program: Program<DailyAuction>;
    private authority: Keypair;
    private auctionPda: anchor.web3.PublicKey;
    private bump: number;

    constructor() {
        const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), 'confirmed');
        
        // Load authority keypair from file
        const secretKey = JSON.parse(fs.readFileSync('./authority.json', 'utf-8'));
        this.authority = Keypair.fromSecretKey(new Uint8Array(secretKey));

        const wallet = new anchor.Wallet(this.authority);
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
        setProvider(provider);

        this.program = new Program(idl as any, provider);

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

    public async startAuction() {
        console.log("Attempting to start a new auction...");
        try {
            const tx = await this.program.methods
                .startAuction()
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
