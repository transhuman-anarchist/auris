import { Link } from 'react-router-dom';
import SessionStats from '../HUD/SessionStats.jsx';
import StreakCounter from '../HUD/StreakCounter.jsx';
import useGameStore from '../../store/gameStore.js';
import './Exercise.css';

export default function ExerciseShell({ exercise, sessionStats, stars, children }) {
  const sessionXP = useGameStore(s => s.sessionXP);

  const STAR_LABELS = ['—', '★ Bronzo', '★★ Argento', '★★★ Oro'];

  return (
    <div className="exercise-shell">
      <header className="exercise-header">
        <div className="exercise-nav">
          <Link to={`/chapter/${exercise?.chapterId || 1}`} className="back-link">
            ← Capitolo
          </Link>
          <StreakCounter />
        </div>
        <h2 className="exercise-title">
          {exercise ? `${exercise.id.replace('_', '.')} — ${exercise.name}` : 'Esercizio'}
        </h2>
        {exercise?.description && (
          <p className="exercise-desc">{exercise.description}</p>
        )}
      </header>

      <div className="exercise-hud">
        <SessionStats
          correct={sessionStats?.correct || 0}
          total={sessionStats?.total || 0}
          streak={sessionStats?.streak || 0}
          bestStreak={sessionStats?.bestStreak || 0}
          sessionXP={sessionXP}
        />
        {stars !== undefined && (
          <div className="star-progress mono text-gold">
            {STAR_LABELS[stars]}
          </div>
        )}
      </div>

      <main className="exercise-body">
        {children}
      </main>
    </div>
  );
}
