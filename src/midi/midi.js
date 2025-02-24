import midi from 'midi';
import { processNote } from '../note/noteProcessor.js';

class MidiManager {
    constructor(wsManager, keySignature) {
        this.input = new midi.Input();
        this.output = new midi.Output();
        this.wsManager = wsManager;
        this.pressedKeys = new Set();
        this.keySignature = keySignature; // Guardar la armadura
    }

    openInputPort(portNumber = 0) {
        if (this.input.getPortCount() > 0) {
            this.input.openPort(portNumber);
            console.log(`🎤 Input port ${portNumber} abierto.`);
            this.listenToMidi();
        } else {
            console.log('❌ No hay puertos MIDI de entrada disponibles.');
        }
    }

    openOutputPort(portNumber = 2) {
        if (this.output.getPortCount() > portNumber) {
            this.output.openPort(portNumber);
            console.log(`🔊 Output port ${portNumber} abierto.`);
        } else {
            console.log('❌ No hay puertos MIDI de salida disponibles.');
        }
    }

    listenToMidi() {
        this.input.on('message', (deltaTime, message) => {
            const [status, note, velocity] = message;

            if (status === 144 && velocity > 0) {
                this.pressedKeys.add(note);
            } else if (status === 128 || (status === 144 && velocity === 0)) {
                this.pressedKeys.delete(note);
            }

            this.output.sendMessage(message);

            const noteData = processNote(deltaTime, message, this.pressedKeys, this.keySignature);
            console.log("📡 Enviando datos MIDI:", noteData);
            this.wsManager.broadcast(noteData);
        });
    }

    closePorts() {
        this.input.closePort();
        this.output.closePort();
        console.log('❌ Puertos MIDI cerrados.');
    }
}

export default MidiManager;
