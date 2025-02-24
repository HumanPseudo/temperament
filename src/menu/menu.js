import readline from 'readline';

export default function Menu() {
    this.run = () => {
        return new Promise((resolve) => {
            console.log('=== 🎼 Menú Principal ===');
            console.log('1. Automático (detecta la tonalidad según las notas tocadas)');
            console.log('2. Sostenidos (C#, D#, F#, G#, A#)');
            console.log('3. Bemoles (Db, Eb, Gb, Ab, Bb)');
            console.log('4. Salir');

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Selecciona una opción: ', (opcion) => {
                if (opcion === '4') {
                    console.log('👋 Saliendo...');
                    rl.close();
                    process.exit();
                }

                let modo = 'automatico';
                let keySignature = [];

                switch (opcion) {
                    case '1':
                        console.log('🔍 Modo automático seleccionado.');
                        modo = 'automatico';
                        break;
                    case '2':
                        console.log('♯ Modo sostenidos seleccionado.');
                        modo = 'sostenidos';
                        keySignature = ['C#', 'D#', 'F#', 'G#', 'A#'];
                        break;
                    case '3':
                        console.log('♭ Modo bemoles seleccionado.');
                        modo = 'bemoles';
                        keySignature = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
                        break;
                    default:
                        console.log('❌ Opción no válida.');
                        rl.close();
                        process.exit();
                }

                rl.close();
                resolve({ modo, keySignature });
            });
        });
    };
}
