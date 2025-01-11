import sys
from PyQt6.QtCore import QTimer
from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton, QLabel, QVBoxLayout, QWidget
# from temperament.note.note import Note
import rtmidi

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Temperament")
        self.midiin = rtmidi.MidiIn()

        # Main layout
        self.layout = QVBoxLayout()

        self.label = QLabel("Press the button to start listening for MIDI events.")
        self.layout.addWidget(self.label)

        self.button = QPushButton("Start Listening")
        self.button.setCheckable(True)
        self.button.clicked.connect(self.toggle_midi_listening)
        self.layout.addWidget(self.button)

        # Set the central widget of the Window.
        container = QWidget()
        container.setLayout(self.layout)
        self.setCentralWidget(container)

        # MIDI setup
        self.listening = False
        self.timer = QTimer()
        self.timer.timeout.connect(self.read_midi_events)

    def toggle_midi_listening(self):
        if self.button.isChecked():
            self.start_midi_listening()
        else:
            self.stop_midi_listening()

    def start_midi_listening(self):
        available_ports = self.midiin.get_ports()
        if not available_ports:
            self.label.setText("No MIDI ports available.")
            self.button.setChecked(False)
            return

        # Open the first available port
        self.midiin.open_port(0)
        self.listening = True
        self.label.setText(f"Listening on: {available_ports[0]}.")
        self.timer.start(50)  # Poll MIDI messages every 50 ms

    def stop_midi_listening(self):
        self.listening = False
        self.timer.stop()
        self.midiin.close_port()
        self.label.setText("Stopped listening for MIDI events.")

    def read_midi_events(self):
        try:
            msg = self.midiin.get_message()
            if msg:
                message, _ = msg
                if len(message) >= 3:
                    status, midi_note, velocity = message
                    self.label.setText(f"MIDI Message: Status={status}, Note={midi_note}, Velocity={velocity}")
        except Exception as e:
            self.label.setText(f"Error: {e}")
            self.stop_midi_listening()


if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = MainWindow()
    window.show()

    app.exec()
