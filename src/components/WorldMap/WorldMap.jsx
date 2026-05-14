import { WORLDS, CHAPTERS } from '../../data/curriculum.js';
import useGameStore from '../../store/gameStore.js';
import WorldNode from './WorldNode.jsx';
import './WorldMap.css';

export default function WorldMap() {
  const chaptersState = useGameStore(s => s.chapters);
  const getChapterState = (id) => chaptersState[id] || { stars: 0, bestAccuracy: 0, totalAttempts: 0, xpEarned: 0, unlocked: id === '1' };
  const isChapterUnlocked = (id) => {
    const ch = chaptersState[id];
    if (ch && ch.unlocked) return true;
    return id === '1';
  };

  return (
    <div className="world-map">
      {WORLDS.map(world => (
        <div key={world.id} className="world-section">
          <div className="world-header scanlines">
            <h2 className="world-title">{world.name}</h2>
            <p className="world-subtitle">{world.subtitle}</p>
          </div>
          <div className="world-path">
            {world.chapters.map((chId, i) => {
              const chapter = CHAPTERS[chId];
              if (!chapter) return null;
              const chapterState = getChapterState(String(chId));
              const unlocked = isChapterUnlocked(String(chId));
              const isLast = i === world.chapters.length - 1;

              return (
                <div key={chId} className="node-wrapper">
                  <WorldNode
                    chapter={chapter}
                    state={chapterState}
                    unlocked={unlocked}
                  />
                  {!isLast && <div className="path-connector" />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
