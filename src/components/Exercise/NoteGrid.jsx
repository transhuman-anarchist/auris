import { memo } from 'react';
import './Exercise.css';

const DEGREE_NAMES_MAJOR = {
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7',
};

// Degree label maps for all scale types that alter degrees from the major scale.
// Each map only overrides the degrees that differ from major.
const DEGREE_LABEL_OVERRIDES = {
  minor:          { 3: 'b3', 6: 'b6', 7: 'b7' },
  aeolian:        { 3: 'b3', 6: 'b6', 7: 'b7' },
  harmonic_minor: { 3: 'b3', 6: 'b6' },          // 7 stays natural
  melodic_minor:  { 3: 'b3' },                     // 6 and 7 stay natural
  dorian:         { 3: 'b3', 7: 'b7' },            // 6 stays natural (signature)
  phrygian:       { 2: 'b2', 3: 'b3', 6: 'b6', 7: 'b7' },
  lydian:         { 4: '#4' },
  mixolydian:     { 7: 'b7' },
  locrian:        { 2: 'b2', 3: 'b3', 5: 'b5', 6: 'b6', 7: 'b7' },
};

function getDegreeLabel(degree, scaleType) {
  const overrides = DEGREE_LABEL_OVERRIDES[scaleType];
  if (overrides && overrides[degree]) return overrides[degree];
  return DEGREE_NAMES_MAJOR[degree] || String(degree);
}

const NoteGrid = memo(function NoteGrid({ pool = [1,2,3,4,5,6,7], onSelect, disabled = false, highlightCorrect = null, highlightWrong = null, scaleType = 'major' }) {
  return (
    <div className="note-grid">
      {pool.map(degree => {
        let extraClass = '';
        if (highlightCorrect === degree) extraClass = ' note-correct';
        if (highlightWrong === degree) extraClass = ' note-wrong';

        const label = getDegreeLabel(degree, scaleType);

        return (
          <button
            key={degree}
            className={`note-btn${extraClass}`}
            onClick={() => onSelect(degree)}
            disabled={disabled}
            aria-label={`Grado ${label}`}
          >
            <span className="note-degree mono">{label}</span>
          </button>
        );
      })}
    </div>
  );
});

export default NoteGrid;
