import { Note } from 'tonal';

export function noteMode(deltaTime, message, pressedKeys) {
  if (!message || !Array.isArray(message) || message.length < 3) {
    console.error('Invalid MIDI message:', message);
    return;
  }

  const midiNote = message[1]; // Extraemos el número de nota MIDI
  const noteName = Note.fromMidi(midiNote); // Convertimos el número MIDI a nombre de nota

  // Convertimos todas las teclas presionadas a nombres de notas
  const pressedNotes = [...pressedKeys].map(Note.fromMidi);

  // Aquí retornamos las notas presionadas
  console.log(`Nota actual: ${noteName}, Notas presionadas: ${pressedNotes.join(", ")}`);

  return noteName; // Retorna el nombre de la nota actual
}
