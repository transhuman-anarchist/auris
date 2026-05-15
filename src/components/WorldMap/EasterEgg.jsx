import { useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore.js';
import { WORLDS } from '../../data/curriculum.js';
import './WorldMap.css';

export default function EasterEgg() {
  const [revealed, setRevealed] = useState(null);
  const [dismissed, setDismissed] = useState(new Set());
  const chaptersState = useGameStore(s => s.chapters);

  useEffect(() => {
    for (const world of WORLDS) {
      const chapterIds = world.chapters.map(String);
      const allGold = chapterIds.every(id => {
        const ch = chaptersState[id];
        return ch && ch.stars >= 3;
      });
      if (allGold && !dismissed.has(world.id)) {
        setRevealed(world);
        return;
      }
    }
  }, [chaptersState, dismissed]);

  if (!revealed) return null;

  const WORLD_TITLES = {
    1: 'SIGNORE DELLE FONDAMENTA',
    2: 'TESSITORE DI MELODIE',
    3: 'ARMONIZZATORE SUPREMO',
    4: 'CROMATISTA MODALE',
    5: 'ARCHITETTO ARMONICO',
    6: 'PADRONE DEL TEMPO',
    7: 'TRASCRITTORE TOTALE',
  };

  const handleDismiss = () => {
    setDismissed(prev => new Set([...prev, revealed.id]));
    setRevealed(null);
  };

  return (
    <div className="easter-egg-overlay" onClick={handleDismiss}>
      <div className="easter-egg-card">
        <div className="easter-egg-glow" />
        <div className="easter-egg-title">MONDO PADRONEGGIATO</div>
        <div className="easter-egg-world">{revealed.name}</div>
        <div className="easter-egg-badge">{WORLD_TITLES[revealed.id]}</div>
        <p className="easter-egg-hint">Tutti gli ori conquistati!</p>
      </div>
    </div>
  );
}
