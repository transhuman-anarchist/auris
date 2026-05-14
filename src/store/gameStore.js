import { create } from 'zustand';

const STORAGE_KEY = 'auris_save_v1';

const LEVELS = [
  { level: 1, title: 'Apprentice of Sound', xp: 0 },
  { level: 2, title: 'Acolyte of the Drone', xp: 500 },
  { level: 3, title: 'Initiate of Tone', xp: 1500 },
  { level: 4, title: 'Disciple of Harmony', xp: 3000 },
  { level: 5, title: 'Adept of the Scale', xp: 5000 },
  { level: 6, title: 'Warrior of Pitch', xp: 8000 },
  { level: 7, title: 'Knight of the Seventh', xp: 12000 },
  { level: 8, title: 'Master of Modes', xp: 18000 },
  { level: 9, title: 'Archon of Transcription', xp: 25000 },
  { level: 10, title: 'AURIS MAXIMUS', xp: 35000 },
];

function computeLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) return LEVELS[i];
  }
  return LEVELS[0];
}

function getNextLevel(xp) {
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp < LEVELS[i].xp) return LEVELS[i];
  }
  return null;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveToStorage(state) {
  try {
    const data = {
      version: 1,
      lastSaved: new Date().toISOString(),
      globalXP: state.globalXP,
      dailyStreak: state.dailyStreak,
      lastPracticeDate: state.lastPracticeDate,
      totalPracticeMinutes: state.totalPracticeMinutes,
      chapters: state.chapters,
      unlockedExercises: state.unlockedExercises,
      settings: state.settings,
      xpHistory: state.xpHistory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('localStorage pieno');
    }
  }
}

const today = () => new Date().toISOString().slice(0, 10);

function defaultState() {
  return {
    globalXP: 0,
    dailyStreak: 0,
    lastPracticeDate: null,
    totalPracticeMinutes: 0,
    chapters: {},
    unlockedExercises: { '1_1': true },
    settings: {
      defaultTimbre: 'bass_electric',
      defaultDroneTimbre: 'pad',
      defaultVolume: 0.6,
      defaultDroneVolume: 0.4,
    },
    xpHistory: [],
    sessionXP: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
    currentStreak: 0,
  };
}

const saved = loadFromStorage();

const useGameStore = create((set, get) => ({
  ...defaultState(),
  ...(saved ? {
    globalXP: saved.globalXP || 0,
    dailyStreak: saved.dailyStreak || 0,
    lastPracticeDate: saved.lastPracticeDate || null,
    totalPracticeMinutes: saved.totalPracticeMinutes || 0,
    chapters: saved.chapters || {},
    unlockedExercises: { '1_1': true, ...(saved.unlockedExercises || {}) },
    settings: { ...defaultState().settings, ...saved.settings },
    xpHistory: saved.xpHistory || [],
  } : {}),

  getLevel: () => computeLevel(get().globalXP),
  getNextLevel: () => getNextLevel(get().globalXP),

  getChapter: (chapterId) => {
    return get().chapters[chapterId] || {
      stars: 0,
      bestAccuracy: 0,
      totalAttempts: 0,
      xpEarned: 0,
      unlocked: chapterId === '1',
    };
  },

  isChapterUnlocked: (chapterId) => {
    const ch = get().chapters[chapterId];
    if (ch && ch.unlocked) return true;
    return chapterId === '1';
  },

  addXP: (amount) => {
    set(state => {
      // Multiplier is already applied by getXPForAnswer in progressionRules.js
      const earned = Math.round(amount);
      const newXP = state.globalXP + earned;

      const todayStr = today();
      let xpHistory = [...state.xpHistory];
      const todayEntry = xpHistory.find(e => e.date === todayStr);
      if (todayEntry) {
        todayEntry.xp += earned;
      } else {
        xpHistory.push({ date: todayStr, xp: earned });
      }
      if (xpHistory.length > 60) xpHistory = xpHistory.slice(-60);

      const newState = { globalXP: newXP, sessionXP: state.sessionXP + earned, xpHistory };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  recordAnswer: (correct) => {
    set(state => {
      const newState = {
        sessionTotal: state.sessionTotal + 1,
        sessionCorrect: state.sessionCorrect + (correct ? 1 : 0),
        currentStreak: correct ? state.currentStreak + 1 : 0,
      };
      return newState;
    });
  },

  updateChapterStats: (chapterId, { accuracy, stars }) => {
    set(state => {
      const existing = state.chapters[chapterId] || {
        stars: 0, bestAccuracy: 0, totalAttempts: 0, xpEarned: 0, unlocked: true,
      };
      const updated = {
        ...existing,
        stars: Math.max(existing.stars, stars || 0),
        bestAccuracy: Math.max(existing.bestAccuracy, accuracy || 0),
        totalAttempts: existing.totalAttempts + 1,
        unlocked: true,
      };
      const chapters = { ...state.chapters, [chapterId]: updated };
      const newState = { chapters };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  unlockChapter: (chapterId) => {
    set(state => {
      const existing = state.chapters[chapterId] || {
        stars: 0, bestAccuracy: 0, totalAttempts: 0, xpEarned: 0, unlocked: false,
      };
      const chapters = { ...state.chapters, [chapterId]: { ...existing, unlocked: true } };
      const newState = { chapters };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  isExerciseUnlocked: (exerciseId) => {
    return !!get().unlockedExercises[exerciseId];
  },

  unlockExercise: (exerciseId) => {
    set(state => {
      if (state.unlockedExercises[exerciseId]) return {};
      const unlockedExercises = { ...state.unlockedExercises, [exerciseId]: true };
      const newState = { unlockedExercises };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  updateDailyStreak: () => {
    set(state => {
      const todayStr = today();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      let dailyStreak = state.dailyStreak;
      if (state.lastPracticeDate === yesterdayStr) {
        dailyStreak += 1;
      } else if (state.lastPracticeDate !== todayStr) {
        dailyStreak = 1;
      }

      const newState = { dailyStreak, lastPracticeDate: todayStr };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },

  resetSession: () => {
    set({ sessionXP: 0, sessionCorrect: 0, sessionTotal: 0, currentStreak: 0 });
  },

  updateSettings: (newSettings) => {
    set(state => {
      const settings = { ...state.settings, ...newSettings };
      const newState = { settings };
      saveToStorage({ ...state, ...newState });
      return newState;
    });
  },
}));

export default useGameStore;
export { LEVELS, computeLevel, getNextLevel };
