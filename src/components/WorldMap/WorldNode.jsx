import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorldMap.css';

const STAR_LABELS = ['', '★', '★★', '★★★'];

const WorldNode = memo(function WorldNode({ chapter, state, unlocked }) {
  const navigate = useNavigate();
  const stars = state?.stars || 0;
  const isCompleted = stars > 0;

  const statusClass = !unlocked
    ? 'node-locked'
    : isCompleted
    ? 'node-completed'
    : 'node-current';

  const handleClick = () => {
    if (unlocked) {
      navigate(`/chapter/${chapter.id}`);
    }
  };

  return (
    <button
      className={`world-node ${statusClass}`}
      onClick={handleClick}
      disabled={!unlocked}
      aria-label={`Capitolo ${chapter.id}: ${chapter.name}${!unlocked ? ' (bloccato)' : ''}`}
    >
      <div className="node-hex">
        <span className="node-number mono">{chapter.id}</span>
      </div>
      <div className="node-info">
        <span className="node-name">{chapter.name}</span>
        {stars > 0 && <span className="node-stars text-gold">{STAR_LABELS[stars]}</span>}
        {!unlocked && <span className="node-lock">🔒</span>}
      </div>
    </button>
  );
});

export default WorldNode;
