import useGameStore from '../../store/gameStore.js';
import { computeLevel, getNextLevel } from '../../store/gameStore.js';
import './HUD.css';

export default function XPBar() {
  const globalXP = useGameStore(s => s.globalXP);
  // Use computeLevel directly instead of s.getLevel (which is a stable function
  // reference that would never trigger re-renders on its own).
  const level = computeLevel(globalXP);
  const next = getNextLevel(globalXP);

  const currentLevelXP = level.xp;
  const nextLevelXP = next ? next.xp : level.xp;
  const progress = next ? (globalXP - currentLevelXP) / (nextLevelXP - currentLevelXP) : 1;

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-label mono">
        <span>{globalXP} XP</span>
        {next && <span>Lv {next.level}: {nextLevelXP} XP</span>}
      </div>
      <div className="xp-bar-track">
        <div
          className="xp-bar-fill"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
