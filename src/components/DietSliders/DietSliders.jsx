import { useMemo } from 'react';
import useSimulationStore from '../../store/useSimulationStore';
import { DIET_LABELS } from '../../simulation/constants';
import './DietSliders.css';

const DIET_TYPES = ['vegan', 'vegetarian', 'pescatarian', 'mixed', 'carnivore'];

const DietSlider = ({ dietType, value, onChange, color, disabled }) => {
  const label = DIET_LABELS[dietType];
  
  return (
    <div className="diet-slider">
      <div className="diet-slider__header">
        <span 
          className="diet-slider__label"
          style={{ color }}
        >
          {label}
        </span>
        <span 
          className="diet-slider__value"
          style={{ color }}
        >
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="diet-slider__track-container">
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={value}
          onChange={(e) => onChange(dietType, parseFloat(e.target.value))}
          className="diet-slider__input"
          disabled={disabled}
          style={{
            '--slider-color': color,
            '--slider-progress': `${value}%`,
          }}
        />
        <div 
          className="diet-slider__progress"
          style={{ 
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

const DietSliders = () => {
  const { diet, setDiet, getDietColor, isRunning } = useSimulationStore();
  
  const total = useMemo(() => {
    return Object.values(diet).reduce((sum, val) => sum + val, 0);
  }, [diet]);
  
  const isValid = Math.abs(total - 100) < 0.5;
  
  return (
    <div className="diet-sliders section-panel">
      <h3 className="section-panel__title">
        <span className="diet-sliders__icon">🥗</span>
        Ernährungsverteilung
      </h3>
      
      <div className="diet-sliders__list">
        {DIET_TYPES.map((type) => (
          <DietSlider
            key={type}
            dietType={type}
            value={diet[type]}
            onChange={setDiet}
            color={getDietColor(type)}
            disabled={isRunning}
          />
        ))}
      </div>
      
      <div className={`diet-sliders__total ${isValid ? '' : 'diet-sliders__total--invalid'}`}>
        <span>Gesamt:</span>
        <span className={isValid ? 'glow-green' : 'text-danger'}>
          {total.toFixed(1)}%
        </span>
      </div>
      
      <div className="diet-sliders__distribution">
        {DIET_TYPES.map((type) => (
          <div
            key={type}
            className="diet-sliders__bar-segment"
            style={{
              width: `${diet[type]}%`,
              backgroundColor: getDietColor(type),
            }}
            title={`${DIET_LABELS[type]}: ${diet[type].toFixed(1)}%`}
          />
        ))}
      </div>
      
      {isRunning && (
        <p className="diet-sliders__info">
          ⚠️ Pausieren um Werte zu ändern
        </p>
      )}
    </div>
  );
};

export default DietSliders;

