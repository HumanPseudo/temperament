import { Note, Chord } from 'tonal';

export function processNote(deltaTime, message, pressedKeys) {
    if (!message || !Array.isArray(message) || message.length < 3) {
        console.error('Invalid MIDI message:', message);
        return null;
    }

    const midiNote = message[1];
    const noteName = Note.fromMidi(midiNote);
    const pressedNotes = [...pressedKeys].map(Note.fromMidi);

    let detectedChords = [];
    if (pressedNotes.length >= 3) {
        detectedChords = detectChords(pressedNotes);
    }

    return {
        noteName,
        pressedNotes,
        detectedChords
    };
}

function detectChords(pressedNotes) {
    const detectedChords = Chord.detect(pressedNotes);
    return detectedChords.length > 0 ? detectedChords : [];
}
