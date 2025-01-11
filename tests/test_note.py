import pytest
from temperament.note.note import Note

def test_normal_notes():
    # Test typical cases with valid inputs
    note = Note("C", "#", 4)
    assert str(note) == "C#4", f"Expected 'C#4', but got {str(note)}"
    note = Note("D", "b", 3)
    assert str(note) == "Db3", f"Expected 'Db3', but got {str(note)}"
    note = Note("E", "", 5)
    assert str(note) == "E5", f"Expected 'E5', but got {str(note)}"

def test_edge_octaves():
    # Test edge cases for octaves (e.g., very low or very high)
    note = Note("A", "", 0)  # Lowest practical octave
    assert str(note) == "A0", f"Expected 'A0', but got {str(note)}"
    note = Note("C", "", 8)  # Highest practical octave in many systems
    assert str(note) == "C8", f"Expected 'C8', but got {str(note)}"

def test_invalid_names():
    # Test invalid note names
    with pytest.raises(ValueError, match="Invalid note name"):
        Note("H", "", 4)  # 'H' is not a valid note name
    with pytest.raises(ValueError, match="Invalid note name"):
        Note("Z", "#", 4)  # 'Z' is not a valid note name

def test_invalid_accidentals():
    # Test invalid accidentals
    with pytest.raises(ValueError, match="Invalid accidental"):
        Note("C", "x", 4)  # 'x' is unsupported as an accidental
    with pytest.raises(ValueError, match="Invalid accidental"):
        Note("D", "!!", 3)  # Invalid accidental
    with pytest.raises(ValueError, match="Invalid accidental"):
        Note("E", "sharp", 3)  # Use '#' instead

def test_invalid_octaves():
    # Test invalid octaves
    with pytest.raises(ValueError, match="Invalid octave"):
        Note("C", "#", -1)  # Negative octave
    with pytest.raises(ValueError, match="Invalid octave"):
        Note("D", "b", 9)  # Octave too high for typical systems

def test_boundary_cases():
    # Test boundary note cases
    note = Note("C", "bb", 0)  # Double flat on lowest octave
    assert str(note) == "Cbb0", f"Expected 'Cbb0', but got {str(note)}"
    note = Note("B", "x", 8)  # Double sharp on highest octave
    assert str(note) == "Bx8", f"Expected 'Bx8', but got {str(note)}"

def test_no_accidental():
    # Test notes with no accidental
    note = Note("F", "", 4)
    assert str(note) == "F4", f"Expected 'F4', but got {str(note)}"

def test_mixed_cases():
    # Test mixed valid and invalid cases
    valid_note = Note("G", "#", 4)
    assert str(valid_note) == "G#4", f"Expected 'G#4', but got {str(valid_note)}"
    
    with pytest.raises(ValueError, match="Invalid note name"):
        Note("Q", "", 4)  # Invalid note

    with pytest.raises(ValueError, match="Invalid octave"):
        Note("A", "", 12)  # Octave out of range

    with pytest.raises(ValueError, match="Invalid accidental"):
        Note("F", "xxx", 4)  # Invalid accidental

def test_case_insensitivity():
    # Test case-insensitive note names
    note = Note("c", "#", 4)  # Lowercase name
    assert str(note) == "C#4", f"Expected 'C#4', but got {str(note)}"

def test_large_suite():
    # Test all possible notes from the JSON structure
    accidental_map = {
        "sharp": "#",
        "flat": "b",
        "double_sharp": "x",
        "double_flat": "bb",
        "natural": ""
    }
    for name in ["C", "D", "E", "F", "G", "A", "B"]:
        for accidental, symbol in accidental_map.items():
            note = Note(name, symbol, 4)
            assert str(note) == f"{name}{symbol}4", f"Failed for {name}{symbol}4"

