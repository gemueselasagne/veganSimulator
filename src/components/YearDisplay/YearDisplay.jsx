import useSimulationStore from '../../store/useSimulationStore';
import { SIMULATION } from '../../simulation/constants';
import './YearDisplay.css';

const YearDisplay = () => {
  const { currentYear, isRunning, isPaused } = useSimulationStore();
  
  const progress = ((currentYear - SIMULATION.startYear) / (SIMULATION.maxYear - SIMULATION.startYear)) * 100;
  
  const yearString = currentYear.toString().padStart(4, '0');
  
  return (
    <div className="year-display">
      <div className="year-display__main">
        <div className={`year-display__digits ${isRunning && !isPaused ? 'year-display__digits--active' : ''}`}>
          {yearString.split('').map((digit, index) => (
            <span 
              key={index} 
              className="year-display__digit"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {digit}
            </span>
          ))}
        </div>
        
        <div className="year-display__label">
          JAHR
        </div>
      </div>
      
      <div className="year-display__progress">
        <div 
          className="year-display__progress-fill"
          style={{ width: `${progress}%` }}
        />
        <div className="year-display__progress-segments" />
      </div>
      
      <div className="year-display__range">
        <span>{SIMULATION.startYear}</span>
        <span className="year-display__range-bar">━━━━━━━━━━</span>
        <span>{SIMULATION.maxYear}</span>
      </div>
    </div>
  );
};

export default YearDisplay;

