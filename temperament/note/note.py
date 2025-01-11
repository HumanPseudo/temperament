# encoding=utf-8
from music21 import note as m21note

class Note:
    def __init__(self, message):
        # Unpack the MIDI message: [value, key, velocity]
        self.value, self.key, self.velocity = message

        # Convert the key to a music21 Note object
        self.key = m21note.Note(self.key)

    def __str__(self):
        # Define a string representation for the Note object
        return f"Value: {self.value}, Key: {self.key}, Velocity: {self.velocity}"

if __name__ == "__main__":
    # Create a Note instance with a sample MIDI message
    midi_note = Note([144, 60, 6])
    
    # Print the Note object (calls the __str__ method)
    print(midi_note)
    
    # Print a simple message to indicate the script name
    print("note.py")
