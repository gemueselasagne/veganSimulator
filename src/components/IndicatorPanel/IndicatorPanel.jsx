import { useMemo } from 'react';
import useSimulationStore from '../../store/useSimulationStore';
import { getTrend, getChangeFromBaseline } from '../../simulation/simulationEngine';
import { BASELINES } from '../../simulation/constants';
import './IndicatorPanel.css';

const INDICATOR_KEYS = [
  'co2',
  'landUse',
  'waterUse',
  'healthIndex',
  'population',
  'biodiversity',
  'foodSecurity',
  'animalLives',
];

const IndicatorCard = ({ indicatorKey, value, info, trend, changePercent }) => {
  const { label, unit, icon, color, goodDirection } = info;
  
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●';
  
  // Determine if current trend is good or bad
  const isTrendGood = 
    (goodDirection === 'up' && trend === 'up') ||
    (goodDirection === 'down' && trend === 'down') ||
    goodDirection === 'neutral';
  
  const trendClass = trend === 'stable' 
    ? 'trend--stable' 
    : isTrendGood 
      ? 'trend--good' 
      : 'trend--bad';
  
  return (
    <div 
      className="indicator-card"
      style={{ '--indicator-color': color }}
    >
      <div className="indicator-card__icon">{icon}</div>
      
      <div className="indicator-card__content">
        <div className="indicator-card__value">
          <span className="value-number">{value.toFixed(1)}</span>
          <span className="value-unit">{unit}</span>
        </div>
        
        <div className="indicator-card__label">{label}</div>
        
        <div className={`indicator-card__trend ${trendClass}`}>
          <span className="trend-icon">{trendIcon}</span>
          <span className="trend-percent">
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div 
        className="indicator-card__bar"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

const IndicatorPanel = () => {
  const { indicators, history, getIndicatorInfo } = useSimulationStore();
  
  const indicatorsData = useMemo(() => {
    return INDICATOR_KEYS.map((key) => {
      const info = getIndicatorInfo(key);
      const value = indicators[key];
      const trend = getTrend(history, key);
      const baseline = BASELINES[key === 'co2' ? 'co2Emissions' : 
                       key === 'landUse' ? 'agriculturalLand' :
                       key === 'waterUse' ? 'freshwaterUse' :
                       key === 'healthIndex' ? 'healthIndex' :
                       key === 'population' ? 'worldPopulation' :
                       key === 'biodiversity' ? 'biodiversityIndex' :
                       key === 'animalLives' ? 'animalLives' :
                       'foodSecurityIndex'];
      const changePercent = getChangeFromBaseline(value, baseline);
      
      return {
        key,
        value,
        info,
        trend,
        changePercent,
      };
    });
  }, [indicators, history, getIndicatorInfo]);
  
  return (
    <div className="indicator-panel">
      <h3 className="section-panel__title indicator-panel__title">
        <span className="indicator-panel__icon">📊</span>
        Indikatoren
      </h3>
      
      <div className="indicator-panel__grid">
        {indicatorsData.map(({ key, value, info, trend, changePercent }) => (
          <IndicatorCard
            key={key}
            indicatorKey={key}
            value={value}
            info={info}
            trend={trend}
            changePercent={changePercent}
          />
        ))}
      </div>
    </div>
  );
};

export default IndicatorPanel;

