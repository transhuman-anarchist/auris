import { useCallback } from 'react';
import audioEngine from '../audio/AudioEngine.js';
import droneEngine from '../audio/droneEngine.js';
import useGameStore from '../store/gameStore.js';

export default function useAudio() {
  const settings = useGameStore(s => s.settings);

  const playNote = useCallback((midi, duration = 1.0) => {
    audioEngine.playNote(settings.defaultTimbre, midi, duration, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playNoteWithTimbre = useCallback((timbre, midi, duration = 1.0, volume) => {
    audioEngine.playNote(timbre, midi, duration, volume ?? settings.defaultVolume);
  }, [settings.defaultVolume]);

  const playSequence = useCallback((midiNotes, noteDuration = 0.5, gap = 0.05) => {
    audioEngine.playNoteSequence(settings.defaultTimbre, midiNotes, noteDuration, gap, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const startDrone = useCallback((midi) => {
    droneEngine.start(midi, {
      volume: settings.defaultDroneVolume,
      timbreKey: settings.defaultDroneTimbre,
    });
  }, [settings.defaultDroneVolume, settings.defaultDroneTimbre]);

  const stopDrone = useCallback(() => {
    droneEngine.stop();
  }, []);

  const playPhraseAtBPM = useCallback((midiNotes, bpm, rhythmPattern) => {
    return audioEngine.playPhraseAtBPM(settings.defaultTimbre, midiNotes, bpm, rhythmPattern, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playBend = useCallback((startMidi, targetMidi, duration, fast) => {
    audioEngine.playBend(settings.defaultTimbre, startMidi, targetMidi, fast ? 0.5 : 0.8, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playLegatoPair = useCallback((midi1, midi2, fast) => {
    audioEngine.playLegatoPair(settings.defaultTimbre, midi1, midi2, fast ? 0.6 : 1.0, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playSlide = useCallback((startMidi, endMidi, fast) => {
    audioEngine.playSlide(settings.defaultTimbre, startMidi, endMidi, fast ? 0.6 : 1.0, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playNoteWithVibrato = useCallback((midi, vibratoDirection) => {
    audioEngine.playNoteWithVibrato(settings.defaultTimbre, midi, 1.2, vibratoDirection, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playGhostNote = useCallback(() => {
    audioEngine.playGhostNote(0.08, settings.defaultVolume * 0.5);
  }, [settings.defaultVolume]);

  const playChord = useCallback((midiNotes, duration = 1.0) => {
    audioEngine.playChord(settings.defaultTimbre, midiNotes, duration, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playChordSequence = useCallback((chordsArray, chordDuration = 1.0, gap = 0.3) => {
    return audioEngine.playChordSequence(settings.defaultTimbre, chordsArray, chordDuration, gap, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const playChordProgressionAtBPM = useCallback((chordsArray, bpm) => {
    return audioEngine.playChordProgressionAtBPM(settings.defaultTimbre, chordsArray, bpm, settings.defaultVolume);
  }, [settings.defaultTimbre, settings.defaultVolume]);

  const stopAll = useCallback(() => {
    audioEngine.stopAll();
  }, []);

  const initAudio = useCallback(() => {
    audioEngine.init();
    audioEngine.resume();
  }, []);

  return {
    playNote, playNoteWithTimbre, playSequence, startDrone, stopDrone, stopAll, initAudio,
    playPhraseAtBPM, playBend, playLegatoPair, playSlide, playNoteWithVibrato, playGhostNote,
    playChord, playChordSequence, playChordProgressionAtBPM,
  };
}
