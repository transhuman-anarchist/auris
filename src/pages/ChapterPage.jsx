import { useParams, useNavigate, Link } from 'react-router-dom';
import { CHAPTERS, getWorldForChapter } from '../data/curriculum.js';
import useGameStore from '../store/gameStore.js';
import './ChapterPage.css';

const STAR_LABELS = ['Nessuna stella', '★ Bronzo', '★★ Argento', '★★★ Oro'];

export default function ChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const chapter = CHAPTERS[chapterId];
  const world = getWorldForChapter(chapterId);
  const chapters = useGameStore(s => s.chapters);
  const chapterState = chapters[chapterId] || { stars: 0, bestAccuracy: 0, totalAttempts: 0, xpEarned: 0, unlocked: chapterId === '1' };
  const unlockedExercises = useGameStore(s => s.unlockedExercises);
  const isExerciseUnlocked = (id) => !!unlockedExercises[id];

  if (!chapter) {
    return (
      <div className="chapter-page">
        <Link to="/" className="back-link">← Mappa</Link>
        <p>Capitolo non trovato.</p>
      </div>
    );
  }

  const exercises = Object.values(chapter.exercises);
  const stars = chapterState?.stars || 0;
  const accuracy = chapterState?.bestAccuracy || 0;

  return (
    <div className="chapter-page">
      <Link to="/" className="back-link">← Mappa</Link>

      <header className="chapter-header">
        {world && <p className="chapter-world-label">{world.name}</p>}
        <h2 className="chapter-title">Capitolo {chapter.id} — {chapter.name}</h2>
        <p className="chapter-description">{chapter.description}</p>
        <div className="chapter-meta">
          <span className="chapter-stars text-gold">{STAR_LABELS[stars]}</span>
          {accuracy > 0 && (
            <span className="chapter-accuracy mono">Miglior acc: {Math.round(accuracy * 100)}%</span>
          )}
        </div>
      </header>

      <div className="exercise-list">
        {exercises.map((ex) => {
          const unlocked = isExerciseUnlocked(ex.id);
          return (
            <button
              key={ex.id}
              className={`exercise-item ${!unlocked ? 'exercise-locked' : ''}`}
              onClick={() => unlocked && navigate(`/exercise/${ex.id}`)}
              disabled={!unlocked}
              aria-label={`Esercizio ${ex.id}: ${ex.name}${!unlocked ? ' (bloccato)' : ''}`}
            >
              <span className="ex-number mono">{ex.id.replace('_', '.')}</span>
              <div className="ex-info">
                <span className="ex-name">{ex.name}</span>
                {ex.description && <span className="ex-desc">{ex.description}</span>}
              </div>
              {unlocked ? (
                <span className="ex-arrow">→</span>
              ) : (
                <span className="ex-lock">🔒</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
