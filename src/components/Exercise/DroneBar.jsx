import { useState, useCallback, useEffect } from 'react';
import droneEngine from '../../audio/droneEngine.js';
import useGameStore from '../../store/gameStore.js';
import './Exercise.css';

export default function DroneBar({ rootMidi = 60 }) {
  const [droneOn, setDroneOn] = useState(false);
  const settings = useGameStore(s => s.settings);

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
      droneEngine.start(rootMidi, {
        volume: settings.defaultDroneVolume,
        timbreKey: settings.defaultDroneTimbre,
      });
      setDroneOn(true);
    }
  }, [rootMidi, settings.defaultDroneVolume, settings.defaultDroneTimbre]);

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
