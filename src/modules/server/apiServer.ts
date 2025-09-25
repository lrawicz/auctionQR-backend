import express from 'express';
import http from 'http';
import { AuctionWinHistoryService } from "../auctionWinHistory/AuctionWinHistoryService";
import { AuctionWinHistory } from '../../entity/AuctionWinHistory';
import cors from 'cors';
export class ApiServer {
    private static instance: ApiServer;
    private app: express.Express;
    public server: http.Server;
    private oldUrl: string="";
    private constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.server = http.createServer(this.app);
        this.routes();
    }
    public setOldUrl(url: string) {
        this.oldUrl = url;
    }
    public getOldUrl(): string {
        return this.oldUrl;
    }
    public static getInstance(): ApiServer {
        if (!ApiServer.instance) {
            ApiServer.instance = new ApiServer();
        }
        return ApiServer.instance;
    }

    private routes() {
        this.app.get('/qr-redirect', (_: express.Request, res: express.Response) => {
            const auctionWinHistoryService = new AuctionWinHistoryService();
            auctionWinHistoryService.getLatest().then((latestEntry:AuctionWinHistory|null) => {
                if (!latestEntry)  return res.status(404).json({ message: "No URL found for redirection." });

                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.set('Pragma', 'no-cache');
                res.set('Expires', '0');
                const urlRAW = latestEntry.url !== ""?latestEntry.url:'app.qrsol.fun'
                const redirect = urlRAW.startsWith("http://") || urlRAW.startsWith("https://")
                                    ?urlRAW
                                    :"http://"+urlRAW;
                return res.redirect(301, redirect);
            }).catch((error) => {
                console.error("Error fetching latest entry:", error);
                return res.status(500).json({ message: "Internal server error." });
            });
        });

        this.app.get('/status', (_: express.Request, res: express.Response) => {
            res.json({status:"ok"});
        });
        
        this.app.get('/getQrContent', (_: express.Request, res: express.Response) => {
            res.json({value:this.oldUrl});
        });

        this.app.get('/latest-qr-content', async (_: express.Request, res: express.Response) => {
            const auctionWinHistoryService = new AuctionWinHistoryService();
            const latestEntry:AuctionWinHistory|null = await auctionWinHistoryService.getLatest();
            if (latestEntry) {
                res.json(latestEntry);
            } else {
                res.status(404).json({ message: "No latest QR content found." });
            }
        });
    }

    public start(port: number | string) {
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }

    public stop(callback?: () => void) {
        this.server.close(callback);
    }
}
