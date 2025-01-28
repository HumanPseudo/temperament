import pkg from 'midi';  // Importamos el paquete MIDI
const { Input, Output } = pkg;  // Extraemos Input y Output de 'pkg'

export class MidiHandler {
  constructor() {
    this.input = new Input();
    this.output = new Output();
    this.pressedKeys = new Set();  // Almacena las teclas presionadas
  }

  countInputPorts() {
    const portCount = this.input.getPortCount();
    //console.log(`Available input ports: ${portCount}`);
    return portCount;
  }

  listInputPorts() {
    const portCount = this.countInputPorts();
    for (let i = 0; i < portCount; i++) {
      //console.log(`Port ${i}: ${this.input.getPortName(i)}`);
    }
  }

  openInputPort(portNumber = 0) {
    const portCount = this.countInputPorts();
    if (portCount > 0) {
      this.input.openPort(portNumber);
      //console.log(`Input port ${portNumber} opened.`);
    } else {
      //console.log(`No input port ${portNumber} to open.`);
    }
  }

  openOutputPort(portNumber = 2) {
    const outputPortCount = this.output.getPortCount();
    if (outputPortCount > portNumber) {
      this.output.openPort(portNumber);
      //console.log(`Output port ${portNumber} opened.`);
    } else {
      //console.log(`No output port ${portNumber} to open.`);
    }
  }

  handleMidiMessages() {
    this.input.on('message', (deltaTime, message) => {
      //console.log(`Received MIDI Message: ${message} | Delta Time: ${deltaTime}`);
      
      const [status, note, velocity] = message;

      if (status === 144 && velocity > 0) {
        this.pressedKeys.add(note);
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        this.pressedKeys.delete(note);
      }

      //console.log(`Pressed keys: ${[...this.pressedKeys].join(", ")}`);
      this.output.sendMessage(message);
    });
  }

  enableAllMessageTypes() {
    this.input.ignoreTypes(false, false, false);
  }

  closePortsAfterDelay(delay = 1000000) {
    setTimeout(() => {
      this.input.closePort();
      this.output.closePort();
      //console.log('MIDI ports closed.');
    }, delay);
  }

  run() {
    this.listInputPorts();   
    this.openInputPort();    
    this.openOutputPort();   
    this.handleMidiMessages();  
    this.enableAllMessageTypes(); 
    this.closePortsAfterDelay(); 
  }
}

// Crear una instancia de MidiHandler y ejecutar el flujo
const midiHandler = new MidiHandler();
midiHandler.run();
