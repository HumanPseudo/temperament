import midi from 'midi';
import { processNote } from '../note/noteProcessor.js';

class MidiManager {
    constructor(wsManager) {
        this.input = new midi.Input();
        this.output = new midi.Output();
        this.wsManager = wsManager;
        this.pressedKeys = new Set();
    }

    openInputPort(portNumber = 0) {
        if (this.input.getPortCount() > 0) {
            this.input.openPort(portNumber);
            console.log(`Input port ${portNumber} opened.`);
            this.listenToMidi();
        } else {
            console.log(`No MIDI input ports available.`);
        }
    }

    openOutputPort(portNumber = 2) {
        if (this.output.getPortCount() > portNumber) {
            this.output.openPort(portNumber);
            console.log(`Output port ${portNumber} opened.`);
        } else {
            console.log(`No MIDI output port ${portNumber} available.`);
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

            // Process the MIDI message
            const noteData = processNote(deltaTime, message, this.pressedKeys);
            console.log("Sending MIDI data:", noteData);
            this.wsManager.broadcast(noteData);
        });
    }

    closePorts() {
        this.input.closePort();
        this.output.closePort();
        console.log('MIDI ports closed.');
    }
}

export default MidiManager;
