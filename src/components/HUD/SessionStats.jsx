import './HUD.css';

export default function SessionStats({ correct, total, streak, bestStreak, sessionXP }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="session-stats">
      <div className="stat-item">
        <span className="stat-label">Accuratezza</span>
        <span className="stat-value mono">{accuracy}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Risposte</span>
        <span className="stat-value mono">{correct}/{total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Streak</span>
        <span className="stat-value mono">{streak}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Best</span>
        <span className="stat-value mono">{bestStreak}</span>
      </div>
      {sessionXP > 0 && (
        <div className="stat-item">
          <span className="stat-label">XP sessione</span>
          <span className="stat-value mono text-gold">+{sessionXP}</span>
        </div>
      )}
    </div>
  );
}
