import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import * as anchor from "@coral-xyz/anchor";
import idl from './info/idl.json';
import { ApiServer } from '../server/apiServer';
import { Message } from '../interfaces/interfaces';
import { webSocketSingleton } from '../websocket/websocket';

const triggerType: "log"|"event" = "log";

export async function SolanaEventListener() {
    console.log("Initializing Solana Event Listener...");
    const programId = new anchor.web3.PublicKey(idl.address);
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), 'confirmed');

    connection.onLogs(programId, (logs, context) => {
        if(triggerType==="event") return;
        if (logs.err) {
            console.error("Transaction Error:", logs.err);
            return;
        }
        console.log(logs.logs)
        const newBidLog = logs.logs.find((log) =>
                                log.includes("newBid->"));
        if(newBidLog){
            const amount:number =  Number(logs.logs.find((log) =>
                                log.includes("newBid->amount:"))
                                ?.split("Program log: newBid->amount: ")
                                ?.[1])
            const url:string =  logs.logs.find((log) =>
                                log.includes("newBid->newContent:"))
                                ?.split("Program log: newBid->newContent: ")
                                [1] || ""
            const address:string = logs.logs.find((log) =>
                                log.includes("newBid->address:"))
                                ?.split("Program log: newBid->address: ")
                                [1] || ""
            const timestamp:Date = new Date(
                                Number(logs.logs.find((log) =>
                                log.includes("newBid->timestamp:"))
                                ?.split("Program log: newBid->timestamp: ")
                                [1]) || 0)
            const message: Message= {
                message: {url,amount,address,timestamp},
                meta: "New bid placed",
                room: "bidRoom"
            };
            console.log("TESTING")
            console.log(message)
            webSocketSingleton.sendMessage(message.room, message);
            //io.to("bidRoom").emit("message", {message})
        }
    });

 
    const keypair = anchor.web3.Keypair.generate(); // Or load from a file: anchor.web3.Keypair.fromSecretKey(...)
    const wallet = new anchor.Wallet(keypair);
    // // ---
    const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    const program = new Program(
        idl as Idl,
        provider
    ) as unknown as Program<Idl>;

    // console.log("Adding BidPlaced event listener...");
    program.addEventListener("BidPlaced", (event, slot) => {
        console.log(event)
        console.log(slot)
        if(triggerType==="log") return;
        console.log("----------------------------");
        console.log("BidPlaced event received!");
        console.log("Event:", event);
        console.log("Slot:", slot); 
    //     console.log("----------------------------");
    //     console.log("BidPlaced event received!");
    //     console.log("Event:", event);
    //     console.log("Slot:", slot); 
    //     io.to("bidRoom").emit("message", "hola mundo");
    });
    
    // console.log("Listening for BidPlaced events from program:", programId.toBase58());
    // console.log("Provider wallet public key:", wallet.publicKey.toBase58());

    // Keep the process alive if it's a standalone script (for testing)
    // This is likely not needed in a server environment
    // setInterval(() => {}, 1000 * 60 * 60);
}
