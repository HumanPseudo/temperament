# spec/pitch_spec.rb
require 'temperament/pitch'

RSpec.describe Temperament::Pitch do
  describe '#initialize' do
    it 'initializes with a valid pitch class string' do
      pitch = described_class.new('C')
      expect(pitch.integer).to eq(0)
      expect(pitch.true_notation).to eq('C')
    end

    it 'initializes with a valid pitch class integer' do
      pitch = described_class.new(13)
      expect(pitch.integer).to eq(1)  # 13 % 12 = 1
      expect(pitch.true_notation).to eq('C#')
    end

    it 'raises an error for invalid pitch class string' do
      expect { described_class.new('X') }.to raise_error(ArgumentError, 'Invalid pitch class: X')
    end

    it 'raises an error for invalid argument type' do
      expect { described_class.new(Object.new) }.to raise_error(ArgumentError, 'Invalid argument type: Object')
    end
  end

  describe '#transpose' do
    it 'transposes by a given number of semitones' do
      pitch = described_class.new('C')
      transposed = pitch.transpose(2)
      expect(transposed.true_notation).to eq('D')
    end
  end

  describe '#accidental?' do
    it 'returns true for accidental pitches' do
      pitch = described_class.new('C#')
      expect(pitch.accidental?).to be true
    end

    it 'returns false for natural pitches' do
      pitch = described_class.new('C')
      expect(pitch.accidental?).to be false
    end
  end

  describe '#semitones_above' do
    it 'calculates the semitones above another pitch' do
      pitch_a = described_class.new('C')
      pitch_b = described_class.new('D')
      expect(pitch_b.semitones_above(pitch_a)).to eq(2)
    end
  end

  describe '24 tone system' do
    it 'initializes with a valid pitch class string in 24 tone system' do
      pitch = described_class.new('C', cycle: 24)
      expect(pitch.integer).to eq(0)
      expect(pitch.true_notation).to eq('C')
    end

    it 'transposes in the 24 tone system' do
      pitch = described_class.new('C', cycle: 24)
      transposed = pitch.transpose(3)
      expect(transposed.true_notation).to eq('C##')
    end
  end
end
