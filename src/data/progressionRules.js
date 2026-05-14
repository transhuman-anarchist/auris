export const STAR_REQUIREMENTS = {
  bronze: { accuracy: 0.6, consecutiveAnswers: 20 },
  silver: { accuracy: 0.8, consecutiveAnswers: 30 },
  gold: { accuracy: 0.95, consecutiveAnswers: 50 },
};

export function computeStars(accuracy, consecutiveAnswers) {
  if (accuracy >= STAR_REQUIREMENTS.gold.accuracy && consecutiveAnswers >= STAR_REQUIREMENTS.gold.consecutiveAnswers) return 3;
  if (accuracy >= STAR_REQUIREMENTS.silver.accuracy && consecutiveAnswers >= STAR_REQUIREMENTS.silver.consecutiveAnswers) return 2;
  if (accuracy >= STAR_REQUIREMENTS.bronze.accuracy && consecutiveAnswers >= STAR_REQUIREMENTS.bronze.consecutiveAnswers) return 1;
  return 0;
}

export function getXPForAnswer({ correct, streak, firstTry = true, fast = false }) {
  if (!correct) return 0;
  let base = 10;
  if (firstTry) base += 5;
  if (fast) base += 3;

  let multiplier = 1;
  if (streak >= 20) multiplier = 3;
  else if (streak >= 10) multiplier = 2;
  else if (streak >= 5) multiplier = 1.5;

  return Math.round(base * multiplier);
}

export function shouldUnlockNext(chapterStars) {
  return chapterStars >= 1;
}
