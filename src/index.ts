import { webSocketSingleton } from './modules/websocket/websocket';
import { ApiServer } from './modules/server/apiServer';
import { SolanaEventListener } from './modules/smartContract/EventListener';
import { WebSocketNotifier } from './modules/websocket/WebSocketNotifier';

function main() {
    // --- Server and WebSocket Setup ---
    const apiServer = ApiServer.getInstance();
    const port = process.env.PORT || 3001;
    apiServer.start(port);
    webSocketSingleton.init(); // Assuming this sets up the WebSocket server

    // --- Event Listening Setup (Observer Pattern) ---
    // 1. Create the Subject (the event listener)
    const solanaListener = new SolanaEventListener();

    // 2. Create Observers (the components that react to events)
    const webSocketNotifier = new WebSocketNotifier();
    //    (e.g., you could add a database logger here)
    // const databaseNotifier = new DatabaseNotifier();

    // 3. Subscribe Observers to the Subject
    solanaListener.addObserver(webSocketNotifier);
    // solanaListener.addObserver(databaseNotifier);

    // 4. Start the Subject, which begins listening for events
    solanaListener.start();


    // --- Graceful Shutdown ---
    const gracefulShutdown = (signal: string) => {
        console.log(`Received ${signal}, shutting down gracefully...`);

        // Stop the Solana event listener
        solanaListener.stop();

        // Close the WebSocket server and then the API server
        webSocketSingleton.close(() => {
            console.log('WebSocket server closed.');
            apiServer.stop(() => {
                console.log('Closed out remaining connections.');
                process.exit(0);
            });
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main();
