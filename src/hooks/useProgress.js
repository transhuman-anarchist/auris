import useGameStore from '../store/gameStore.js';
import { getNextChapterId } from '../data/curriculum.js';

export default function useProgress() {
  const globalXP = useGameStore(s => s.globalXP);
  const getLevel = useGameStore(s => s.getLevel);
  const getNextLevel = useGameStore(s => s.getNextLevel);
  const dailyStreak = useGameStore(s => s.dailyStreak);
  const isChapterUnlocked = useGameStore(s => s.isChapterUnlocked);
  const getChapter = useGameStore(s => s.getChapter);
  const unlockChapter = useGameStore(s => s.unlockChapter);
  const updateChapterStats = useGameStore(s => s.updateChapterStats);
  const updateDailyStreak = useGameStore(s => s.updateDailyStreak);

  const checkAndUnlockNext = (chapterId, stars) => {
    if (stars >= 1) {
      const next = getNextChapterId(chapterId);
      if (next) {
        unlockChapter(String(next));
      }
    }
  };

  return {
    globalXP,
    getLevel,
    getNextLevel,
    dailyStreak,
    isChapterUnlocked,
    getChapter,
    updateChapterStats,
    updateDailyStreak,
    checkAndUnlockNext,
  };
}
