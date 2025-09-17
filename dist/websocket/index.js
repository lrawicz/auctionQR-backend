"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
class WebSocketServer {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.io.on('connection', (socket) => {
            console.log('Client connected', socket.id);
            socket.on('join', (room) => {
                console.log(`${socket.id} - JOINING room ${room}`);
                socket.join(room);
            });
            socket.on('leave', (room) => {
                console.log(`${socket.id} - LEAVING room ${room}`);
                socket.leave(room);
            });
            socket.on('message', (data) => {
                const { message, room } = data;
                this.io.to(room).emit('message', message);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
            });
        });
    }
    static getInstance(server) {
        if (!WebSocketServer.instance && server) {
            WebSocketServer.instance = new WebSocketServer(server);
        }
        return WebSocketServer.instance;
    }
    getIO() {
        return this.io;
    }
}
exports.WebSocketServer = WebSocketServer;
