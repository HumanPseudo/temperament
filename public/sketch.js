let socket;
let pressedNotes = [];

function setup() {
    createCanvas(600, 400);
    background(255);

    // Crear conexión WebSocket con el backend
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
        console.log('WebSocket Connected');
        document.getElementById('connection-status').textContent = 'Status: Connected';
    };

    socket.onclose = () => {
        console.log('WebSocket Disconnected');
        document.getElementById('connection-status').textContent = 'Status: Disconnected';
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'midi') {
                pressedNotes = data.data.pressedNotes || [];
                console.log('Notas activas:', pressedNotes);
            }
        } catch (error) {
            console.error('Error procesando mensaje WebSocket:', error);
        }
    };
}

function draw() {
    background(255);
    drawPentagram(50);  // Clave de Sol
    drawPentagram(220); // Clave de Fa
    drawPressedNotes();
    drawChord();
}

// Dibujar pentagrama
function drawPentagram(yPosition) {
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < 5; i++) {
        line(50, yPosition + i * 20, width - 50, yPosition + i * 20);
    }
}

// Función para asignar posiciones de notas MIDI dentro del pentagrama
function getNotePosition(midiNote) {
    const solNotes = {
        60: 150,  // Do4
        62: 140,  // Re4
        64: 130,  // Mi4
        65: 120,  // Fa4
        67: 110,  // Sol4
        69: 100,  // La4
        71: 90,   // Si4
        72: 80,   // Do5
        74: 70,   // Re5
        76: 60    // Mi5
    };

    const faNotes = {
        48: 320,  // Do3
        50: 310,  // Re3
        52: 300,  // Mi3
        53: 290,  // Fa3
        55: 280,  // Sol3
        57: 270,  // La3
        59: 260,  // Si3
        60: 250,  // Do4
        62: 240,  // Re4
        64: 230   // Mi4
    };

    if (solNotes[midiNote]) {
        return { noteY: solNotes[midiNote] };
    } else if (faNotes[midiNote]) {
        return { noteY: faNotes[midiNote] };
    } else {
        return { noteY: 200 };
    }
}

// Dibujar notas en el pentagrama correcto
function drawPressedNotes() {
    const noteRadius = 10;
    const noteSpacing = 40;
    const baseX = 100;

    pressedNotes.forEach((midiNote, index) => {
        const noteX = baseX + (index * noteSpacing);
        let { noteY } = getNotePosition(midiNote);

        // Dibujar la nota en el pentagrama correspondiente
        fill(255, 0, 0);
        ellipse(noteX, noteY, noteRadius, noteRadius);

        // Mostrar el número de la nota MIDI
        fill(0);
        textAlign(CENTER, CENTER);
        text(midiNote, noteX, noteY - 15);
    });
}

// Detectar acordes y mostrarlos
function drawChord() {
    if (pressedNotes.length >= 3) {
        const chordName = detectChord(pressedNotes);
        fill(0);
        textSize(20);
        textAlign(CENTER);
        text(`Acorde: ${chordName}`, width / 2, 380);
    }
}

// Función para detectar acordes básicos (mayor y menor)
function detectChord(notes) {
    const majorChords = {
        "60,64,67": "Do Mayor",
        "62,66,69": "Re Mayor",
        "64,68,71": "Mi Mayor",
        "65,69,72": "Fa Mayor",
        "67,71,74": "Sol Mayor",
        "69,73,76": "La Mayor",
        "71,75,78": "Si Mayor"
    };

    const minorChords = {
        "60,63,67": "Do menor",
        "62,65,69": "Re menor",
        "64,67,71": "Mi menor",
        "65,68,72": "Fa menor",
        "67,70,74": "Sol menor",
        "69,72,76": "La menor",
        "71,74,78": "Si menor"
    };

    const sortedNotes = notes.slice().sort((a, b) => a - b).join(',');

    if (majorChords[sortedNotes]) return majorChords[sortedNotes];
    if (minorChords[sortedNotes]) return minorChords[sortedNotes];

    return "No reconocido";
}
