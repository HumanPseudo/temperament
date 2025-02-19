class WSManager {
    constructor(server) {
        this.clients = new Set();
        server.on('connection', (ws) => {
            this.clients.add(ws);
            ws.on('close', () => this.clients.delete(ws));
        });
    }

    broadcast(data) {
        const message = JSON.stringify(data);
        this.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    }
}

export default WSManager;
