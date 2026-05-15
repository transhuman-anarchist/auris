import { useState, useCallback, useRef, useEffect } from 'react';
import { generateQuestionForExercise } from '../data/exerciseGenerators.js';
import { getXPForAnswer, computeStars } from '../data/progressionRules.js';
import useGameStore from '../store/gameStore.js';

const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
const QUALITY_IT = { major: 'Maggiore', minor: 'Minore', diminished: 'Diminuita', augmented: 'Aumentata' };
const SEVENTH_QUALITY_IT = { maj7: 'Maj7', dom7: 'Dom7', m7: 'Min7', m7b5: 'Min7b5', dim7: 'Dim7' };
const INV_IT = { 0: 'Fondamentale', 1: '1° Rivolto', 2: '2° Rivolto' };
const INV4_IT = { 0: 'Fondamentale', 1: '1° Rivolto', 2: '2° Rivolto', 3: '3° Rivolto' };
const MODE_IT = {
  ionian: 'Ionico', dorian: 'Dorico', phrygian: 'Frigio', lydian: 'Lidio',
  mixolydian: 'Misolidio', aeolian: 'Eolio', locrian: 'Locrio',
};

function formatCorrectAnswer(question) {
  switch (question.type) {
    case 'chord_quality':
      return QUALITY_IT[question.correctAnswer] || question.correctAnswer;
    case 'chord_inversion':
      return INV_IT[question.correctAnswer];
    case 'chord_quality_inversion':
      return `${QUALITY_IT[question.correctQuality]}, ${INV_IT[question.correctInversion]}`;
    case 'chord_sequence_quality':
      return question.correctAnswers.map(a => QUALITY_IT[a] || a);
    case 'chord_degree':
      return ROMAN[question.correctDegree] || question.correctDegree;
    case 'chord_degree_confirm':
      return question.correctAnswer;
    case 'chord_progression':
      return question.correctDegrees.map(d => ROMAN[d] || d);
    case 'progression_bass':
      return question.correctBass.map(d => ROMAN[d] || d);
    case 'progression_soprano':
      return question.correctSoprano.map(d => ROMAN[d] || d);
    case 'cadence_type':
    case 'cadence_in_progression':
    case 'progression_resolution':
      return question.correctAnswer;
    case 'minor_scale_id':
      return question.correctAnswer;
    case 'mode_id':
    case 'modal_lick_id':
      return MODE_IT[question.correctAnswer] || question.correctAnswer;
    case 'chromatic_tension':
      return question.correctAnswer;
    case 'chromatic_tension_sequence':
      return question.correctAnswers;
    case 'modal_lick':
      return question.correctDegrees;
    // ─── MONDO VI types ──────────────────────────────────────
    case 'rhythm_duration':
    case 'meter_id':
    case 'meter_grouping':
    case 'polyrhythm_id':
      return question.correctAnswer;
    case 'rhythm_count':
    case 'rhythm_syncopation':
    case 'rhythm_ghost_pattern':
    case 'polyrhythm_count':
      return String(question.correctAnswer);
    case 'rhythm_grid':
      return question.correctGrid.map(v => v > 0 ? 1 : 0);
    // ─── MONDO VII types ──────────────────────────────────────
    case 'melody_over_changes':
    case 'transcription_core':
      return question.correctDegrees;
    case 'phrase_relation':
      return question.correctAnswer;
    case 'improv_guided':
    case 'improv_record':
    case 'call_response':
      return 'Autovalutazione';
    case 'intonation_sing':
      return `Grado ${question.targetDegree}`;
    case 'intonation_scale':
      return 'Scala completa';
    case 'intonation_arpeggio':
      return 'ii-V-I arpeggiato';
    // ─── MONDO V types ──────────────────────────────────────
    case 'seventh_quality':
      return SEVENTH_QUALITY_IT[question.correctAnswer] || question.correctAnswer;
    case 'seventh_inversion':
      return INV4_IT[question.correctAnswer];
    case 'seventh_quality_inversion':
      return `${SEVENTH_QUALITY_IT[question.correctQuality]}, ${INV4_IT[question.correctInversion]}`;
    case 'seventh_sequence':
      return question.correctAnswers.map(a => SEVENTH_QUALITY_IT[a] || a);
    case 'seventh_degree':
      return ROMAN[question.correctDegree] || question.correctDegree;
    case 'seventh_voice_id':
    case 'bass_movement':
    case 'ii_v_i_confirm':
    case 'ii_v_i_vs_I_IV_V':
    case 'ii_v_i_resolution':
    case 'tritone_sub':
    case 'chromatic_passing':
    case 'borrowed_chord':
      return question.correctAnswer;
    case 'ii_v_open':
      return 'Tensione aperta';
    case 'ii_v_i_secondary':
    case 'secondary_dominant':
      return ROMAN[question.correctDegree || question.correctAnswer] || question.correctAnswer;
    case 'ii_v_i_chain':
      return `${question.correctAnswer} ii-V-I`;
    case 'substitution_spot':
      return `Posizione ${question.correctAnswer}`;
    case 'full_progression':
      return question.correctDegrees.map(d => ROMAN[d] || d);
    default:
      return question.correctDegree || question.correctDegrees || question.correctAnswer;
  }
}

export default function useExercise(exercise) {
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
  const [retentionCountdown, setRetentionCountdown] = useState(0);

  const retentionTimerRef = useRef(null);
  const timeLimitRef = useRef(null);

  // Reset all state when exercise changes (e.g., navigating to a different exercise)
  useEffect(() => {
    setQuestion(null);
    setFeedback(null);
    setPhase('idle');
    setSessionStats({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
    setRetentionCountdown(0);
    if (retentionTimerRef.current) {
      clearInterval(retentionTimerRef.current);
      retentionTimerRef.current = null;
    }
    // Also clear any pending timeLimit timer from previous exercise
    if (timeLimitRef.current) {
      clearTimeout(timeLimitRef.current);
      timeLimitRef.current = null;
    }
  }, [exercise?.id]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (retentionTimerRef.current) clearInterval(retentionTimerRef.current);
      if (timeLimitRef.current) clearTimeout(timeLimitRef.current);
    };
  }, []);

  const addXP = useGameStore(s => s.addXP);
  const recordAnswer = useGameStore(s => s.recordAnswer);
  const updateDailyStreak = useGameStore(s => s.updateDailyStreak);
  const dailyStreakUpdated = useRef(false);

  const rootMidi = 60;

  const startTimeLimit = useCallback(() => {
    if (timeLimitRef.current) clearTimeout(timeLimitRef.current);
    if (!exercise?.timeLimit) return;
    timeLimitRef.current = setTimeout(() => {
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        streak: 0,
      }));
      recordAnswer(false);
      setFeedback({ correct: false, correctAnswer: 'tempo scaduto', userAnswer: null });
      setPhase('feedback');
    }, exercise.timeLimit * 1000);
  }, [exercise, recordAnswer]);

  const generateNext = useCallback(() => {
    if (!exercise) return;
    if (timeLimitRef.current) clearTimeout(timeLimitRef.current);
    // Clear any running retention countdown from a previous question
    if (retentionTimerRef.current) {
      clearInterval(retentionTimerRef.current);
      retentionTimerRef.current = null;
    }
    setRetentionCountdown(0);
    setFeedback(null);
    const q = generateQuestionForExercise(exercise, rootMidi);
    setQuestion(q);

    if (exercise.retention && exercise.retention > 0) {
      setPhase('listening');
    } else {
      setPhase('answering');
      startTimeLimit();
    }
    return q;
  }, [exercise, rootMidi, startTimeLimit]);

  const startRetention = useCallback(() => {
    if (!exercise?.retention) {
      setPhase('answering');
      startTimeLimit();
      return;
    }
    // Clear any existing retention timer to avoid duplicate intervals on replay
    if (retentionTimerRef.current) {
      clearInterval(retentionTimerRef.current);
      retentionTimerRef.current = null;
    }
    setPhase('retention');
    let remaining = exercise.retention;
    setRetentionCountdown(remaining);
    retentionTimerRef.current = setInterval(() => {
      remaining--;
      setRetentionCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(retentionTimerRef.current);
        setPhase('answering');
        startTimeLimit();
      }
    }, 1000);
  }, [exercise, startTimeLimit]);

  const checkAnswer = useCallback((answer) => {
    if (!question) return null;
    if (timeLimitRef.current) clearTimeout(timeLimitRef.current);

    let correct = false;

    if (question.type === 'degree_single' || question.type === 'degree_direction' || question.type === 'missing_degree' || question.type === 'missing_from_set') {
      correct = Number(answer) === question.correctDegree;
    } else if (question.type === 'degree_sequence' || question.type === 'melodic_phrase' || question.type === 'ornament_lick') {
      if (Array.isArray(answer) && answer.length === question.correctDegrees.length) {
        correct = answer.every((a, i) => Number(a) === question.correctDegrees[i]);
      }
    } else if (question.type === 'ornament_pair') {
      if (Array.isArray(answer) && answer.length === question.correctDegrees.length) {
        correct = answer.every((a, i) => Number(a) === question.correctDegrees[i]);
      }
    } else if (question.type === 'binary') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'major_minor_id') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'minor_compare') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'sing_degree') {
      correct = answer === 'correct';
    } else if (question.type === 'phrase_direction' || question.type === 'phrase_compare' || question.type === 'pentatonic_id' || question.type === 'ornament_vibrato') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'phrase_last_degree' || question.type === 'phrase_first_degree' || question.type === 'ornament_bend') {
      correct = Number(answer) === question.correctDegree;
    } else if (question.type === 'phrase_diff' || question.type === 'ornament_ghost') {
      correct = Number(answer) === question.correctAnswer;
    }
    // ─── MONDO III types ──────────────────────────────────────
    else if (question.type === 'chord_quality' || question.type === 'chord_degree_confirm' ||
             question.type === 'progression_resolution' || question.type === 'cadence_type' ||
             question.type === 'cadence_in_progression') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'chord_inversion') {
      correct = Number(answer) === question.correctAnswer;
    } else if (question.type === 'chord_degree') {
      correct = Number(answer) === question.correctDegree;
    } else if (question.type === 'chord_progression') {
      if (Array.isArray(answer) && answer.length === question.correctDegrees.length) {
        correct = answer.every((a, i) => Number(a) === question.correctDegrees[i]);
      }
    } else if (question.type === 'chord_quality_inversion') {
      if (Array.isArray(answer) && answer.length === 2) {
        correct = answer[0] === question.correctQuality && Number(answer[1]) === question.correctInversion;
      }
    } else if (question.type === 'chord_sequence_quality') {
      if (Array.isArray(answer) && answer.length === question.correctAnswers.length) {
        correct = answer.every((a, i) => a === question.correctAnswers[i]);
      }
    } else if (question.type === 'progression_bass') {
      if (Array.isArray(answer) && answer.length === question.correctBass.length) {
        correct = answer.every((a, i) => Number(a) === question.correctBass[i]);
      }
    } else if (question.type === 'progression_soprano') {
      if (Array.isArray(answer) && answer.length === question.correctSoprano.length) {
        correct = answer.every((a, i) => Number(a) === question.correctSoprano[i]);
      }
    }
    // ─── MONDO IV types ──────────────────────────────────────
    else if (question.type === 'minor_scale_id' || question.type === 'mode_id' ||
             question.type === 'chromatic_tension' || question.type === 'modal_lick_id') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'chromatic_tension_sequence') {
      if (Array.isArray(answer) && answer.length === question.correctAnswers.length) {
        correct = answer.every((a, i) => a === question.correctAnswers[i]);
      }
    } else if (question.type === 'modal_lick') {
      if (Array.isArray(answer) && answer.length === question.correctDegrees.length) {
        correct = answer.every((a, i) => Number(a) === question.correctDegrees[i]);
      }
    }
    // ─── MONDO V types ──────────────────────────────────────
    else if (question.type === 'seventh_quality' || question.type === 'seventh_voice_id' ||
             question.type === 'bass_movement' || question.type === 'ii_v_i_confirm' ||
             question.type === 'ii_v_i_vs_I_IV_V' || question.type === 'ii_v_i_resolution' ||
             question.type === 'tritone_sub' || question.type === 'chromatic_passing' ||
             question.type === 'borrowed_chord' || question.type === 'ii_v_open') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'seventh_inversion' || question.type === 'substitution_spot' ||
               question.type === 'secondary_dominant') {
      correct = Number(answer) === question.correctAnswer;
    } else if (question.type === 'seventh_degree' || question.type === 'ii_v_i_secondary') {
      correct = Number(answer) === question.correctDegree;
    } else if (question.type === 'seventh_quality_inversion') {
      if (Array.isArray(answer) && answer.length === 2) {
        correct = answer[0] === question.correctQuality && Number(answer[1]) === question.correctInversion;
      }
    } else if (question.type === 'seventh_sequence') {
      if (Array.isArray(answer) && answer.length === question.correctAnswers.length) {
        correct = answer.every((a, i) => a === question.correctAnswers[i]);
      }
    } else if (question.type === 'ii_v_i_chain') {
      correct = Number(answer) === question.correctAnswer;
    } else if (question.type === 'full_progression') {
      if (Array.isArray(answer) && answer.length === question.correctDegrees.length) {
        correct = answer.every((a, i) => Number(a) === question.correctDegrees[i]);
      }
    }
    // ─── MONDO VI types ──────────────────────────────────────
    else if (question.type === 'rhythm_duration' || question.type === 'meter_id' ||
             question.type === 'meter_grouping' || question.type === 'polyrhythm_id') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'rhythm_count' || question.type === 'rhythm_syncopation' ||
               question.type === 'rhythm_ghost_pattern' || question.type === 'polyrhythm_count') {
      correct = Number(answer) === question.correctAnswer;
    } else if (question.type === 'rhythm_grid') {
      if (Array.isArray(answer) && answer.length === question.correctGrid.length) {
        correct = answer.every((a, i) => Number(a) === (question.correctGrid[i] > 0 ? 1 : 0));
      }
    }
    // ─── MONDO VII types ──────────────────────────────────────
    else if (question.type === 'melody_over_changes' || question.type === 'transcription_core') {
      if (Array.isArray(answer) && answer.length === question.correctDegrees.length) {
        correct = answer.every((a, i) => Number(a) === question.correctDegrees[i]);
      }
    } else if (question.type === 'phrase_relation') {
      correct = answer === question.correctAnswer;
    } else if (question.type === 'improv_guided' || question.type === 'improv_record' ||
               question.type === 'call_response' || question.type === 'intonation_sing' ||
               question.type === 'intonation_scale' || question.type === 'intonation_arpeggio') {
      correct = answer === 'correct';
    }

    if (!dailyStreakUpdated.current) {
      updateDailyStreak();
      dailyStreakUpdated.current = true;
    }

    recordAnswer(correct);

    if (correct) {
      // Read streak directly from store to avoid stale closure value
      const freshStreak = useGameStore.getState().currentStreak;
      const xp = getXPForAnswer({ correct: true, streak: freshStreak, firstTry: true });
      addXP(xp);
    }

    setSessionStats(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });

    const fb = {
      correct,
      correctAnswer: formatCorrectAnswer(question),
      userAnswer: answer,
    };
    setFeedback(fb);
    setPhase('feedback');
    return fb;
  }, [question, addXP, recordAnswer, updateDailyStreak]);

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
    setPhase('idle');
  }, []);

  const accuracy = sessionStats.total > 0 ? sessionStats.correct / sessionStats.total : 0;
  const stars = computeStars(accuracy, sessionStats.total);

  return {
    question,
    feedback,
    phase,
    sessionStats,
    retentionCountdown,
    accuracy,
    stars,
    generateNext,
    startRetention,
    checkAnswer,
    dismissFeedback,
  };
}
