import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getExercise, CHAPTERS, getNextChapterId } from '../data/curriculum.js';
import useExercise from '../hooks/useExercise.js';
import useAudio from '../hooks/useAudio.js';
import useGameStore from '../store/gameStore.js';
import rhythmEngine from '../audio/rhythmEngine.js';
import ExerciseShell from '../components/Exercise/ExerciseShell.jsx';
import NoteGrid from '../components/Exercise/NoteGrid.jsx';
import RhythmGrid from '../components/Exercise/RhythmGrid.jsx';
import FeedbackOverlay from '../components/Exercise/FeedbackOverlay.jsx';
import RetentionTimer from '../components/Exercise/RetentionTimer.jsx';
import DroneBar from '../components/Exercise/DroneBar.jsx';
import './ExercisePage.css';

const PASS_THRESHOLD = 7;

const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
const QUALITY_IT = { major: 'Maggiore', minor: 'Minore', diminished: 'Diminuita', augmented: 'Aumentata' };
const QUALITY_SHORT = { major: 'M', minor: 'm', diminished: 'dim', augmented: 'aug' };
const INV_IT = { 0: 'Fond.', 1: '1° Riv.', 2: '2° Riv.' };

function getNextExerciseId(exerciseId) {
  if (!exerciseId) return null;
  const parts = exerciseId.split('_');
  const chapterId = parts[0];
  const chapter = CHAPTERS[chapterId];
  if (!chapter) return null;
  const keys = Object.keys(chapter.exercises);
  const idx = keys.indexOf(exerciseId);
  if (idx >= 0 && idx < keys.length - 1) return keys[idx + 1];
  return null;
}

const SEVENTH_QUALITY_IT = { maj7: 'Maj7', dom7: 'Dom7', m7: 'Min7', m7b5: 'Min7b5', dim7: 'Dim7' };
const SEVENTH_QUALITY_SHORT = { maj7: 'M7', dom7: '7', m7: 'm7', m7b5: 'ø7', dim7: 'o7' };
const INV4_IT = { 0: 'Fond.', 1: '1° Riv.', 2: '2° Riv.', 3: '3° Riv.' };

const SEQUENCE_TYPES = new Set([
  'degree_sequence', 'melodic_phrase', 'ornament_pair', 'ornament_lick',
  'chord_progression', 'chord_quality_inversion', 'chord_sequence_quality',
  'progression_bass', 'progression_soprano',
  'modal_lick', 'chromatic_tension_sequence',
  'seventh_sequence', 'seventh_quality_inversion', 'full_progression',
  'melody_over_changes', 'transcription_core',
]);

const NOTE_GRID_SEQ_TYPES = new Set([
  'degree_sequence', 'melodic_phrase', 'ornament_pair', 'ornament_lick',
  'progression_bass', 'progression_soprano',
  'modal_lick',
  'melody_over_changes', 'transcription_core',
]);

const SINGLE_DEGREE_TYPES = new Set([
  'degree_single', 'degree_direction', 'missing_degree', 'missing_from_set',
  'phrase_last_degree', 'phrase_first_degree', 'ornament_bend',
]);

const MODE_IT = {
  ionian: 'Ionico', dorian: 'Dorico', phrygian: 'Frigio', lydian: 'Lidio',
  mixolydian: 'Misolidio', aeolian: 'Eolio', locrian: 'Locrio',
};

const MINOR_SCALE_IT = {
  naturale: 'Naturale', armonica: 'Armonica', melodica: 'Melodica',
};

export default function ExercisePage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = getExercise(exerciseId);
  const {
    playNote, playSequence, startDrone, stopDrone, stopAll, initAudio,
    playPhraseAtBPM, playBend, playLegatoPair, playSlide, playNoteWithVibrato, playGhostNote,
    playChord, playChordSequence, playChordProgressionAtBPM,
  } = useAudio();

  const {
    question, feedback, phase, sessionStats, retentionCountdown,
    accuracy, stars, generateNext, startRetention, checkAnswer, dismissFeedback,
  } = useExercise(exercise);

  const [sequenceInput, setSequenceInput] = useState([]);
  const sequenceInputRef = useRef([]);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [singRevealed, setSingRevealed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Track inline setTimeout IDs so they can be cleared on rapid re-play.
  // AudioEngine.stopAll only clears its own _sequenceTimers, but playQuestionAudio
  // uses standalone setTimeout calls (e.g. the 500ms drone delay) that would
  // otherwise fire stale audio after a quick NUOVA click.
  const inlineTimersRef = useRef([]);

  const rootMidi = 60;

  const nextExerciseId = useMemo(() => getNextExerciseId(exerciseId), [exerciseId]);

  useEffect(() => {
    setHasPlayed(false);
    setExerciseComplete(false);
    setSequenceInput([]);
    sequenceInputRef.current = [];
    setSingRevealed(false);
    setIsRecording(false);
    setRecordedAudioUrl(null);
  }, [exerciseId]);

  useEffect(() => {
    return () => {
      stopDrone();
      stopAll();
      rhythmEngine.stop();
      inlineTimersRef.current.forEach(id => clearTimeout(id));
      inlineTimersRef.current = [];
    };
  }, [stopDrone, stopAll]);

  useEffect(() => {
    if (exercise?.type === 'listen_only') return;
    if (sessionStats.correct >= PASS_THRESHOLD && !exerciseComplete) {
      setExerciseComplete(true);
      const store = useGameStore.getState();
      if (nextExerciseId) {
        store.unlockExercise(nextExerciseId);
      } else if (exercise?.chapterId) {
        const nextChId = getNextChapterId(exercise.chapterId);
        if (nextChId) {
          store.unlockChapter(String(nextChId));
          const nextChapter = CHAPTERS[nextChId];
          if (nextChapter) {
            const firstExId = Object.keys(nextChapter.exercises)[0];
            if (firstExId) store.unlockExercise(firstExId);
          }
        }
      }
    }
  }, [sessionStats.correct, exerciseComplete, nextExerciseId, exercise]);

  // Persist chapter stats (stars, accuracy) to the game store whenever they improve
  useEffect(() => {
    if (!exercise?.chapterId || exercise.type === 'listen_only') return;
    if (sessionStats.total < 1) return;
    const store = useGameStore.getState();
    store.updateChapterStats(String(exercise.chapterId), { accuracy, stars });
  }, [stars, accuracy, sessionStats.total, exercise]);

  const handleListenComplete = useCallback(() => {
    if (exercise?.type !== 'listen_only') return;
    if (!exerciseComplete) {
      setExerciseComplete(true);
      const store = useGameStore.getState();
      if (nextExerciseId) {
        store.unlockExercise(nextExerciseId);
      } else if (exercise?.chapterId) {
        const nextChId = getNextChapterId(exercise.chapterId);
        if (nextChId) {
          store.unlockChapter(String(nextChId));
          const nextChapter = CHAPTERS[nextChId];
          if (nextChapter) {
            const firstExId = Object.keys(nextChapter.exercises)[0];
            if (firstExId) store.unlockExercise(firstExId);
          }
        }
      }
    }
  }, [exercise, exerciseComplete, nextExerciseId]);

  // Helper: clears all inline timers from a previous playQuestionAudio call.
  const clearInlineTimers = useCallback(() => {
    inlineTimersRef.current.forEach(id => clearTimeout(id));
    inlineTimersRef.current = [];
  }, []);

  const playQuestionAudio = useCallback((q) => {
    if (!q) return;

    // Track setTimeout calls so stopAll / rapid re-play can cancel them
    const later = (fn, ms) => {
      const id = setTimeout(fn, ms);
      inlineTimersRef.current.push(id);
      return id;
    };

    const playPhraseNotes = (midiNotes, bpm, rhythm) => {
      if (bpm) {
        const totalSec = playPhraseAtBPM(midiNotes, bpm, rhythm);
        return totalSec * 1000;
      }
      playSequence(midiNotes, 0.6, 0.1);
      return midiNotes.length * 0.7 * 1000;
    };

    switch (q.type) {
      case 'listen_only':
        // Start drone so the user hears the scale relative to the tonal center
        startDrone(rootMidi);
        later(() => {
          playSequence(q.midiNotes, 0.5, 0.05);
          handleListenComplete();
        }, 500);
        break;

      case 'sing_degree':
        startDrone(rootMidi);
        break;

      case 'degree_single':
      case 'degree_direction':
        startDrone(rootMidi);
        later(() => playNote(q.noteMidi, 1.0), 500);
        break;

      case 'degree_sequence':
        startDrone(rootMidi);
        later(() => {
          playSequence(q.midiNotes, 0.6, 0.1);
          if (exercise?.retention > 0) {
            const ms = q.midiNotes.length * 0.7 * 1000;
            later(() => startRetention(), ms);
          }
        }, 500);
        break;

      case 'binary':
        startDrone(rootMidi);
        later(() => playNote(q.noteMidi, 1.0), 500);
        break;

      case 'missing_degree':
      case 'missing_from_set':
        startDrone(rootMidi);
        later(() => playSequence(q.midiNotes, 0.4, 0.08), 500);
        break;

      case 'minor_compare':
        startDrone(rootMidi);
        later(() => playNote(q.noteMidi, 1.0), 500);
        break;

      case 'major_minor_id':
        playSequence(q.midiNotes, 0.4, 0.05);
        break;

      // ─── MONDO II types ──────────────────────────────────

      case 'melodic_phrase':
        startDrone(rootMidi);
        later(() => {
          const ms = playPhraseNotes(q.midiNotes, q.bpm, q.rhythm);
          if (exercise?.retention > 0) {
            later(() => startRetention(), ms);
          }
        }, 500);
        break;

      case 'phrase_direction':
      case 'phrase_last_degree':
      case 'phrase_first_degree':
        startDrone(rootMidi);
        later(() => {
          if (q.bpm) playPhraseAtBPM(q.midiNotes, q.bpm, q.rhythm);
          else playSequence(q.midiNotes, 0.6, 0.1);
        }, 500);
        break;

      case 'phrase_compare':
        startDrone(rootMidi);
        later(() => {
          playSequence(q.midiNotes1, 0.6, 0.1);
          const gap1 = q.midiNotes1.length * 0.7 * 1000 + 800;
          later(() => playSequence(q.midiNotes2, 0.6, 0.1), gap1);
        }, 500);
        break;

      case 'phrase_diff':
        startDrone(rootMidi);
        later(() => {
          playSequence(q.midiNotes1, 0.6, 0.1);
          const gap1 = q.midiNotes1.length * 0.7 * 1000 + 800;
          later(() => playSequence(q.midiNotes2, 0.6, 0.1), gap1);
        }, 500);
        break;

      case 'pentatonic_id':
        startDrone(rootMidi);
        later(() => playSequence(q.midiNotes, 0.5, 0.08), 500);
        break;

      case 'ornament_bend':
        startDrone(rootMidi);
        later(() => playBend(q.startMidi, q.targetMidi, null, q.fast), 500);
        break;

      case 'ornament_pair':
        startDrone(rootMidi);
        later(() => {
          if (q.ornamentType === 'slide') {
            playSlide(q.midiNotes[0], q.midiNotes[1], q.fast);
          } else {
            playLegatoPair(q.midiNotes[0], q.midiNotes[1], q.fast);
          }
        }, 500);
        break;

      case 'ornament_vibrato':
        startDrone(rootMidi);
        later(() => playNoteWithVibrato(q.noteMidi, q.vibratoDirection), 500);
        break;

      case 'ornament_ghost': {
        startDrone(rootMidi);
        later(() => {
          const beatMs = 600;
          q.midiNotes.forEach((midi, i) => {
            const delay = i * beatMs;
            if (i + 1 === q.ghostPosition) {
              later(() => playGhostNote(), delay);
            } else {
              later(() => playNote(midi, 0.5), delay);
            }
          });
        }, 500);
        break;
      }

      case 'ornament_lick': {
        startDrone(rootMidi);
        const bpm = q.bpm || 60;
        later(() => {
          const beatMs = (60 / bpm) * 1000;
          q.midiNotes.forEach((midi, i) => {
            const delay = i * beatMs;
            if (q.ornamentPositions.includes(i) && i + 1 < q.midiNotes.length) {
              later(() => playLegatoPair(midi, q.midiNotes[i + 1], false), delay);
            } else if (!q.ornamentPositions.includes(i - 1)) {
              later(() => playNote(midi, beatMs / 1000 * 0.9), delay);
            }
          });
        }, 500);
        break;
      }

      // ─── MONDO III types ──────────────────────────────────

      case 'chord_quality':
      case 'chord_inversion':
      case 'chord_degree':
      case 'chord_degree_confirm':
        startDrone(rootMidi);
        later(() => {
          playChord(q.chordMidi, 1.5);
          if (exercise?.retention > 0) {
            later(() => startRetention(), 1600);
          }
        }, 500);
        break;

      case 'chord_quality_inversion':
        startDrone(rootMidi);
        later(() => playChord(q.chordMidi, 2.0), 500);
        break;

      case 'chord_sequence_quality':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.2, 0.5), 500);
        break;

      case 'chord_progression': {
        startDrone(rootMidi);
        later(() => {
          let totalMs;
          if (q.bpm) {
            totalMs = playChordProgressionAtBPM(q.chordsMidi, q.bpm) * 1000;
          } else {
            totalMs = playChordSequence(q.chordsMidi, 1.2, 0.5) * 1000;
          }
          if (exercise?.retention > 0) {
            later(() => startRetention(), totalMs);
          }
        }, 500);
        break;
      }

      case 'progression_resolution':
      case 'progression_bass':
      case 'progression_soprano':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.2, 0.5), 500);
        break;

      case 'cadence_type':
        startDrone(rootMidi);
        later(() => {
          if (q.bpm) {
            playChordProgressionAtBPM(q.chordsMidi, q.bpm);
          } else {
            playChordSequence(q.chordsMidi, 1.5, 0.5);
          }
        }, 500);
        break;

      case 'cadence_in_progression':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.2, 0.4), 500);
        break;

      // ─── MONDO IV types ──────────────────────────────────

      case 'minor_scale_id':
      case 'mode_id':
        startDrone(rootMidi);
        later(() => playSequence(q.midiNotes, 0.4, 0.06), 500);
        break;

      case 'chromatic_tension':
        startDrone(rootMidi);
        later(() => {
          playNote(q.noteMidi, 1.0);
          if (exercise?.retention > 0) {
            later(() => startRetention(), 1100);
          }
        }, 500);
        break;

      case 'chromatic_tension_sequence':
        startDrone(rootMidi);
        later(() => {
          playSequence(q.midiNotes, 0.6, 0.15);
          if (exercise?.retention > 0) {
            const ms = q.midiNotes.length * 0.75 * 1000;
            later(() => startRetention(), ms);
          }
        }, 500);
        break;

      case 'modal_lick': {
        startDrone(rootMidi);
        const lickBpm = q.bpm || 60;
        later(() => {
          const totalSec = playPhraseAtBPM(q.midiNotes, lickBpm, q.rhythm);
          if (exercise?.retention > 0) {
            later(() => startRetention(), totalSec * 1000);
          }
        }, 500);
        break;
      }

      case 'modal_lick_id':
        startDrone(rootMidi);
        later(() => {
          if (q.bpm) playPhraseAtBPM(q.midiNotes, q.bpm, null);
          else playSequence(q.midiNotes, 0.5, 0.08);
        }, 500);
        break;

      // ─── MONDO V types ──────────────────────────────────

      case 'seventh_quality':
      case 'seventh_inversion':
      case 'seventh_degree':
        startDrone(rootMidi);
        later(() => {
          playChord(q.chordMidi, 2.0);
          if (exercise?.retention > 0) {
            later(() => startRetention(), 2100);
          }
        }, 500);
        break;

      case 'seventh_quality_inversion':
        startDrone(rootMidi);
        later(() => playChord(q.chordMidi, 2.5), 500);
        break;

      case 'seventh_sequence':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.5, 0.5), 500);
        break;

      case 'seventh_voice_id':
        startDrone(rootMidi);
        later(() => {
          playChord(q.chordMidi, 1.5);
          later(() => playNote(q.voiceMidi, 1.0), 2000);
        }, 500);
        break;

      case 'bass_movement':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.5, 0.5), 500);
        break;

      case 'ii_v_i_confirm':
      case 'ii_v_i_vs_I_IV_V':
      case 'ii_v_i_resolution':
      case 'tritone_sub':
      case 'borrowed_chord':
        startDrone(rootMidi);
        later(() => {
          const totalMs = playChordSequence(q.chordsMidi, 1.5, 0.5) * 1000;
          if (exercise?.retention > 0) {
            later(() => startRetention(), totalMs);
          }
        }, 500);
        break;

      case 'ii_v_open':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 2.0, 0.5), 500);
        break;

      case 'ii_v_i_secondary':
      case 'secondary_dominant':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.5, 0.4), 500);
        break;

      case 'ii_v_i_chain':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.2, 0.3), 500);
        break;

      case 'chromatic_passing':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.5, 0.4), 500);
        break;

      case 'substitution_spot':
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.2, 0.4), 500);
        break;

      case 'full_progression': {
        startDrone(rootMidi);
        later(() => {
          let totalMs;
          if (q.bpm) {
            totalMs = playChordProgressionAtBPM(q.chordsMidi, q.bpm) * 1000;
          } else {
            totalMs = playChordSequence(q.chordsMidi, 1.2, 0.4) * 1000;
          }
          if (exercise?.retention > 0) {
            later(() => startRetention(), totalMs);
          }
        }, 500);
        break;
      }

      // ─── MONDO VI types ──────────────────────────────────

      case 'rhythm_duration': {
        rhythmEngine.stop();
        later(() => {
          rhythmEngine.playDurationNote(q.midi, q.durationBeats, q.bpm);
        }, 200);
        break;
      }

      case 'rhythm_count': {
        rhythmEngine.stop();
        later(() => {
          rhythmEngine.playCountNotes(q.correctAnswer, q.bpm);
        }, 200);
        break;
      }

      case 'rhythm_grid': {
        rhythmEngine.stop();
        later(() => {
          const totalSec = rhythmEngine.playGridPattern(q.grid, {
            bpm: q.bpm,
            beatsPerMeasure: q.beatsPerMeasure,
            subdivisionsPerBeat: q.subdivisionsPerBeat,
            midi: q.midi,
          });
          if (exercise?.retention > 0) {
            later(() => startRetention(), totalSec * 1000);
          }
        }, 200);
        break;
      }

      case 'rhythm_syncopation': {
        rhythmEngine.stop();
        later(() => {
          rhythmEngine.playGridPattern(q.grid, {
            bpm: q.bpm,
            beatsPerMeasure: q.beatsPerMeasure,
            subdivisionsPerBeat: q.subdivisionsPerBeat,
            midi: q.midi,
          });
        }, 200);
        break;
      }

      case 'rhythm_ghost_pattern': {
        rhythmEngine.stop();
        initAudio();
        later(() => {
          const beatDur = 60 / q.bpm / 2;
          q.grid.forEach((hit, i) => {
            later(() => {
              if (hit === 1) playNote(q.midi, beatDur * 0.7);
              else if (hit === 0.5) playGhostNote();
            }, i * beatDur * 1000);
          });
        }, 200);
        break;
      }

      case 'meter_id': {
        rhythmEngine.stop();
        later(() => {
          rhythmEngine.playMetronomeGrouped(q.bpm, q.grouping, q.measures);
        }, 200);
        break;
      }

      case 'meter_grouping': {
        rhythmEngine.stop();
        later(() => {
          rhythmEngine.playMetronomeGrouped(q.bpm, q.grouping, q.measures);
        }, 200);
        break;
      }

      case 'polyrhythm_id':
      case 'polyrhythm_count': {
        rhythmEngine.stop();
        later(() => {
          rhythmEngine.playPolyrhythm(q.voice1Beats, q.voice2Beats, q.cycleDuration);
        }, 200);
        break;
      }

      // ─── MONDO VII types ──────────────────────────────────

      case 'melody_over_changes': {
        startDrone(rootMidi);
        later(() => {
          const beatMs = (60 / q.bpm) * 1000;
          let noteIdx = 0;
          q.chordsMidi.forEach((chord, chordIdx) => {
            const chordDelay = chordIdx * q.notesPerChord * beatMs;
            later(() => playChord(chord, q.notesPerChord * beatMs / 1000 * 0.9), chordDelay);
            for (let i = 0; i < q.notesPerChord && noteIdx < q.midiNotes.length; i++, noteIdx++) {
              const noteDelay = chordDelay + i * beatMs;
              const midi = q.midiNotes[noteIdx];
              later(() => playNote(midi, beatMs / 1000 * 0.8), noteDelay);
            }
          });
          if (exercise?.retention > 0) {
            const totalMs = q.midiNotes.length * beatMs;
            later(() => startRetention(), totalMs);
          }
        }, 500);
        break;
      }

      case 'transcription_core': {
        startDrone(rootMidi);
        later(() => {
          const totalSec = playPhraseAtBPM(q.midiNotes, q.bpm, null);
          if (exercise?.retention > 0) {
            later(() => startRetention(), totalSec * 1000);
          }
        }, 500);
        break;
      }

      case 'phrase_relation': {
        startDrone(rootMidi);
        later(() => {
          playSequence(q.midiNotes1, 0.6, 0.1);
          const gap = q.midiNotes1.length * 0.7 * 1000 + 1000;
          later(() => playSequence(q.midiNotes2, 0.6, 0.1), gap);
        }, 500);
        break;
      }

      case 'improv_guided': {
        startDrone(rootMidi);
        later(() => {
          if (q.bpm) {
            playChordProgressionAtBPM(q.chordsMidi, q.bpm);
          } else {
            playChordSequence(q.chordsMidi, 1.5, 0.5);
          }
        }, 500);
        break;
      }

      case 'improv_record': {
        startDrone(rootMidi);
        later(() => {
          if (q.bpm) {
            playChordProgressionAtBPM(q.chordsMidi, q.bpm);
          } else {
            playChordSequence(q.chordsMidi, 1.5, 0.5);
          }
        }, 500);
        break;
      }

      case 'call_response': {
        startDrone(rootMidi);
        later(() => {
          if (q.bpm) playPhraseAtBPM(q.midiNotes, q.bpm, null);
          else playSequence(q.midiNotes, 0.6, 0.1);
        }, 500);
        break;
      }

      case 'intonation_sing': {
        startDrone(rootMidi);
        later(() => playNote(q.referenceMidi, 1.5), 500);
        break;
      }

      case 'intonation_scale': {
        startDrone(rootMidi);
        break;
      }

      case 'intonation_arpeggio': {
        startDrone(rootMidi);
        later(() => playChordSequence(q.chordsMidi, 1.5, 0.5), 500);
        break;
      }

      default:
        break;
    }
  }, [playNote, playSequence, startDrone, playPhraseAtBPM, playBend, playLegatoPair, playSlide, playNoteWithVibrato, playGhostNote, playChord, playChordSequence, playChordProgressionAtBPM, exercise, rootMidi, startRetention, handleListenComplete]);

  const handlePlay = useCallback(() => {
    initAudio();
    stopAll();
    rhythmEngine.stop();
    clearInlineTimers();
    const q = generateNext();
    setSequenceInput([]);
    sequenceInputRef.current = [];
    setHasPlayed(true);
    setSingRevealed(false);
    playQuestionAudio(q);
  }, [generateNext, stopAll, clearInlineTimers, initAudio, playQuestionAudio]);

  const handleReplay = useCallback(() => {
    if (!question) return;
    if (question.type === 'sing_degree') return;
    stopAll();
    rhythmEngine.stop();
    clearInlineTimers();
    playQuestionAudio(question);
  }, [question, stopAll, clearInlineTimers, playQuestionAudio]);

  const handleDegreeSelect = useCallback((degree) => {
    if (phase !== 'answering') return;

    if (SEQUENCE_TYPES.has(question?.type)) {
      const updated = [...sequenceInputRef.current, degree];
      sequenceInputRef.current = updated;
      setSequenceInput(updated);
      const targetLen = question.correctDegrees?.length || question.correctBass?.length || question.correctSoprano?.length || question.correctAnswers?.length || question.length || 2;
      if (updated.length >= targetLen) {
        checkAnswer(updated);
      }
    } else {
      checkAnswer(degree);
    }
  }, [phase, question, checkAnswer]);

  const handleBinaryAnswer = useCallback((answer) => {
    if (phase !== 'answering') return;
    checkAnswer(answer);
  }, [phase, checkAnswer]);

  const handleSingReveal = useCallback(() => {
    if (!question) return;
    playNote(question.noteMidi, 1.0);
    setSingRevealed(true);
  }, [question, playNote]);

  const handleSingSelfAssess = useCallback((correct) => {
    if (phase !== 'answering') return;
    checkAnswer(correct ? 'correct' : 'wrong');
  }, [phase, checkAnswer]);

  const handleFeedbackDismiss = useCallback(() => {
    dismissFeedback();
  }, [dismissFeedback]);

  const handleSelfAssess = useCallback((correct) => {
    if (phase !== 'answering') return;
    checkAnswer(correct ? 'correct' : 'wrong');
  }, [phase, checkAnswer]);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (e) {
      // Microphone not available — skip silently
    }
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handlePlayRecording = useCallback(() => {
    if (recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      audio.play();
    }
  }, [recordedAudioUrl]);

  const handleUndoSequence = useCallback(() => {
    setSequenceInput(prev => {
      const updated = prev.slice(0, -1);
      sequenceInputRef.current = updated;
      return updated;
    });
  }, []);

  if (!exercise) {
    return (
      <div className="exercise-page-missing">
        <Link to="/" className="back-link">← Mappa</Link>
        <p>Esercizio non trovato.</p>
      </div>
    );
  }

  const pool = exercise.pool || [1, 2, 3, 4, 5, 6, 7];
  const scaleType = exercise.scaleType || 'major';
  const seqLength = question?.correctDegrees?.length || question?.correctBass?.length || question?.correctSoprano?.length || question?.correctAnswers?.length || question?.length || exercise.length || 2;

  return (
    <ExerciseShell exercise={exercise} sessionStats={sessionStats} stars={stars}>

      {exerciseComplete && exercise.type !== 'listen_only' && (
        <div className="exercise-passed">
          <div className="passed-badge">SUPERATO</div>
          <p className="passed-text">
            {PASS_THRESHOLD} risposte corrette raggiunte!
          </p>
          {nextExerciseId ? (
            <button className="play-btn" onClick={() => navigate(`/exercise/${nextExerciseId}`)}>
              Esercizio successivo →
            </button>
          ) : (
            <Link to={`/chapter/${exercise.chapterId}`} className="play-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
              Torna al capitolo
            </Link>
          )}
          <p className="passed-hint">Puoi continuare a praticare sotto.</p>
        </div>
      )}

      <DroneBar rootMidi={rootMidi} />

      <div className="exercise-controls">
        <button className="play-btn" onClick={handlePlay} aria-label="Nuova domanda">
          {!hasPlayed ? '▶ INIZIA' : '▶ NUOVA'}
        </button>
        {hasPlayed && question && phase !== 'feedback' && question.type !== 'sing_degree' && (
          <button className="play-btn" onClick={handleReplay} aria-label="Ripeti">
            ↻ RIPETI
          </button>
        )}
      </div>

      {!exerciseComplete && exercise.type !== 'listen_only' && (
        <div className="progress-bar-mini">
          <div className="progress-bar-mini-track">
            <div
              className="progress-bar-mini-fill"
              style={{ width: `${Math.min((sessionStats.correct / PASS_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
          <span className="progress-bar-mini-label mono">
            {sessionStats.correct} / {PASS_THRESHOLD} corrette
          </span>
        </div>
      )}

      {phase === 'retention' && (
        <RetentionTimer seconds={retentionCountdown} />
      )}

      {phase === 'answering' && question && (
        <>
          {/* Single degree answer types */}
          {SINGLE_DEGREE_TYPES.has(question.type) && (
            <NoteGrid
              pool={pool}
              scaleType={scaleType}
              onSelect={handleDegreeSelect}
              highlightCorrect={feedback?.correct ? feedback.correctAnswer : null}
              highlightWrong={!feedback?.correct && feedback ? feedback.userAnswer : null}
            />
          )}

          {/* Sing degree */}
          {question.type === 'sing_degree' && (
            <div className="sing-degree-section">
              <p className="sing-prompt">Canta il grado <span className="mono text-gold">{question.correctDegree}</span></p>
              {!singRevealed ? (
                <button className="play-btn" onClick={handleSingReveal}>
                  Ascolta la risposta
                </button>
              ) : (
                <div className="binary-buttons">
                  <button className="binary-btn" onClick={() => handleSingSelfAssess(true)}>
                    ✓ Corretto
                  </button>
                  <button className="binary-btn" onClick={() => handleSingSelfAssess(false)}>
                    ✗ Sbagliato
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sequence input types */}
          {SEQUENCE_TYPES.has(question.type) && (
            <div className="sequence-input">
              {(question.type === 'progression_bass' || question.type === 'progression_soprano') && (
                <p className="position-prompt">
                  {question.type === 'progression_bass' ? 'Trascrivi il basso di ogni accordo' : 'Trascrivi la voce superiore'}
                </p>
              )}
              <div className="sequence-display">
                {Array.from({ length: seqLength }).map((_, i) => {
                  let display = sequenceInput[i];
                  if (display != null) {
                    if (question.type === 'chord_progression' || question.type === 'full_progression') display = ROMAN[display] || display;
                    else if (question.type === 'chord_sequence_quality') display = QUALITY_SHORT[display] || display;
                    else if (question.type === 'chord_quality_inversion') display = (i === 0 ? QUALITY_SHORT[display] : INV_IT[display]) || display;
                    else if (question.type === 'seventh_sequence') display = SEVENTH_QUALITY_SHORT[display] || display;
                    else if (question.type === 'seventh_quality_inversion') display = (i === 0 ? SEVENTH_QUALITY_SHORT[display] : INV4_IT[display]) || display;
                  }
                  return (
                    <div key={i} className={`sequence-slot ${i < sequenceInput.length ? 'filled' : ''}`}>
                      {display != null && <span className="mono">{display}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Regular NoteGrid for degree-based sequences */}
              {NOTE_GRID_SEQ_TYPES.has(question.type) && (
                <NoteGrid pool={question.type === 'progression_bass' || question.type === 'progression_soprano' ? [1,2,3,4,5,6,7] : pool} scaleType={scaleType} onSelect={handleDegreeSelect} />
              )}

              {/* Roman numeral grid for chord progression */}
              {(question.type === 'chord_progression' || question.type === 'full_progression') && (
                <div className="note-grid">
                  {(question.pool || [1,2,3,4,5,6,7]).map(degree => (
                    <button key={degree} className="note-btn" onClick={() => handleDegreeSelect(degree)}>
                      <span className="note-degree mono">{ROMAN[degree]}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quality buttons for chord_sequence_quality */}
              {question.type === 'chord_sequence_quality' && (
                <div className="chord-choice-buttons">
                  {(question.qualityPool || ['major', 'minor']).map(q => (
                    <button key={q} className="binary-btn" onClick={() => handleDegreeSelect(q)}>
                      {QUALITY_IT[q]}
                    </button>
                  ))}
                </div>
              )}

              {/* Two-step: quality then inversion */}
              {question.type === 'chord_quality_inversion' && (
                <>
                  {sequenceInput.length === 0 && (
                    <div className="chord-choice-buttons">
                      {(question.qualityPool || ['major', 'minor', 'diminished', 'augmented']).map(q => (
                        <button key={q} className="binary-btn" onClick={() => handleDegreeSelect(q)}>
                          {QUALITY_IT[q]}
                        </button>
                      ))}
                    </div>
                  )}
                  {sequenceInput.length === 1 && (
                    <div className="chord-choice-buttons">
                      <button className="binary-btn" onClick={() => handleDegreeSelect(0)}>Fondamentale</button>
                      <button className="binary-btn" onClick={() => handleDegreeSelect(1)}>1° Rivolto</button>
                      <button className="binary-btn" onClick={() => handleDegreeSelect(2)}>2° Rivolto</button>
                    </div>
                  )}
                </>
              )}

              {sequenceInput.length > 0 && (
                <div className="sequence-actions">
                  <button onClick={handleUndoSequence} aria-label="Annulla">← Annulla</button>
                </div>
              )}
            </div>
          )}

          {/* Binary: sopra/sotto */}
          {question.type === 'binary' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('sopra')}>Sopra</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('sotto')}>Sotto</button>
            </div>
          )}

          {/* Minor compare */}
          {question.type === 'minor_compare' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('major')}>
                {question.majorLabel}
              </button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('minor')}>
                {question.minorLabel}
              </button>
            </div>
          )}

          {/* Major/minor ID */}
          {question.type === 'major_minor_id' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('maggiore')}>Maggiore</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('minore')}>Minore</button>
            </div>
          )}

          {/* Phrase direction */}
          {question.type === 'phrase_direction' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('ascendente')}>Ascendente</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('discendente')}>Discendente</button>
            </div>
          )}

          {/* Phrase compare */}
          {question.type === 'phrase_compare' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('uguale')}>Uguale</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('diversa')}>Diversa</button>
            </div>
          )}

          {/* Phrase diff position */}
          {question.type === 'phrase_diff' && (
            <div className="position-buttons">
              <p className="position-prompt">In quale posizione differiscono?</p>
              <div className="binary-buttons">
                {Array.from({ length: question.length }).map((_, i) => (
                  <button key={i} className="binary-btn" onClick={() => handleBinaryAnswer(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pentatonic ID */}
          {question.type === 'pentatonic_id' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('maggiore')}>Maggiore</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('minore')}>Minore</button>
            </div>
          )}

          {/* Ornament vibrato */}
          {question.type === 'ornament_vibrato' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('sopra')}>Sopra</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('sotto')}>Sotto</button>
            </div>
          )}

          {/* Ornament ghost note position */}
          {question.type === 'ornament_ghost' && (
            <div className="position-buttons">
              <p className="position-prompt">In quale posizione si trova la ghost note?</p>
              <div className="binary-buttons">
                {Array.from({ length: question.length }).map((_, i) => (
                  <button key={i} className="binary-btn" onClick={() => handleBinaryAnswer(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── MONDO III answer UIs ─────────────────────────── */}

          {/* Chord quality (binary or multi-choice) */}
          {question.type === 'chord_quality' && (
            <div className="chord-choice-buttons">
              {question.qualityPool.map(q => (
                <button key={q} className="binary-btn" onClick={() => handleBinaryAnswer(q)}>
                  {QUALITY_IT[q]}
                </button>
              ))}
            </div>
          )}

          {/* Chord inversion */}
          {question.type === 'chord_inversion' && (
            <div className="chord-choice-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer(0)}>Fondamentale</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer(1)}>1° Rivolto</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer(2)}>2° Rivolto</button>
            </div>
          )}

          {/* Chord degree (Roman numeral grid) */}
          {question.type === 'chord_degree' && (
            <div className="note-grid">
              {(question.pool || [1,2,3,4,5,6,7]).map(degree => (
                <button key={degree} className="note-btn" onClick={() => handleDegreeSelect(degree)}>
                  <span className="note-degree mono">{ROMAN[degree]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Chord degree confirm (sì/no) */}
          {question.type === 'chord_degree_confirm' && (
            <div className="position-buttons">
              <p className="position-prompt">
                La triade è del grado <span className="mono" style={{ color: 'var(--gold)', fontSize: '1.3rem' }}>{ROMAN[question.askedDegree]}</span>?
              </p>
              <div className="binary-buttons">
                <button className="binary-btn" onClick={() => handleBinaryAnswer('sì')}>Sì</button>
                <button className="binary-btn" onClick={() => handleBinaryAnswer('no')}>No</button>
              </div>
            </div>
          )}

          {/* Progression resolution */}
          {question.type === 'progression_resolution' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('risolve')}>Risolve (I)</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('sospesa')}>Sospesa (V)</button>
            </div>
          )}

          {/* Cadence type */}
          {(question.type === 'cadence_type' || question.type === 'cadence_in_progression') && (
            <div className="chord-choice-buttons">
              {question.cadencePool.map(c => (
                <button key={c} className="binary-btn" onClick={() => handleBinaryAnswer(c)}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* ─── MONDO IV answer UIs ─────────────────────────── */}

          {/* Minor scale ID */}
          {question.type === 'minor_scale_id' && (
            <div className="chord-choice-buttons">
              {question.scalePool.map(s => (
                <button key={s} className="binary-btn" onClick={() => handleBinaryAnswer(s)}>
                  {MINOR_SCALE_IT[s] || s}
                </button>
              ))}
            </div>
          )}

          {/* Mode ID */}
          {question.type === 'mode_id' && (
            <div className="chord-choice-buttons">
              {question.modePool.map(m => (
                <button key={m} className="binary-btn" onClick={() => handleBinaryAnswer(m)}>
                  {MODE_IT[m] || m}
                </button>
              ))}
            </div>
          )}

          {/* Chromatic tension (single) */}
          {question.type === 'chromatic_tension' && (
            <div className="chord-choice-buttons">
              {question.tensionPool.map(t => (
                <button key={t} className="binary-btn" onClick={() => handleBinaryAnswer(t)}>
                  <span className="mono">{t}</span>
                </button>
              ))}
            </div>
          )}

          {/* Chromatic tension sequence */}
          {question.type === 'chromatic_tension_sequence' && (
            <div className="chord-choice-buttons">
              {question.tensionPool.map(t => (
                <button key={t} className="binary-btn" onClick={() => handleDegreeSelect(t)}>
                  <span className="mono">{t}</span>
                </button>
              ))}
            </div>
          )}

          {/* Modal lick ID */}
          {question.type === 'modal_lick_id' && (
            <div className="chord-choice-buttons">
              {question.modePool.map(m => (
                <button key={m} className="binary-btn" onClick={() => handleBinaryAnswer(m)}>
                  {MODE_IT[m] || m}
                </button>
              ))}
            </div>
          )}

          {/* ─── MONDO V answer UIs ─────────────────────────── */}

          {/* Seventh chord quality */}
          {question.type === 'seventh_quality' && (
            <div className="chord-choice-buttons">
              {question.qualityPool.map(q => (
                <button key={q} className="binary-btn" onClick={() => handleBinaryAnswer(q)}>
                  {SEVENTH_QUALITY_IT[q]}
                </button>
              ))}
            </div>
          )}

          {/* Seventh chord inversion */}
          {question.type === 'seventh_inversion' && (
            <div className="chord-choice-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer(0)}>Fondamentale</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer(1)}>1° Rivolto</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer(2)}>2° Rivolto</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer(3)}>3° Rivolto</button>
            </div>
          )}

          {/* Seventh chord quality + inversion (two-step sequence) */}
          {question.type === 'seventh_quality_inversion' && (
            <>
              {sequenceInput.length === 0 && (
                <div className="chord-choice-buttons">
                  {(question.qualityPool || ['maj7', 'dom7', 'm7', 'm7b5', 'dim7']).map(q => (
                    <button key={q} className="binary-btn" onClick={() => handleDegreeSelect(q)}>
                      {SEVENTH_QUALITY_IT[q]}
                    </button>
                  ))}
                </div>
              )}
              {sequenceInput.length === 1 && (
                <div className="chord-choice-buttons">
                  <button className="binary-btn" onClick={() => handleDegreeSelect(0)}>Fondamentale</button>
                  <button className="binary-btn" onClick={() => handleDegreeSelect(1)}>1° Rivolto</button>
                  <button className="binary-btn" onClick={() => handleDegreeSelect(2)}>2° Rivolto</button>
                  <button className="binary-btn" onClick={() => handleDegreeSelect(3)}>3° Rivolto</button>
                </div>
              )}
            </>
          )}

          {/* Seventh chord sequence */}
          {question.type === 'seventh_sequence' && (
            <div className="chord-choice-buttons">
              {(question.qualityPool || ['maj7', 'dom7', 'm7', 'm7b5', 'dim7']).map(q => (
                <button key={q} className="binary-btn" onClick={() => handleDegreeSelect(q)}>
                  {SEVENTH_QUALITY_IT[q]}
                </button>
              ))}
            </div>
          )}

          {/* Seventh chord degree (Roman numerals) */}
          {question.type === 'seventh_degree' && (
            <div className="note-grid">
              {(question.pool || [1,2,3,4,5,6,7]).map(degree => (
                <button key={degree} className="note-btn" onClick={() => handleDegreeSelect(degree)}>
                  <span className="note-degree mono">{ROMAN[degree]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Seventh voice ID */}
          {question.type === 'seventh_voice_id' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('terza')}>Terza</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('settima')}>Settima</button>
            </div>
          )}

          {/* Bass movement */}
          {question.type === 'bass_movement' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('grado')}>Grado congiunto</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('salto')}>Salto</button>
            </div>
          )}

          {/* ii-V-I confirm */}
          {question.type === 'ii_v_i_confirm' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('sì')}>Sì</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('no')}>No</button>
            </div>
          )}

          {/* ii-V open (listen only with button) */}
          {question.type === 'ii_v_open' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('aperta')}>Tensione aperta ✓</button>
            </div>
          )}

          {/* ii-V-I vs I-IV-V */}
          {question.type === 'ii_v_i_vs_I_IV_V' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('ii-V-I')}>ii-V-I</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('I-IV-V')}>I-IV-V</button>
            </div>
          )}

          {/* ii-V-I secondary (degree grid) */}
          {question.type === 'ii_v_i_secondary' && (
            <div className="note-grid">
              {(question.degreePool || [1,2,4,5,6]).map(degree => (
                <button key={degree} className="note-btn" onClick={() => handleDegreeSelect(degree)}>
                  <span className="note-degree mono">{ROMAN[degree]}</span>
                </button>
              ))}
            </div>
          )}

          {/* ii-V-I chain count */}
          {question.type === 'ii_v_i_chain' && (
            <div className="binary-buttons">
              {[2, 3, 4].map(n => (
                <button key={n} className="binary-btn" onClick={() => handleBinaryAnswer(n)}>
                  {n} ii-V-I
                </button>
              ))}
            </div>
          )}

          {/* ii-V-I resolution quality */}
          {question.type === 'ii_v_i_resolution' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('maggiore')}>Maggiore</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('minore')}>Minore</button>
            </div>
          )}

          {/* Tritone substitution */}
          {question.type === 'tritone_sub' && (
            <div className="position-buttons">
              <p className="position-prompt">C'è una sostituzione di tritono?</p>
              <div className="binary-buttons">
                <button className="binary-btn" onClick={() => handleBinaryAnswer('sì')}>Sì</button>
                <button className="binary-btn" onClick={() => handleBinaryAnswer('no')}>No</button>
              </div>
            </div>
          )}

          {/* Chromatic passing */}
          {question.type === 'chromatic_passing' && (
            <div className="position-buttons">
              <p className="position-prompt">C'è un accordo di passaggio cromatico?</p>
              <div className="binary-buttons">
                <button className="binary-btn" onClick={() => handleBinaryAnswer('sì')}>Sì</button>
                <button className="binary-btn" onClick={() => handleBinaryAnswer('no')}>No</button>
              </div>
            </div>
          )}

          {/* Secondary dominant */}
          {question.type === 'secondary_dominant' && (
            <div className="position-buttons">
              <p className="position-prompt">La dominante secondaria risolve su quale grado?</p>
              <div className="note-grid">
                {(question.targetPool || [2, 5, 6]).map(degree => (
                  <button key={degree} className="note-btn" onClick={() => handleBinaryAnswer(degree)}>
                    <span className="note-degree mono">{ROMAN[degree]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Borrowed chord */}
          {question.type === 'borrowed_chord' && (
            <div className="chord-choice-buttons">
              {(question.borrowedPool || ['bIII', 'bVI', 'bVII', 'iv']).map(c => (
                <button key={c} className="binary-btn" onClick={() => handleBinaryAnswer(c)}>
                  <span className="mono">{c}</span>
                </button>
              ))}
            </div>
          )}

          {/* Substitution spot */}
          {question.type === 'substitution_spot' && (
            <div className="position-buttons">
              <p className="position-prompt">In quale posizione si trova la sostituzione?</p>
              <div className="binary-buttons">
                {Array.from({ length: question.length }).map((_, i) => (
                  <button key={i} className="binary-btn" onClick={() => handleBinaryAnswer(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* full_progression grid is now inside the sequence-input block above */}

          {/* ─── MONDO VI answer UIs ─────────────────────────── */}

          {/* Rhythm duration */}
          {question.type === 'rhythm_duration' && (
            <div className="chord-choice-buttons">
              {question.durationPool.map(d => (
                <button key={d} className="binary-btn" onClick={() => handleBinaryAnswer(d)}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Rhythm count */}
          {question.type === 'rhythm_count' && (
            <div className="position-buttons">
              <p className="position-prompt">Quante note hai sentito?</p>
              <div className="binary-buttons">
                {Array.from({ length: question.maxCount - 1 }).map((_, i) => (
                  <button key={i + 2} className="binary-btn" onClick={() => handleBinaryAnswer(i + 2)}>
                    {i + 2}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rhythm grid */}
          {question.type === 'rhythm_grid' && (
            <RhythmGrid
              subdivisions={question.subdivisions}
              measures={question.measures}
              beatsPerMeasure={question.beatsPerMeasure}
              onSubmit={(grid) => checkAnswer(grid)}
              disabled={phase !== 'answering'}
            />
          )}

          {/* Rhythm syncopation */}
          {question.type === 'rhythm_syncopation' && (
            <div className="position-buttons">
              <p className="position-prompt">In quale posizione si trova la sincope?</p>
              <div className="binary-buttons">
                {Array.from({ length: question.length }).map((_, i) => (
                  <button key={i} className="binary-btn" onClick={() => handleBinaryAnswer(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rhythm ghost pattern */}
          {question.type === 'rhythm_ghost_pattern' && (
            <div className="position-buttons">
              <p className="position-prompt">In quale posizione si trova la ghost note?</p>
              <div className="binary-buttons">
                {Array.from({ length: question.length }).map((_, i) => (
                  <button key={i} className="binary-btn" onClick={() => handleBinaryAnswer(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meter ID */}
          {question.type === 'meter_id' && (
            <div className="chord-choice-buttons">
              {question.meterPool.map(m => (
                <button key={m} className="binary-btn" onClick={() => handleBinaryAnswer(m)}>
                  <span className="mono">{m}</span>
                </button>
              ))}
            </div>
          )}

          {/* Meter grouping */}
          {question.type === 'meter_grouping' && (
            <div className="chord-choice-buttons">
              {question.groupingPool.map(g => (
                <button key={g} className="binary-btn" onClick={() => handleBinaryAnswer(g)}>
                  <span className="mono">{g}</span>
                </button>
              ))}
            </div>
          )}

          {/* Polyrhythm ID */}
          {question.type === 'polyrhythm_id' && (
            <div className="position-buttons">
              <p className="position-prompt">Basso : Acuto — quale rapporto?</p>
              <div className="chord-choice-buttons">
                {question.polyPool.map(p => (
                  <button key={p} className="binary-btn" onClick={() => handleBinaryAnswer(p)}>
                    <span className="mono">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Polyrhythm count */}
          {question.type === 'polyrhythm_count' && (
            <div className="position-buttons">
              <p className="position-prompt">
                Quanti battiti suona {question.followVoice === 'basso' ? 'il basso' : 'la voce acuta'} per ciclo?
              </p>
              <div className="binary-buttons">
                {Array.from({ length: question.maxOption - 1 }).map((_, i) => (
                  <button key={i + 2} className="binary-btn" onClick={() => handleBinaryAnswer(i + 2)}>
                    {i + 2}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── MONDO VII answer UIs ─────────────────────────── */}

          {/* Phrase relation */}
          {question.type === 'phrase_relation' && (
            <div className="binary-buttons">
              <button className="binary-btn" onClick={() => handleBinaryAnswer('domanda-risposta')}>Domanda-Risposta</button>
              <button className="binary-btn" onClick={() => handleBinaryAnswer('variazione')}>Variazione</button>
            </div>
          )}

          {/* Improvisation guided */}
          {question.type === 'improv_guided' && (
            <div className="improv-section">
              <p className="position-prompt">{question.instruction || 'Improvvisa sulla progressione'}</p>
              <p className="improv-progression mono">
                {question.progression.map(d => ROMAN[d]).join(' — ')}
              </p>
              <div className="binary-buttons">
                <button className="binary-btn" onClick={() => handleSelfAssess(true)}>
                  Soddisfatto
                </button>
                <button className="binary-btn" onClick={() => handleSelfAssess(false)}>
                  Da rifare
                </button>
              </div>
            </div>
          )}

          {/* Improvisation record */}
          {question.type === 'improv_record' && (
            <div className="improv-section">
              <p className="position-prompt">Registra la tua improvvisazione e confronta</p>
              <p className="improv-progression mono">
                {question.progression.map(d => ROMAN[d]).join(' — ')}
              </p>
              <div className="record-controls">
                {!isRecording && !recordedAudioUrl && (
                  <button className="play-btn record-btn" onClick={handleStartRecording}>
                    REC
                  </button>
                )}
                {isRecording && (
                  <button className="play-btn record-btn recording" onClick={handleStopRecording}>
                    STOP
                  </button>
                )}
                {recordedAudioUrl && (
                  <div className="record-playback">
                    <button className="play-btn" onClick={handlePlayRecording}>
                      Riascolta
                    </button>
                    <button className="play-btn" onClick={handleReplay}>
                      Originale
                    </button>
                  </div>
                )}
              </div>
              <div className="binary-buttons" style={{ marginTop: '1rem' }}>
                <button className="binary-btn" onClick={() => handleSelfAssess(true)}>
                  Soddisfatto
                </button>
                <button className="binary-btn" onClick={() => handleSelfAssess(false)}>
                  Da rifare
                </button>
              </div>
            </div>
          )}

          {/* Call and response */}
          {question.type === 'call_response' && (
            <div className="improv-section">
              <p className="position-prompt">Imita il lick che hai sentito</p>
              <div className="binary-buttons">
                <button className="binary-btn" onClick={() => handleSelfAssess(true)}>
                  Imitazione riuscita
                </button>
                <button className="binary-btn" onClick={() => handleSelfAssess(false)}>
                  Da rifare
                </button>
              </div>
            </div>
          )}

          {/* Intonation sing */}
          {question.type === 'intonation_sing' && (
            <div className="sing-degree-section">
              <p className="sing-prompt">
                Canta il grado <span className="mono text-gold">{question.targetDegree}</span>
              </p>
              <p className="intonation-hint">Usa un intonatore esterno per verificare</p>
              {!singRevealed ? (
                <button className="play-btn" onClick={() => { playNote(question.targetMidi, 1.5); setSingRevealed(true); }}>
                  Ascolta la risposta
                </button>
              ) : (
                <div className="binary-buttons">
                  <button className="binary-btn" onClick={() => handleSelfAssess(true)}>
                    Intonato
                  </button>
                  <button className="binary-btn" onClick={() => handleSelfAssess(false)}>
                    Stonato
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Intonation scale */}
          {question.type === 'intonation_scale' && (
            <div className="sing-degree-section">
              <p className="sing-prompt">Canta tutta la scala in intonazione</p>
              <p className="intonation-hint">Usa un intonatore esterno per verificare</p>
              {!singRevealed ? (
                <button className="play-btn" onClick={() => { playSequence(question.midiNotes, 0.5, 0.1); setSingRevealed(true); }}>
                  Ascolta la scala corretta
                </button>
              ) : (
                <div className="binary-buttons">
                  <button className="binary-btn" onClick={() => handleSelfAssess(true)}>
                    Intonato
                  </button>
                  <button className="binary-btn" onClick={() => handleSelfAssess(false)}>
                    Stonato
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Intonation arpeggio */}
          {question.type === 'intonation_arpeggio' && (
            <div className="sing-degree-section">
              <p className="sing-prompt">
                Canta gli arpeggi: {question.progression.map(d => ROMAN[d]).join(' — ')}
              </p>
              <p className="intonation-hint">Usa un intonatore esterno per verificare</p>
              {!singRevealed ? (
                <button className="play-btn" onClick={() => { playChordSequence(question.chordsMidi, 1.5, 0.5); setSingRevealed(true); }}>
                  Ascolta la risposta
                </button>
              ) : (
                <div className="binary-buttons">
                  <button className="binary-btn" onClick={() => handleSelfAssess(true)}>
                    Intonato
                  </button>
                  <button className="binary-btn" onClick={() => handleSelfAssess(false)}>
                    Stonato
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {question?.type === 'listen_only' && phase === 'answering' && (
        <div className="listen-only-section">
          <p className="listen-hint">Solo ascolto — premi RIPETI per riascoltare.</p>
          {exerciseComplete && nextExerciseId && (
            <button className="play-btn" onClick={() => navigate(`/exercise/${nextExerciseId}`)}>
              Esercizio successivo →
            </button>
          )}
        </div>
      )}

      <FeedbackOverlay feedback={feedback} onDismiss={handleFeedbackDismiss} />
    </ExerciseShell>
  );
}
