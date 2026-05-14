import { useState, useCallback, useEffect } from 'react';
import droneEngine from '../../audio/droneEngine.js';
import './Exercise.css';

export default function DroneBar({ rootMidi = 60 }) {
  const [droneOn, setDroneOn] = useState(false);

  // Sync local state with actual drone state (drone may be started externally by handlePlay)
  useEffect(() => {
    const interval = setInterval(() => {
      const actual = droneEngine.isPlaying();
      setDroneOn(prev => prev !== actual ? actual : prev);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const toggleDrone = useCallback(() => {
    if (droneEngine.isPlaying()) {
      droneEngine.stop();
      setDroneOn(false);
    } else {
      droneEngine.start(rootMidi);
      setDroneOn(true);
    }
  }, [rootMidi]);

  return (
    <div className="drone-bar">
      <button
        className={`drone-toggle ${droneOn ? 'drone-active' : ''}`}
        onClick={toggleDrone}
        aria-label={droneOn ? 'Spegni drone' : 'Accendi drone'}
      >
        {droneOn ? '◉ Drone ON' : '○ Drone OFF'}
      </button>
    </div>
  );
}
