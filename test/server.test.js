import request from 'supertest';
import express from 'express';
import http from 'http';
import WSManager from '../src/midi/wsManager.js';
import MidiManager from '../src/midi/midi.js';

// Mock de WSManager y MidiManager para evitar abrir puertos reales
jest.mock('../src/midi/wsManager.js', () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
    }));
});

jest.mock('../src/midi/midi.js', () => {
    return jest.fn().mockImplementation(() => ({
        openInputPort: jest.fn(),
        openOutputPort: jest.fn(),
        closePorts: jest.fn(),
    }));
});

// Configurar servidor Express para pruebas
const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const wsManager = new WSManager(server);
const midiManager = new MidiManager(wsManager);

midiManager.openInputPort();
midiManager.openOutputPort();

server.listen(3000);

describe('Server Tests', () => {
    afterAll(() => {
        server.close();
    });

    test('should return 200 on GET /', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });

    test('should call openInputPort and openOutputPort on server start', () => {
        expect(midiManager.openInputPort).toHaveBeenCalled();
        expect(midiManager.openOutputPort).toHaveBeenCalled();
    });
});
