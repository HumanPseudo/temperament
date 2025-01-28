import pkg from 'midi';  // Importamos el paquete MIDI
const { Input, Output } = pkg;  // Extraemos Input y Output de 'pkg'
import { noteMode } from './src/note/note.js';

export function handleMidi() {
  const input = new Input();
  const output = new Output();
  const pressedKeys = new Set();  // Almacena las teclas presionadas

  // Contar puertos de entrada
  const countInputPorts = () => input.getPortCount();

  // Listar puertos de entrada disponibles
  const listInputPorts = () => {
    const portCount = countInputPorts();
    for (let i = 0; i < portCount; i++) {
      // Puede agregar aquí un log si es necesario
      // console.log(`Port ${i}: ${input.getPortName(i)}`);
    }
  };

  // Abrir puerto de entrada
  const openInputPort = (portNumber = 0) => {
    const portCount = countInputPorts();
    if (portCount > 0) {
      input.openPort(portNumber);
      //console.log(`Input port ${portNumber} opened.`);
    } else {
      //console.log(`No input port ${portNumber} to open.`);
    }
  };

  // Abrir puerto de salida
  const openOutputPort = (portNumber = 2) => {
    const outputPortCount = output.getPortCount();
    if (outputPortCount > portNumber) {
      output.openPort(portNumber);
      //console.log(`Output port ${portNumber} opened.`);
    } else {
      //console.log(`No output port ${portNumber} to open.`);
    }
  };

  // Manejar los mensajes MIDI
  const handleMidiMessages = () => {
    input.on('message', (deltaTime, message) => {
      const [status, note, velocity] = message;

      if (status === 144 && velocity > 0) {
        pressedKeys.add(note);
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        pressedKeys.delete(note);
      }

      // Enviar el mensaje de vuelta
      output.sendMessage(message);

      // Llamar al modo para las notas
      noteMode(deltaTime, message, pressedKeys);
    });
  };

  // Activar todos los tipos de mensaje MIDI
  const enableAllMessageTypes = () => {
    input.ignoreTypes(false, false, false);
  };

  // Cerrar puertos después de un retraso
  const closePortsAfterDelay = (delay = 1000000) => {
    setTimeout(() => {
      input.closePort();
      output.closePort();
      //console.log('MIDI ports closed.');
    }, delay);
  };

  // Ejecutar todo el flujo
  const run = () => {
    listInputPorts();
    openInputPort();
    openOutputPort();
    handleMidiMessages();
    enableAllMessageTypes();
    closePortsAfterDelay();
  };

  // Iniciar el flujo
  run();
}

// Llamada a la función
handleMidi();
