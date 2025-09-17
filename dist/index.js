"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("./websocket");
const anchor_1 = require("@coral-xyz/anchor");
const anchor = __importStar(require("@coral-xyz/anchor"));
const idl_json_1 = __importDefault(require("./smartContract/idl.json"));
const server_1 = require("./server");
function main() {
    const apiServer = new server_1.ApiServer();
    const webSocketServer = websocket_1.WebSocketServer.getInstance(apiServer.server);
    const io = webSocketServer.getIO();
    const port = process.env.PORT || 3000;
    apiServer.start(port);
    const SOLANA_NETWORK = 'https://api.devnet.solana.com';
    const programId = new anchor.web3.PublicKey(idl_json_1.default.address);
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), 'confirmed');
    const provider = new anchor_1.AnchorProvider(connection, {}, {});
    const program = new anchor_1.Program(idl_json_1.default, provider
    // new PublicKey(idl.address),
    );
    program.addEventListener("BidPlaced", (event, slot) => {
        console.log("BidPlaced event received!");
        io.to("bidRoom").emit("message", "hola mundo");
    });
    console.log("Listening for BidPlaced events from program:", programId.toBase58());
    //const connection = new Connection(SOLANA_NETWORK, 'confirmed');
}
// Solana Event Listener
// const program = new Program(idl as any, programId, provider);
main();
