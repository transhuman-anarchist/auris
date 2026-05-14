import WorldMap from '../components/WorldMap/WorldMap.jsx';
import XPBar from '../components/HUD/XPBar.jsx';
import LevelBadge from '../components/HUD/LevelBadge.jsx';
import useGameStore from '../store/gameStore.js';
import './MapPage.css';

export default function MapPage() {
  const dailyStreak = useGameStore(s => s.dailyStreak);

  return (
    <div className="map-page">
      <header className="map-header scanlines">
        <div className="header-top">
          <h1 className="app-title">AURIS</h1>
          <div className="header-right">
            <LevelBadge />
            {dailyStreak > 0 && (
              <span className="daily-streak mono">🔥 {dailyStreak}g</span>
            )}
          </div>
        </div>
        <XPBar />
      </header>
      <main className="map-content">
        <WorldMap />
      </main>
    </div>
  );
}
