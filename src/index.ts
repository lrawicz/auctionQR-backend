import { webSocketSingleton } from './modules/websocket/websocket';
import { ApiServer } from './modules/server/apiServer';
import { SolanaEventListener } from './modules/smartContract/EventListener';

function main() {
    const apiServer = ApiServer.getInstance();
    const port = process.env.PORT || 3000;

    apiServer.start(port);
    SolanaEventListener();
    webSocketSingleton.init();


    const gracefulShutdown = (signal: string) => {
        console.log(`Received ${signal}, shutting down gracefully...`);
        apiServer.stop(() => {
            console.log('Closed out remaining connections.');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main()