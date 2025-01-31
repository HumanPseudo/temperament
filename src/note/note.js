import { Note } from 'tonal';
import { Chord } from 'tonal';

export function noteMode(deltaTime, message, pressedKeys) {
if (!message || !Array.isArray(message) || message.length < 3) {
    console.error('Invalid MIDI message:', message);
    return null; // Return null if message is invalid
}

const midiNote = message[1];
const noteName = Note.fromMidi(midiNote);
const pressedNotes = [...pressedKeys].map(Note.fromMidi);

// console.log(`Current note: ${noteName}, Pressed notes: ${pressedNotes.join(", ")}`);

let detectedChords = [];
if (pressedNotes.length >= 3) {
    detectedChords = chords(pressedNotes);
}

return {
    noteName,
    pressedNotes,
    detectedChords
    };
}

function chords(pressedNotes) {
    const detectedChords = Chord.detect(pressedNotes);
    if (detectedChords.length > 0) {
        // console.log(`Detected Chord(s): ${detectedChords.join(", ")}`);
        return detectedChords;
    } else {
        console.log("No recognizable chord detected.");
        return [];
    }
}