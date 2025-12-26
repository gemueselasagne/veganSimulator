import { useEffect, useCallback } from 'react';
import DietSliders from './components/DietSliders';
import SimulationControls from './components/SimulationControls';
import IndicatorPanel from './components/IndicatorPanel';
import PixelGlobe from './components/PixelGlobe';
import TimelineGraph from './components/TimelineGraph';
import YearDisplay from './components/YearDisplay';
import useSimulationStore from './store/useSimulationStore';
import './App.css';

function App() {
  const { 
    isRunning, 
    isPaused, 
    start, 
    pause, 
    resume, 
    setSpeed, 
    speed 
  } = useSimulationStore();
  
  // Keyboard controls
  const handleKeyPress = useCallback((e) => {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT') return;
    
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (!isRunning) {
          start();
        } else if (isPaused) {
          resume();
        } else {
          pause();
        }
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        setSpeed(Math.min(10, speed + 0.5));
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        setSpeed(Math.max(0.5, speed - 0.5));
        break;
      default:
        break;
    }
  }, [isRunning, isPaused, start, pause, resume, setSpeed, speed]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="app-container crt-effect retro-grid">
      {/* Scanline overlay */}
      <div className="scanlines" />
      
      {/* Header */}
      <header className="app-header">
        <h1 className="app-header__title">
          <span className="title-icon">🥬</span>
          VEGAN SIMULATOR
          <span className="title-icon">🌍</span>
        </h1>
        <div className="app-header__status">
          <span className={`status-dot ${isRunning ? 'status-dot--active' : 'status-dot--inactive'}`} />
          <span className="status-label">
            {isRunning ? 'SIMULATION AKTIV' : 'BEREIT'}
          </span>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="app-main">
        {/* Left Sidebar - Controls */}
        <aside className="sidebar-left">
          <DietSliders />
          <SimulationControls />
        </aside>
        
        {/* Center - Globe and Graph */}
        <section className="main-content">
          <YearDisplay />
          <PixelGlobe />
          <TimelineGraph />
        </section>
        
        {/* Right Sidebar - Indicators */}
        <aside className="sidebar-right">
          <IndicatorPanel />
        </aside>
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <span className="footer-info">
          ◀ PFEILTASTEN ANPASSEN ▶
        </span>
        <span className="footer-credits">
          VEGAN SIMULATOR v1.0 | 2024
        </span>
        <span className="footer-hint">
          LEERTASTE = PLAY/PAUSE
        </span>
      </footer>
    </div>
  );
}

export default App;
