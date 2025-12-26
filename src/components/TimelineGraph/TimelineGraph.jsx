import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import useSimulationStore from '../../store/useSimulationStore';
import './TimelineGraph.css';

const INDICATOR_CONFIG = {
  co2: { color: '#ff6b35', label: 'CO₂ (Gt)' },
  landUse: { color: '#8b4513', label: 'Land (Mio km²)' },
  waterUse: { color: '#1e90ff', label: 'Wasser (%)' },
  healthIndex: { color: '#ff69b4', label: 'Gesundheit' },
  population: { color: '#ffd700', label: 'Bevölkerung (Mrd)' },
  biodiversity: { color: '#32cd32', label: 'Biodiversität (%)' },
  foodSecurity: { color: '#daa520', label: 'Ernährung (%)' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="timeline-tooltip">
        <p className="timeline-tooltip__year">Jahr {label}</p>
        {payload.map((entry, index) => (
          <p 
            key={index} 
            className="timeline-tooltip__item"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value.toFixed(1)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TimelineGraph = () => {
  const { history } = useSimulationStore();
  const [selectedIndicators, setSelectedIndicators] = useState(['co2', 'biodiversity', 'population']);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    // Only show last 100 data points for performance
    const slicedHistory = history.slice(-100);
    return slicedHistory.map((entry) => ({
      year: entry.year,
      ...Object.keys(INDICATOR_CONFIG).reduce((acc, key) => {
        acc[key] = entry[key];
        return acc;
      }, {}),
    }));
  }, [history]);
  
  const toggleIndicator = (indicator) => {
    setSelectedIndicators((prev) => {
      if (prev.includes(indicator)) {
        return prev.filter((i) => i !== indicator);
      }
      if (prev.length < 4) {
        return [...prev, indicator];
      }
      return prev;
    });
  };
  
  return (
    <div className="timeline-graph section-panel">
      <h3 className="section-panel__title">
        <span className="timeline-graph__icon">📈</span>
        Zeitverlauf
      </h3>
      
      {/* Indicator toggles */}
      <div className="timeline-graph__toggles">
        {Object.entries(INDICATOR_CONFIG).map(([key, config]) => (
          <button
            key={key}
            className={`toggle-btn ${selectedIndicators.includes(key) ? 'toggle-btn--active' : ''}`}
            style={{ 
              '--toggle-color': config.color,
              borderColor: selectedIndicators.includes(key) ? config.color : 'var(--border-color)',
            }}
            onClick={() => toggleIndicator(key)}
          >
            {config.label}
          </button>
        ))}
      </div>
      
      {/* Chart */}
      <div className="timeline-graph__chart">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(51, 51, 68, 0.5)" 
              vertical={false}
            />
            <XAxis 
              dataKey="year" 
              stroke="var(--text-muted)"
              tick={{ fontSize: 8, fontFamily: 'Press Start 2P' }}
              tickLine={{ stroke: 'var(--border-color)' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="var(--text-muted)"
              tick={{ fontSize: 8, fontFamily: 'Press Start 2P' }}
              tickLine={{ stroke: 'var(--border-color)' }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontFamily: 'Press Start 2P', 
                fontSize: '6px',
                paddingTop: '10px',
              }}
            />
            {selectedIndicators.map((indicator) => (
              <Line
                key={indicator}
                type="monotone"
                dataKey={indicator}
                name={INDICATOR_CONFIG[indicator].label}
                stroke={INDICATOR_CONFIG[indicator].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Info */}
      <div className="timeline-graph__info">
        <span className="info-text">
          {history.length} Jahre aufgezeichnet • Max 4 Indikatoren
        </span>
      </div>
    </div>
  );
};

export default TimelineGraph;

