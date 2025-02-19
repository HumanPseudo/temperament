import express from 'express';
import http from 'http';
import WSManager from './src//midi/wsManager.js';
import MidiManager from './src/midi/midi.js';

const app = express();
const port = 3000;

// Servir archivos estáticos
app.use(express.static('public'));

const server = http.createServer(app);
const wsManager = new WSManager(server);
const midiManager = new MidiManager(wsManager);

// Abrir puertos MIDI
midiManager.openInputPort();
midiManager.openOutputPort();

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Manejar cierre seguro del servidor
process.on('SIGINT', () => {
    console.log('Closing server...');
    midiManager.closePorts();
    process.exit();
});
