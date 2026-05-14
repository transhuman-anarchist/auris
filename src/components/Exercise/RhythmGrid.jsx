import { useState, useEffect } from 'react';
import './RhythmGrid.css';

export default function RhythmGrid({ subdivisions, measures, beatsPerMeasure, onSubmit, disabled }) {
  const totalSlots = subdivisions * measures;
  const subdivisionsPerBeat = subdivisions / beatsPerMeasure;
  const [grid, setGrid] = useState(() => new Array(totalSlots).fill(0));

  useEffect(() => {
    setGrid(new Array(totalSlots).fill(0));
  }, [totalSlots]);

  const toggleCell = (index) => {
    if (disabled) return;
    setGrid(prev => {
      const next = [...prev];
      next[index] = next[index] ? 0 : 1;
      return next;
    });
  };

  const handleSubmit = () => {
    onSubmit([...grid]);
  };

  const hasAnyActive = grid.some(v => v > 0);

  return (
    <div className="rhythm-grid-container">
      <div className="rhythm-grid-measures">
        {Array.from({ length: measures }).map((_, m) => (
          <div key={m} className="rhythm-grid-measure">
            <div className="rhythm-grid-labels">
              {Array.from({ length: beatsPerMeasure }).map((_, b) => (
                <div
                  key={b}
                  className="beat-label mono"
                  style={{ width: `${100 / beatsPerMeasure}%` }}
                >
                  {b + 1}
                </div>
              ))}
            </div>
            <div className="rhythm-grid-row">
              {Array.from({ length: subdivisions }).map((_, s) => {
                const idx = m * subdivisions + s;
                const isBeat = s % subdivisionsPerBeat === 0;
                const isDownbeat = s === 0;
                return (
                  <button
                    key={idx}
                    className={
                      'rhythm-cell' +
                      (grid[idx] ? ' active' : '') +
                      (isDownbeat ? ' downbeat' : '') +
                      (isBeat ? ' beat' : '')
                    }
                    onClick={() => toggleCell(idx)}
                    disabled={disabled}
                    aria-label={`Posizione ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        className="play-btn"
        onClick={handleSubmit}
        disabled={disabled || !hasAnyActive}
      >
        Conferma
      </button>
    </div>
  );
}
