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
        //solve cors errror
        // this.app.use((req, res, next) => {
        //     res.header('Access-Control-Allow-Origin', '*');
        //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        //     if (req.method === 'OPTIONS') {
        //         res.sendStatus(200);
        //     } else {
        //         next();
        //     }
        // });
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
        this.app.get('/qr', (_: express.Request, res: express.Response) => {
            res.redirect(this.oldUrl);
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
                res.json({ url: latestEntry.url });
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
