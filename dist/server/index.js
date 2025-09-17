"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
class ApiServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.routes();
    }
    routes() {
        this.app.get('/qr', (req, res) => {
            res.redirect(`http://google.com`);
        });
    }
    start(port) {
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}
exports.ApiServer = ApiServer;
