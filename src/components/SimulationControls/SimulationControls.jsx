import { useEffect, useRef } from 'react';
import useSimulationStore from '../../store/useSimulationStore';
import { SIMULATION } from '../../simulation/constants';
import './SimulationControls.css';

const SimulationControls = () => {
  const { 
    isRunning, 
    isPaused, 
    speed, 
    currentYear,
    start, 
    pause, 
    resume, 
    stop, 
    reset, 
    setSpeed,
    tick 
  } = useSimulationStore();
  
  const intervalRef = useRef(null);
  
  // Handle simulation tick
  useEffect(() => {
    if (isRunning && !isPaused) {
      const intervalMs = 1000 / speed;
      intervalRef.current = setInterval(() => {
        tick();
      }, intervalMs);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, speed, tick]);
  
  // Stop at max year
  useEffect(() => {
    if (currentYear >= SIMULATION.maxYear) {
      stop();
    }
  }, [currentYear, stop]);
  
  const handlePlayPause = () => {
    if (!isRunning) {
      start();
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };
  
  const handleStop = () => {
    stop();
  };
  
  const handleReset = () => {
    reset();
  };
  
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };
  
  return (
    <div className="simulation-controls section-panel">
      <h3 className="section-panel__title">
        <span className="simulation-controls__icon">🎮</span>
        Steuerung
      </h3>
      
      <div className="simulation-controls__status">
        <div className={`status-indicator ${isRunning && !isPaused ? 'status-indicator--active' : ''}`}>
          <span className="status-dot status-dot--active"></span>
          <span className="status-text">
            {!isRunning ? 'BEREIT' : isPaused ? 'PAUSIERT' : 'LÄUFT'}
          </span>
        </div>
      </div>
      
      <div className="simulation-controls__buttons">
        <button 
          className={`pixel-btn ${!isRunning || isPaused ? 'pixel-btn--primary' : ''}`}
          onClick={handlePlayPause}
        >
          {!isRunning ? '▶ START' : isPaused ? '▶ WEITER' : '❚❚ PAUSE'}
        </button>
        
        <button 
          className="pixel-btn pixel-btn--danger"
          onClick={handleStop}
          disabled={!isRunning}
        >
          ■ STOP
        </button>
        
        <button 
          className="pixel-btn"
          onClick={handleReset}
        >
          ↺ RESET
        </button>
      </div>
      
      <div className="simulation-controls__speed">
        <span className="speed-label">Geschwindigkeit:</span>
        <div className="speed-buttons">
          {SIMULATION.speedOptions.map((s) => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'speed-btn--active' : ''}`}
              onClick={() => handleSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
      
      <div className="simulation-controls__info">
        <div className="info-item">
          <span className="info-label">Jahr/Sek:</span>
          <span className="info-value glow-cyan">{speed}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Max Jahr:</span>
          <span className="info-value">{SIMULATION.maxYear}</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;

