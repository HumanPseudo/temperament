import { Note, Chord } from 'tonal';

// ✅ Función para mapear los números MIDI a nombres de nota
function mapMidiNotes() {
    const midiMap = {};
    for (let i = 0; i <= 127; i++) {
        midiMap[i] = Note.fromMidi(i); // Convierte el número MIDI a la nota
    }
    console.table(midiMap); // Imprime el mapeo completo en formato de tabla
}

// ✅ Procesar los mensajes MIDI y detectar acordes
export function processNote(deltaTime, message, pressedKeys, keySignature = []) {
    if (!message || !Array.isArray(message) || message.length < 3) {
        console.error('❌ Mensaje MIDI no válido:', message);
        return null;
    }

    const midiNote = message[1]; // Nota MIDI
    console.log('🧐 MIDI message:', message);

    // ✅ Aseguramos que keySignature siempre sea un array
    keySignature = Array.isArray(keySignature) ? keySignature : [];

    // ✅ Determinar si usar sostenidos o bemoles según la armadura
    const preferSharps = shouldUseSharps(keySignature);

    // ✅ Traducir la nota MIDI al nombre correcto (sostenido o bemol)
    const noteName = getNoteName(midiNote, preferSharps);
    console.log(`🎵 Nota MIDI recibida: ${midiNote} → ${noteName}`);

    // Mostrar el mapeo completo una vez al recibir la nota C4 (MIDI 60)
    if (midiNote === 60) {
        mapMidiNotes();
    }

    // ✅ Convertir todas las notas presionadas
    const pressedNotes = [...pressedKeys].map((note) => getNoteName(note, preferSharps));

    // ✅ Detectar acordes (si hay al menos 3 notas presionadas)
    let detectedChords = [];
    if (pressedNotes.length >= 3) {
        detectedChords = detectChords(pressedNotes, keySignature);
    }

    return {
        noteName,
        pressedNotes,
        detectedChords,
    };
}

// ✅ Detectar acordes considerando la armadura (keySignature)
function detectChords(pressedNotes, keySignature) {
    // Detectar todos los acordes posibles
    const allChords = Chord.detect(pressedNotes);

    // Si no hay armadura, devolver todos los acordes
    if (keySignature.length === 0) return allChords;

    // Normalizar la armadura (sostenidos y bemoles)
    const normalizedKeySignature = keySignature.flatMap((note) => {
        const enharmonic = Note.enharmonic(note);
        return enharmonic ? [note, enharmonic] : [note];
    });

    // Filtrar acordes según la armadura
    return allChords.filter((chord) => {
        const tonic = Chord.get(chord).tonic; // Obtener la tónica
        const normalizedTonic = [tonic, Note.enharmonic(tonic)].filter(Boolean);
        return normalizedTonic.some((t) => normalizedKeySignature.includes(t));
    });
}

// ✅ Función para determinar si usar sostenidos o bemoles
function shouldUseSharps(keySignature) {
    // Si la armadura tiene sostenidos, preferir sostenidos
    if (keySignature.some((note) => note.includes('#'))) return true;

    // Si tiene bemoles, preferir bemoles
    if (keySignature.some((note) => note.includes('b'))) return false;

    // Por defecto, usar sostenidos (C mayor o A menor)
    return true;
}

// ✅ Convertir el número MIDI a nota (sostenido o bemol según armadura)
function getNoteName(midiNote, preferSharps) {
    const note = Note.fromMidi(midiNote);
    const enharmonic = Note.enharmonic(note);

    // Si no hay enharmónico (notas naturales como C, D, etc.), devolver la original
    if (!enharmonic) return note;

    // Devolver sostenidos o bemoles según la preferencia
    return preferSharps ? note : enharmonic;
}
