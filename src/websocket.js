import { WebSocketServer } from 'ws';

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.clients = new Set();

        this.wss.on('connection', (ws) => {
            console.log('Client connected');
            this.clients.add(ws);

            ws.on('close', () => {
                console.log('Client disconnected');
                this.clients.delete(ws);
            });
        });
    }

    broadcast(data) {
        const message = JSON.stringify({ type: 'midi', data });
        this.clients.forEach(client => {
            if (client.readyState === 1) { // Solo enviar si está conectado
                client.send(message);
            }
        });
    }
}

export default WebSocketManager;
