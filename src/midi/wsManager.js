import { WebSocketServer } from 'ws';

class WSManager {
    constructor(server) {
        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', (ws) => {
            console.log('📡 Cliente conectado.');
        });
    }

    broadcast(data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

export default WSManager;
