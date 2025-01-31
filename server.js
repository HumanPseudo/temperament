import express from 'express';
import { WebSocketServer } from 'ws';
import pkg from 'midi';
const { Input, Output } = pkg;
import { noteMode } from './src/note/note.js';


const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Inicializa el WebSocketServer
const wss = new WebSocketServer({ noServer: true });

// Inicializa MIDI
const input = new Input();
const output = new Output();
const pressedKeys = new Set();

// Cuenta puertos de entrada
const countInputPorts = () => input.getPortCount();
// Lista puertos de entrada
const listInputPorts = () => {
const portCount = countInputPorts();
for (let i = 0; i < portCount; i++) {
    console.log(`Port ${i}: ${input.getPortName(i)}`);
}
};

// Abre puerto de entrada
const openInputPort = (portNumber = 0) => {
const portCount = countInputPorts();
if (portCount > 0) {
    input.openPort(portNumber);
    console.log(`Input port ${portNumber} opened.`);
} else {
    console.log(`No input port ${portNumber} to open.`);
}
};
// Abre puerto de salida
const openOutputPort = (portNumber = 2) => {
    const outputPortCount = output.getPortCount();
    if (outputPortCount > portNumber) {
    output.openPort(portNumber);
    console.log(`Output port ${portNumber} opened.`);
    } else {
    console.log(`No output port ${portNumber} to open.`);
    }
};
// Maneja mensajes MIDI
const handleMidiMessages = () => {
    input.on('message', (deltaTime, message) => {
        const [status, note, velocity] = message;

        if (status === 144 && velocity > 0) {
        pressedKeys.add(note);
        } else if (status === 128 || (status === 144 && velocity === 0)) {
            pressedKeys.delete(note);
        }
        // Calcula los datos de noteMode cada vez que pressedKeys cambia
        output.sendMessage(message);
        const noteModeData = noteMode(deltaTime, message, pressedKeys);
        console.log(noteModeData);
        wss.clients.forEach(client => {
              client.send(JSON.stringify({ type: 'midi', data: noteModeData }));
            });
    });
};


const enableAllMessageTypes = () => {
    input.ignoreTypes(false, false, false);
};

// Configura el servidor HTTP con el WebSocketServer
const server = app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});

// Manejo de conexiones WebSocket
wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// Ejecutar todo el flujo
const run = () => {
    listInputPorts();
    openInputPort();
    openOutputPort();
    handleMidiMessages();
    enableAllMessageTypes();
};
// Inicialización
run();

//Cerrar Puertos
const closePortsAfterDelay = (delay = 1000000) => {
    setTimeout(() => {
        input.closePort();
        output.closePort();
        console.log('MIDI ports closed.');
    }, delay);
};
closePortsAfterDelay();