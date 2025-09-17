import express from 'express';
import http from 'http';

export class ApiServer {
    private static instance: ApiServer;
    private app: express.Express;
    public server: http.Server;
    private oldUrl: string="";
    private constructor() {
        this.app = express();
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
        this.app.get('/qr', (_: express.Request, res: express.Response) => {
            res.redirect(this.oldUrl);
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
