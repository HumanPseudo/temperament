let socket;
let pressedNotes = [];

function setupWebSocket() {
    socket = new WebSocket('ws://localhost:3000');  // Asegúrate de que el puerto sea correcto

    socket.onopen = () => {
        console.log('WebSocket Connected');
    };

    socket.onclose = () => {
        console.log('WebSocket Disconnected');
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'midi') {
                pressedNotes = data.data.pressedNotes || []; // Actualiza las notas presionadas
                drawPentagram(); // Redibujar el pentagrama con las nuevas notas
            }
        } catch (error) {
            console.error('Error procesando mensaje WebSocket:', error);
        }
    };
}

function drawPentagram() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Limpiar el lienzo
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar las cinco líneas del pentagrama
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    let startY = 50;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(20, startY);
        ctx.lineTo(canvas.width - 20, startY);
        ctx.stroke();
        startY += 20;
    }
    
    // Dibujar la clave de Sol (simplificada como un círculo para este demo)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(40, 70, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Dibujar las notas activas
    drawPressedNotes(ctx);
}

function drawPressedNotes(ctx) {
    const noteRadius = 10;
    const noteSpacing = 40;
    const baseX = 100;
    const staffLines = [50, 70, 90, 110, 130]; // Posiciones Y de las líneas del pentagrama

    pressedNotes.forEach((note, index) => {
        const noteY = staffLines[note % staffLines.length]; // Posicionar la nota en una línea
        const noteX = baseX + (index * noteSpacing);

        // Dibujar un círculo para cada nota activa
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(noteX, noteY, noteRadius, 0, Math.PI * 2);
        ctx.fill();

        // Mostrar el número de la nota MIDI
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(note, noteX, noteY - 15);
    });
}

// Iniciar WebSocket y dibujar el pentagrama cuando la página cargue
window.onload = () => {
    setupWebSocket();
    drawPentagram();
};
