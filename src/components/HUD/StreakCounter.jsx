import useGameStore from '../../store/gameStore.js';
import './HUD.css';

export default function StreakCounter() {
  const currentStreak = useGameStore(s => s.currentStreak);
  const dailyStreak = useGameStore(s => s.dailyStreak);

  let multiplierLabel = '×1';
  if (currentStreak >= 20) multiplierLabel = '×3';
  else if (currentStreak >= 10) multiplierLabel = '×2';
  else if (currentStreak >= 5) multiplierLabel = '×1.5';

  return (
    <div className="streak-counter">
      <div className="streak-current mono">
        <span className="streak-flame">{currentStreak > 0 ? '🔥' : ''}</span>
        <span className="streak-number">{currentStreak}</span>
        {currentStreak >= 5 && <span className="streak-multiplier">{multiplierLabel}</span>}
      </div>
      {dailyStreak > 0 && (
        <div className="streak-daily mono">
          Giorno {dailyStreak}
        </div>
      )}
    </div>
  );
}
