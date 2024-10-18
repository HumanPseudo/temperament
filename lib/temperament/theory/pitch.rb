# frozen_string_literal: true

module Temperament
  class Pitch
    attr_reader :integer, :cycle

    # Pitch class constants
    PITCH_CLASSES_12 = {
      "Cbb" => 10, "Cb"  => 11, "C"   => 0,  "C#"  => 1,  "C##" => 2,
      "Dbb" => 0,  "Db"  => 1,  "D"   => 2,  "D#"  => 3,  "D##" => 4,
      "Ebb" => 2,  "Eb"  => 3,  "E"   => 4,  "E#"  => 5,  "E##" => 6,
      "Fbb" => 3,  "Fb"  => 4,  "F"   => 5,  "F#"  => 6,  "F##" => 7,
      "Gbb" => 5,  "Gb"  => 6,  "G"   => 7,  "G#"  => 8,  "G##" => 9,
      "Abb" => 7,  "Ab"  => 8,  "A"   => 9,  "A#"  => 10, "A##" => 11,
      "Bbb" => 9,  "Bb"  => 10, "B"   => 11, "B#"  => 0,  "B##" => 1
    }.freeze

    PITCH_CLASSES_24 = {
      "C"   => 0,  "C+"  => 1,  "C#"  => 2,  "C##" => 3,
      "Db-" => 0,  "Db"  => 1,  "D"   => 2,  "D+"  => 3,
      "D#"  => 4,  "Eb-" => 5,  "Eb"  => 6,  "E"   => 7,
      "E+"  => 8,  "Fb"  => 7,  "F"   => 8,  "F+"  => 9,
      "F#"  => 10, "Gb-" => 11, "Gb"  => 12, "G"   => 13,
      "G+"  => 14, "G#"  => 15, "Ab-" => 16, "Ab"  => 17,
      "A"   => 18, "A+"  => 19, "A#"  => 20, "Bb-" => 21,
      "Bb"  => 22, "B"   => 23, "B+"  => 24
    }.freeze

    # Initialize with either a String or Integer representation of a pitch class
    def initialize(arg, cycle: 12)
      @cycle = cycle
      pitch_classes = cycle == 12 ? PITCH_CLASSES_12 : PITCH_CLASSES_24

      @integer = case arg
                 when String
                   pitch_classes[arg] || (raise ArgumentError, "Invalid pitch class: #{arg}")
                 when Integer
                   arg % cycle
                 else
                   raise ArgumentError, "Invalid argument type: #{arg.class}"
                 end

      raise ArgumentError, "Invalid pitch class: #{arg}" unless @integer
    end

    # Class method to simplify instantiation
    def self.[](arg, cycle: 12)
      new(arg, cycle: cycle)
    end

    # Get the corresponding note name or return the integer if no name exists
    def true_notation
      pitch_classes = cycle == 12 ? PITCH_CLASSES_12 : PITCH_CLASSES_24
      pitch_classes.key(integer) || integer.to_s
    end

    # Check if this pitch class contains accidentals (sharps or flats)
    def accidental?
      true_notation.include?("#") || true_notation.include?("b") || true_notation.include?("+") || true_notation.include?("-")
    end

    # Compare two pitch classes for equality
    def ==(other)
      other.is_a?(self.class) && @integer == other.integer && @cycle == other.cycle
    end

    # To string representation
    def to_s
      true_notation
    end

    # Transpose the pitch class by a number of semitones
    def transpose(semitones)
      self.class.new(integer + semitones, cycle: cycle)
    end

    # Calculate semitones above another pitch class
    def semitones_above(other)
      (integer - other.integer) % cycle
    end

    # Return the number of semitones above the pitch class
    def +(semitones)
      transpose(semitones)
    end

    # Return the number of semitones below the pitch class
    def -(semitones)
      transpose(-semitones)
    end
  end
end
