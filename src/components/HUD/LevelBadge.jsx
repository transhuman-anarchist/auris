import useGameStore from '../../store/gameStore.js';
import { computeLevel } from '../../store/gameStore.js';
import './HUD.css';

export default function LevelBadge() {
  // Subscribe directly to globalXP so the component re-renders when XP changes.
  // Previously, subscribing to s.getLevel returned a stable function reference
  // that never triggered re-renders (Zustand uses Object.is equality).
  const globalXP = useGameStore(s => s.globalXP);
  const level = computeLevel(globalXP);

  return (
    <div className="level-badge">
      <span className="level-number mono">Lv {level.level}</span>
      <span className="level-title">{level.title}</span>
    </div>
  );
}
