import { Link } from 'react-router-dom';
import useGameStore from '../store/gameStore.js';
import { LEVELS, computeLevel, getNextLevel } from '../store/gameStore.js';
import { WORLDS, CHAPTERS } from '../data/curriculum.js';
import './StatsPage.css';

function AccuracyChart({ xpHistory }) {
  const days = 30;
  const now = new Date();
  const labels = [];
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    labels.push(d.getDate());
    const entry = xpHistory.find(e => e.date === dateStr);
    data.push(entry ? entry.xp : 0);
  }

  const maxVal = Math.max(...data, 1);
  const w = 520;
  const h = 160;
  const padL = 40;
  const padR = 10;
  const padT = 10;
  const padB = 24;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const barW = chartW / days - 2;

  return (
    <div className="chart-container">
      <h3 className="chart-title">XP ultimi 30 giorni</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = padT + chartH * (1 - frac);
          return (
            <g key={frac}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--border)" strokeWidth="0.5" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="var(--text-secondary)" fontFamily="var(--font-mono)">
                {Math.round(maxVal * frac)}
              </text>
            </g>
          );
        })}
        {data.map((val, i) => {
          const x = padL + i * (chartW / days) + 1;
          const barH = (val / maxVal) * chartH;
          const y = padT + chartH - barH;
          const isToday = i === days - 1;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={Math.max(barW, 2)}
                height={Math.max(barH, 0)}
                fill={isToday ? 'var(--accent-red)' : val > 0 ? 'var(--gold-dark)' : 'var(--border)'}
                rx="1"
                opacity={val > 0 ? 1 : 0.3}
              />
              {i % 5 === 0 && (
                <text x={x + barW / 2} y={h - 4} textAnchor="middle" fontSize="7" fill="var(--text-secondary)" fontFamily="var(--font-mono)">
                  {labels[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function WorldProgress({ world, chaptersState }) {
  const chapterIds = world.chapters.map(String);
  const total = chapterIds.length;
  let completed = 0;
  let allGold = true;

  chapterIds.forEach(id => {
    const ch = chaptersState[id];
    if (ch && ch.stars > 0) completed++;
    if (!ch || ch.stars < 3) allGold = false;
  });

  return (
    <div className={`world-progress-card ${allGold ? 'world-mastered' : ''}`}>
      <div className="world-prog-header">
        <span className="world-prog-name">{world.name.replace(/^MONDO [IVX]+ — /, '')}</span>
        {allGold && <span className="mastery-badge">MAESTRO</span>}
      </div>
      <div className="world-prog-bar-track">
        <div
          className="world-prog-bar-fill"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
      <span className="world-prog-label mono">{completed}/{total} capitoli</span>
    </div>
  );
}

export default function StatsPage() {
  const globalXP = useGameStore(s => s.globalXP);
  const dailyStreak = useGameStore(s => s.dailyStreak);
  const xpHistory = useGameStore(s => s.xpHistory);
  const chaptersState = useGameStore(s => s.chapters);

  const level = computeLevel(globalXP);
  const next = getNextLevel(globalXP);

  const totalChapters = Object.keys(CHAPTERS).length;
  let completedChapters = 0;
  let totalStars = 0;
  const maxStars = totalChapters * 3;

  Object.values(chaptersState).forEach(ch => {
    if (ch.stars > 0) completedChapters++;
    totalStars += ch.stars || 0;
  });

  const totalXPLast7 = xpHistory
    .filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      const diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((sum, e) => sum + e.xp, 0);

  return (
    <div className="stats-page">
      <Link to="/" className="back-link">← Mappa</Link>

      <header className="stats-header">
        <h2 className="stats-title">Statistiche</h2>
      </header>

      <div className="stats-overview">
        <div className="stat-card">
          <span className="stat-card-value mono">{globalXP}</span>
          <span className="stat-card-label">XP Totali</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value mono">Lv {level.level}</span>
          <span className="stat-card-label">{level.title}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value mono">{dailyStreak}</span>
          <span className="stat-card-label">Streak giorni</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value mono">{totalXPLast7}</span>
          <span className="stat-card-label">XP ultimi 7g</span>
        </div>
      </div>

      <div className="stats-progress-section">
        <div className="stat-card wide">
          <span className="stat-card-value mono">{completedChapters}/{totalChapters}</span>
          <span className="stat-card-label">Capitoli completati</span>
        </div>
        <div className="stat-card wide">
          <span className="stat-card-value text-gold mono">{totalStars}/{maxStars}</span>
          <span className="stat-card-label">Stelle totali</span>
        </div>
      </div>

      <AccuracyChart xpHistory={xpHistory} />

      <div className="worlds-progress-section">
        <h3 className="section-title">Progressi per Mondo</h3>
        {WORLDS.map(world => (
          <WorldProgress key={world.id} world={world} chaptersState={chaptersState} />
        ))}
      </div>

      {next && (
        <div className="next-level-section">
          <p className="next-level-text">
            Prossimo livello: <span className="mono text-gold">Lv {next.level} — {next.title}</span>
          </p>
          <p className="next-level-xp mono">{next.xp - globalXP} XP mancanti</p>
        </div>
      )}
    </div>
  );
}
