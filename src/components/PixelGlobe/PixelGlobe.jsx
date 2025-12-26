import { useMemo } from 'react';
import useSimulationStore from '../../store/useSimulationStore';
import './PixelGlobe.css';

// Simple pixel art Earth representation
// Each cell represents land (1) or water (0)
const EARTH_MAP = [
  '0000000000000000000000000000000000000000',
  '0000000011110000000001111100000000000000',
  '0000001111111100000011111111000000000000',
  '0000011111111110000111111111100000000000',
  '0000111111111111001111111111110000001100',
  '0001111111111111111111111111111000011110',
  '0011111111111111111111111111111100111110',
  '0111111111111111111111111111111111111100',
  '0111111111111111111111111111111111111000',
  '1111111111111111111111111111111111110000',
  '1111111111111111111111111111111111100000',
  '1111111111111111111111111111111111000000',
  '0111111111111111111111111111111110000000',
  '0011111111111111111111111111111100000000',
  '0001111111111111111111111111111000001100',
  '0000111111111111111111111111110000011110',
  '0000011111111111111111111111100001111110',
  '0000001111111111111111111111000011111100',
  '0000000011111111111111111100001111111000',
  '0000000000111111111111110000011111110000',
  '0000000000001111111111000000111111100000',
  '0000000000000011110000000001111111000000',
  '0000000000000000000000000011111110000000',
  '0000000000000000000000000111111100000000',
  '0000000000000000000000001111111000000000',
  '0000000000000000000000011111110000000000',
  '0000000000000000000000111111100000000000',
  '0000000000000000000001111111000000000000',
  '0000000000000000000001111110000000000000',
  '0000000000000000000000111100000000000000',
];

const PixelGlobe = () => {
  const { indicators, diet, currentYear, isRunning } = useSimulationStore();
  
  // Calculate colors based on environmental state
  const colors = useMemo(() => {
    const { biodiversity, co2, landUse } = indicators;
    
    // Land color: green to brown based on biodiversity
    const greenValue = Math.floor((biodiversity / 100) * 150) + 50;
    const landColor = `rgb(${200 - greenValue}, ${greenValue}, ${50})`;
    
    // Water color: blue gets darker with pollution
    const waterClarity = Math.max(0, 100 - co2);
    const waterColor = `rgb(${30}, ${100 + waterClarity}, ${180 + Math.floor(waterClarity * 0.5)})`;
    
    // Atmosphere glow based on CO2
    const co2Normalized = Math.min(co2 / 50, 1);
    const atmosphereColor = `rgba(${255 * co2Normalized}, ${100}, ${50}, ${0.2 + co2Normalized * 0.2})`;
    
    return { landColor, waterColor, atmosphereColor };
  }, [indicators]);
  
  // Generate pixel grid
  const pixels = useMemo(() => {
    const result = [];
    EARTH_MAP.forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        if (cell === '1') {
          result.push({ x, y, isLand: true });
        }
      });
    });
    return result;
  }, []);
  
  // Floating particles based on diet
  const particles = useMemo(() => {
    const count = Math.floor(diet.vegan + diet.vegetarian);
    return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 2,
    }));
  }, [diet.vegan, diet.vegetarian]);
  
  return (
    <div className="pixel-globe section-panel">
      <h3 className="section-panel__title">
        <span className="pixel-globe__title-icon">🌍</span>
        Erde - Jahr {currentYear}
      </h3>
      
      <div className="pixel-globe__container">
        {/* Atmosphere glow */}
        <div 
          className="pixel-globe__atmosphere"
          style={{ 
            boxShadow: `0 0 60px 20px ${colors.atmosphereColor}`,
            background: `radial-gradient(circle, transparent 60%, ${colors.atmosphereColor} 100%)`,
          }}
        />
        
        {/* Globe frame */}
        <div className={`pixel-globe__frame ${isRunning ? 'pixel-globe__frame--active' : ''}`}>
          {/* Water background */}
          <div 
            className="pixel-globe__water"
            style={{ backgroundColor: colors.waterColor }}
          />
          
          {/* Land pixels */}
          <div className="pixel-globe__land">
            {pixels.map((pixel, i) => (
              <div
                key={i}
                className="pixel-globe__pixel"
                style={{
                  left: `${(pixel.x / 40) * 100}%`,
                  top: `${(pixel.y / 30) * 100}%`,
                  backgroundColor: colors.landColor,
                }}
              />
            ))}
          </div>
          
          {/* Floating particles (positive indicators) */}
          <div className="pixel-globe__particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="pixel-globe__particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>
          
          {/* Grid overlay */}
          <div className="pixel-globe__grid" />
          
          {/* Scanline effect */}
          <div className="pixel-globe__scanlines" />
        </div>
        
        {/* Stats overlay */}
        <div className="pixel-globe__stats">
          <div className="stat-item">
            <span className="stat-icon">🌡️</span>
            <span className="stat-value">{indicators.co2.toFixed(1)} Gt</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🌲</span>
            <span className="stat-value">{indicators.biodiversity.toFixed(0)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{indicators.population.toFixed(1)}B</span>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      <div className="pixel-globe__message">
        {indicators.biodiversity > 70 ? (
          <span className="message--good">🌿 Ökosystem stabil</span>
        ) : indicators.biodiversity > 50 ? (
          <span className="message--warning">⚠️ Ökosystem unter Druck</span>
        ) : (
          <span className="message--danger">🚨 Kritischer Zustand!</span>
        )}
      </div>
    </div>
  );
};

export default PixelGlobe;

