import { useMemo, useState, useCallback } from 'react';
import useSimulationStore from '../../store/useSimulationStore';
import './PixelGlobe.css';

// Tooltip descriptions for each element type
const TOOLTIP_INFO = {
  ocean: {
    title: 'Ozean',
    description: 'Meeresgesundheit - Die Farbe zeigt den Verschmutzungsgrad. Blauer = gesünder, grünlich-grau = verschmutzt.',
  },
  waterStress: {
    title: 'Wasserstress',
    description: 'Zeigt den globalen Wasserverbrauch. Dunklere Färbung = höherer Stress auf Wasserressourcen.',
  },
  continent: {
    title: 'Landmasse',
    description: 'Kontinente - Grünere Farbe = gesundes Ökosystem. Bräunliche Färbung = degradiertes Land.',
  },
  forest: {
    title: 'Waldgebiet',
    description: 'Regenwälder & Wälder - Hohe Biodiversität. Opacity zeigt verbleibende Waldbedeckung.',
  },
  desert: {
    title: 'Wüste',
    description: 'Wüstenausdehnung - Dehnt sich bei hoher Landnutzung und Entwaldung aus.',
  },
  ice: {
    title: 'Polkappe',
    description: 'Polareis - Schrumpft bei steigendem CO2 und Erderwärmung.',
  },
  city: {
    title: 'Stadt',
    description: 'Bevölkerungszentrum - Mehr Lichter = höhere Bevölkerungsdichte.',
  },
  smog: {
    title: 'Smog',
    description: 'Luftverschmutzung - Steigt mit CO2-Emissionen und Industrialisierung.',
  },
  cow: {
    title: 'Rinder',
    description: 'Rinderhaltung - Hoher CO2-Ausstoß (Methan), benötigt viel Land und Wasser.',
  },
  pig: {
    title: 'Schweine',
    description: 'Schweinehaltung - Mittlerer ökologischer Fußabdruck, intensive Tierhaltung.',
  },
  chicken: {
    title: 'Hühner',
    description: 'Geflügelhaltung - Relativ effizienter als Rinder, aber Massentierhaltung.',
  },
  fish: {
    title: 'Fische',
    description: 'Fischerei - Überfischung bedroht marine Ökosysteme und Artenvielfalt.',
  },
};

// More realistic SVG paths for world continents
const CONTINENTS = {
  // North America with Alaska, Canada, USA, Mexico, Central America
  northAmerica: "M 55 28 L 62 22 L 75 18 L 88 15 L 105 18 L 118 22 L 125 18 L 135 15 L 148 18 L 155 25 L 160 20 L 168 18 L 175 25 L 172 35 L 165 42 L 170 48 L 178 52 L 182 60 L 178 68 L 172 75 L 165 82 L 155 88 L 145 92 L 140 98 L 132 105 L 125 112 L 118 118 L 112 122 L 108 128 L 102 125 L 98 118 L 92 115 L 88 108 L 82 102 L 75 98 L 68 92 L 62 85 L 58 78 L 55 70 L 52 62 L 55 52 L 58 42 L 55 35 L 55 28 Z",
  
  // South America
  southAmerica: "M 118 138 L 128 135 L 138 138 L 148 145 L 155 155 L 158 168 L 162 182 L 158 195 L 152 210 L 145 225 L 138 240 L 132 252 L 125 262 L 118 268 L 112 265 L 108 255 L 105 242 L 108 228 L 112 215 L 108 200 L 105 185 L 108 170 L 112 155 L 118 145 L 118 138 Z",
  
  // Europe with Scandinavia, British Isles, Iberian Peninsula
  europe: "M 225 22 L 232 18 L 242 20 L 248 15 L 258 18 L 265 15 L 275 18 L 282 22 L 288 28 L 285 35 L 278 42 L 285 48 L 292 52 L 288 58 L 282 62 L 275 65 L 268 68 L 258 72 L 248 75 L 238 72 L 228 68 L 222 62 L 218 55 L 215 48 L 218 42 L 222 35 L 218 28 L 225 22 Z",
  
  // British Isles
  britishIsles: "M 218 35 L 225 32 L 230 38 L 228 45 L 222 48 L 215 45 L 218 35 Z M 212 42 L 218 40 L 220 48 L 215 52 L 210 48 L 212 42 Z",
  
  // Africa with Horn of Africa, Madagascar
  africa: "M 225 78 L 238 75 L 252 78 L 268 82 L 282 88 L 295 95 L 305 85 L 312 92 L 308 102 L 298 108 L 288 115 L 295 125 L 298 138 L 295 152 L 288 168 L 278 182 L 265 195 L 252 205 L 238 208 L 225 205 L 215 195 L 208 180 L 205 162 L 208 142 L 212 125 L 218 108 L 222 92 L 225 78 Z",
  
  // Madagascar
  madagascar: "M 302 175 L 308 172 L 312 182 L 310 195 L 305 202 L 298 198 L 300 185 L 302 175 Z",
  
  // Asia with Russia, Middle East, India, China, Southeast Asia
  asia: "M 288 18 L 305 15 L 328 12 L 355 15 L 382 18 L 408 22 L 428 28 L 445 35 L 455 42 L 458 52 L 455 62 L 448 72 L 455 78 L 452 85 L 445 88 L 438 82 L 428 85 L 418 88 L 408 85 L 398 88 L 388 92 L 378 88 L 368 85 L 358 88 L 348 85 L 338 88 L 328 85 L 318 82 L 308 78 L 298 72 L 292 65 L 288 58 L 285 48 L 288 38 L 292 28 L 288 18 Z",
  
  // Middle East / Arabian Peninsula
  middleEast: "M 292 72 L 305 68 L 318 72 L 328 78 L 332 88 L 328 98 L 318 105 L 305 108 L 292 105 L 285 95 L 288 82 L 292 72 Z",
  
  // Indian Subcontinent
  india: "M 332 85 L 345 82 L 358 88 L 365 98 L 362 112 L 355 125 L 345 138 L 335 145 L 325 142 L 318 132 L 322 118 L 328 105 L 332 92 L 332 85 Z",
  
  // Southeast Asia peninsula
  southeastAsia: "M 365 92 L 378 88 L 392 95 L 398 105 L 395 118 L 388 128 L 378 132 L 368 128 L 362 118 L 362 105 L 365 92 Z",
  
  // Japan
  japan: "M 428 55 L 435 52 L 442 58 L 445 68 L 442 78 L 435 82 L 428 78 L 425 68 L 428 55 Z M 438 42 L 445 45 L 448 52 L 442 55 L 438 48 L 438 42 Z",
  
  // Australia
  australia: "M 378 165 L 398 158 L 422 162 L 442 172 L 452 188 L 448 205 L 438 218 L 422 228 L 402 232 L 382 228 L 368 218 L 362 202 L 365 185 L 372 172 L 378 165 Z",
  
  // Indonesia / Maritime Southeast Asia
  indonesia: "M 362 135 L 378 132 L 398 138 L 418 142 L 432 148 L 428 158 L 412 162 L 392 158 L 372 152 L 358 145 L 362 135 Z",
  
  // New Zealand
  newZealand: "M 462 215 L 468 212 L 472 222 L 468 232 L 462 235 L 458 228 L 462 215 Z M 468 235 L 475 238 L 478 248 L 472 252 L 465 245 L 468 235 Z",
  
  // Greenland
  greenland: "M 165 8 L 182 5 L 198 8 L 208 15 L 205 28 L 195 38 L 182 42 L 168 38 L 158 28 L 162 15 L 165 8 Z",
};

// Ice cap regions - positioned at actual poles
const ICE_CAPS = {
  arctic: "M 0 0 L 50 2 L 100 0 L 150 3 L 200 0 L 250 2 L 300 0 L 350 3 L 400 0 L 450 2 L 500 0 L 500 20 L 450 25 L 400 22 L 350 28 L 300 24 L 250 28 L 200 24 L 150 28 L 100 24 L 50 28 L 0 22 L 0 0 Z",
  antarctica: "M 0 280 L 50 275 L 100 278 L 150 272 L 200 276 L 250 270 L 300 276 L 350 272 L 400 278 L 450 275 L 500 280 L 500 300 L 0 300 L 0 280 Z",
};

// Forest overlay regions (positioned on continents)
const FOREST_REGIONS = {
  amazon: "M 118 158 L 142 152 L 158 165 L 152 185 L 135 192 L 115 182 L 118 158 Z",
  centralAfrica: "M 235 118 L 265 112 L 285 132 L 272 158 L 248 165 L 228 148 L 235 118 Z",
  congoBasin: "M 242 135 L 262 130 L 275 145 L 268 162 L 250 168 L 238 155 L 242 135 Z",
  northernEurope: "M 238 28 L 268 22 L 285 35 L 278 48 L 255 55 L 235 45 L 238 28 Z",
  siberia: "M 318 22 L 385 15 L 425 28 L 418 48 L 375 55 L 328 48 L 318 22 Z",
  southeastAsiaForest: "M 368 98 L 392 92 L 405 108 L 395 125 L 372 122 L 365 108 L 368 98 Z",
  pacificNW: "M 68 52 L 92 45 L 108 58 L 98 75 L 78 72 L 68 58 L 68 52 Z",
  australiaForest: "M 412 172 L 438 165 L 450 185 L 442 205 L 418 202 L 408 185 L 412 172 Z",
  borneo: "M 385 138 L 402 135 L 412 148 L 405 158 L 388 155 L 385 138 Z",
};

// Desert regions
const DESERT_REGIONS = {
  sahara: "M 218 82 L 278 78 L 302 95 L 292 118 L 248 125 L 212 108 L 218 82 Z",
  arabian: "M 295 75 L 325 72 L 335 92 L 322 108 L 295 102 L 288 85 L 295 75 Z",
  gobi: "M 365 42 L 408 38 L 428 55 L 418 72 L 375 75 L 362 58 L 365 42 Z",
  australian: "M 388 178 L 428 172 L 445 195 L 432 218 L 395 215 L 382 195 L 388 178 Z",
  mojave: "M 78 72 L 105 68 L 118 85 L 105 98 L 82 92 L 78 72 Z",
  atacama: "M 112 205 L 132 198 L 138 222 L 128 242 L 112 232 L 112 205 Z",
  kalahari: "M 242 178 L 262 175 L 272 192 L 262 208 L 245 205 L 242 178 Z",
  thar: "M 328 88 L 345 85 L 352 98 L 342 108 L 328 102 L 328 88 Z",
};

// Major city positions for population lights
const CITY_POSITIONS = [
  { x: 158, y: 62, name: 'New York' },
  { x: 118, y: 95, name: 'Mexico City' },
  { x: 142, y: 182, name: 'São Paulo' },
  { x: 132, y: 192, name: 'Buenos Aires' },
  { x: 238, y: 48, name: 'London' },
  { x: 248, y: 52, name: 'Paris' },
  { x: 262, y: 48, name: 'Berlin' },
  { x: 295, y: 38, name: 'Moscow' },
  { x: 248, y: 115, name: 'Lagos' },
  { x: 262, y: 138, name: 'Kinshasa' },
  { x: 288, y: 82, name: 'Cairo' },
  { x: 305, y: 92, name: 'Dubai' },
  { x: 345, y: 112, name: 'Mumbai' },
  { x: 352, y: 128, name: 'Chennai' },
  { x: 348, y: 95, name: 'Delhi' },
  { x: 398, y: 58, name: 'Beijing' },
  { x: 412, y: 68, name: 'Shanghai' },
  { x: 438, y: 62, name: 'Tokyo' },
  { x: 382, y: 115, name: 'Bangkok' },
  { x: 392, y: 122, name: 'Ho Chi Minh' },
  { x: 378, y: 148, name: 'Jakarta' },
  { x: 428, y: 205, name: 'Sydney' },
  { x: 92, y: 68, name: 'Los Angeles' },
  { x: 82, y: 58, name: 'San Francisco' },
  { x: 145, y: 58, name: 'Chicago' },
  { x: 268, y: 52, name: 'Warsaw' },
  { x: 282, y: 58, name: 'Istanbul' },
  { x: 358, y: 108, name: 'Kolkata' },
  { x: 405, y: 118, name: 'Manila' },
  { x: 122, y: 148, name: 'Lima' },
  { x: 258, y: 195, name: 'Cape Town' },
  { x: 275, y: 145, name: 'Nairobi' },
  { x: 362, y: 78, name: 'Hong Kong' },
  { x: 395, y: 128, name: 'Singapore' },
];

// Animal icon positions (spread across continents)
const ANIMAL_POSITIONS = [
  { x: 115, y: 72, type: 'cow', continent: 'northAmerica' },
  { x: 155, y: 85, type: 'chicken', continent: 'northAmerica' },
  { x: 135, y: 175, type: 'cow', continent: 'southAmerica' },
  { x: 248, y: 52, type: 'pig', continent: 'europe' },
  { x: 272, y: 45, type: 'chicken', continent: 'europe' },
  { x: 255, y: 138, type: 'cow', continent: 'africa' },
  { x: 345, y: 105, type: 'cow', continent: 'india' },
  { x: 392, y: 55, type: 'pig', continent: 'asia' },
  { x: 415, y: 72, type: 'chicken', continent: 'asia' },
  { x: 408, y: 192, type: 'cow', continent: 'australia' },
  { x: 185, y: 18, type: 'fish', continent: 'arctic' },
  { x: 328, y: 138, type: 'fish', continent: 'ocean' },
  { x: 195, y: 185, type: 'fish', continent: 'ocean' },
  { x: 448, y: 148, type: 'fish', continent: 'pacific' },
];

// Animal SVG icons (simplified)
const AnimalIcon = ({ type, opacity, onMouseEnter, onMouseLeave }) => {
  const icons = {
    cow: (
      <g opacity={opacity} style={{ cursor: 'pointer' }}>
        <ellipse cx="0" cy="0" rx="6" ry="4" fill="#8B4513" />
        <circle cx="-5" cy="-2" r="2" fill="#8B4513" />
        <circle cx="5" cy="1" r="1.5" fill="#FFF" />
      </g>
    ),
    pig: (
      <g opacity={opacity} style={{ cursor: 'pointer' }}>
        <ellipse cx="0" cy="0" rx="5" ry="4" fill="#FFB6C1" />
        <circle cx="4" cy="0" r="2" fill="#FFB6C1" />
        <circle cx="5" cy="0" r="1" fill="#FF69B4" />
      </g>
    ),
    chicken: (
      <g opacity={opacity} style={{ cursor: 'pointer' }}>
        <ellipse cx="0" cy="0" rx="4" ry="3" fill="#FFF" />
        <circle cx="3" cy="-1" r="1.5" fill="#FFF" />
        <polygon points="4.5,-1 6,-0.5 4.5,0" fill="#FF6600" />
        <polygon points="0,-3 1,-2 -1,-2" fill="#FF0000" />
      </g>
    ),
    fish: (
      <g opacity={opacity} style={{ cursor: 'pointer' }}>
        <ellipse cx="0" cy="0" rx="6" ry="3" fill="#4169E1" />
        <polygon points="-6,0 -10,3 -10,-3" fill="#4169E1" />
        <circle cx="4" cy="-1" r="1" fill="#FFF" />
      </g>
    ),
  };
  return icons[type] || null;
};

// Tooltip component
const Tooltip = ({ info, position }) => {
  if (!info) return null;
  
  const tooltipClass = position.showBelow 
    ? 'pixel-globe__tooltip pixel-globe__tooltip--below' 
    : 'pixel-globe__tooltip';
  
  return (
    <div 
      className={tooltipClass}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="pixel-globe__tooltip-title">{info.title}</div>
      <div className="pixel-globe__tooltip-description">{info.description}</div>
    </div>
  );
};

const PixelGlobe = () => {
  const { indicators, diet, currentYear, isRunning } = useSimulationStore();
  const [hoveredElement, setHoveredElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse events for tooltips
  const handleMouseEnter = useCallback((type, event) => {
    const rect = event.currentTarget.closest('.pixel-globe__frame').getBoundingClientRect();
    
    // Get position relative to the frame
    const x = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    
    // Position tooltip above cursor with enough space (100px offset)
    // If too close to top, position below cursor instead
    const tooltipHeight = 80;
    const offset = 100;
    let y = cursorY - offset;
    let showBelow = false;
    
    if (y < 10) {
      y = cursorY + 30; // Position below cursor
      showBelow = true;
    }
    
    setHoveredElement(type);
    setTooltipPosition({ x, y, showBelow });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredElement(null);
  }, []);
  
  const handleMouseMove = useCallback((event) => {
    if (hoveredElement) {
      const rect = event.currentTarget.closest('.pixel-globe__frame').getBoundingClientRect();
      const x = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      
      const offset = 100;
      let y = cursorY - offset;
      let showBelow = false;
      
      if (y < 10) {
        y = cursorY + 30;
        showBelow = true;
      }
      
      setTooltipPosition({ x, y, showBelow });
    }
  }, [hoveredElement]);
  
  // Calculate visual effect intensities based on indicators
  const effects = useMemo(() => {
    const { biodiversity, co2, landUse, waterUse, population, animalLives } = indicators;
    
    // Normalize CO2 (baseline ~37 Gt, critical ~60+ Gt)
    const co2Normalized = Math.min((co2 - 20) / 40, 1);
    
    // Ice caps: shrink as CO2 increases (scale from 100% to 30%)
    const iceCapsScale = Math.max(0.3, 1 - co2Normalized * 0.7);
    
    // Forest opacity: based on biodiversity (0-100%)
    const forestOpacity = biodiversity / 100;
    
    // Desert coverage: expands as land use increases (baseline 50, max ~80)
    const desertIntensity = Math.min((landUse - 30) / 50, 1);
    
    // Water level drop effect: higher water use = more visible coastline change
    const waterStress = Math.min(waterUse / 100, 1);
    
    // Smog opacity: increases with CO2 (max 60%)
    const smogOpacity = Math.min(co2Normalized * 0.6, 0.6);
    
    // City lights: more population = more visible cities
    const cityLightIntensity = Math.min(population / 10, 1);
    
    // Animal visibility: decreases as more animals are killed
    // Baseline is 1500 billion, lower = better
    const animalVisibility = Math.max(0, Math.min(animalLives / 1500, 1));
    
    // Ocean color: gets darker/greener with pollution
    const oceanHealth = Math.max(0, 1 - co2Normalized * 0.5);
    
    // Land base color: greener with high biodiversity, browner with low
    const landHealth = biodiversity / 100;
    
    return {
      iceCapsScale,
      forestOpacity,
      desertIntensity,
      waterStress,
      smogOpacity,
      cityLightIntensity,
      animalVisibility,
      oceanHealth,
      landHealth,
    };
  }, [indicators]);
  
  // Calculate colors
  const colors = useMemo(() => {
    const { oceanHealth, landHealth } = effects;
    
    // Ocean: healthy blue to polluted murky green-gray
    const oceanR = Math.floor(30 + (1 - oceanHealth) * 40);
    const oceanG = Math.floor(100 + oceanHealth * 80);
    const oceanB = Math.floor(140 + oceanHealth * 60);
    const oceanColor = `rgb(${oceanR}, ${oceanG}, ${oceanB})`;
    
    // Land: healthy green to degraded brown
    const landR = Math.floor(60 + (1 - landHealth) * 100);
    const landG = Math.floor(80 + landHealth * 100);
    const landB = Math.floor(40 + landHealth * 20);
    const landColor = `rgb(${landR}, ${landG}, ${landB})`;
    
    // Forest green
    const forestColor = `rgba(34, ${Math.floor(120 + effects.forestOpacity * 60)}, 34, ${effects.forestOpacity})`;
    
    // Desert color (more intense with higher desert intensity)
    const desertColor = `rgba(210, 180, 140, ${effects.desertIntensity * 0.8})`;
    
    // Ice color
    const iceColor = '#E8F4F8';
    
    // Smog color
    const smogColor = `rgba(120, 100, 80, ${effects.smogOpacity})`;
    
    return { oceanColor, landColor, forestColor, desertColor, iceColor, smogColor };
  }, [effects]);
  
  // Filter visible cities based on population
  const visibleCities = useMemo(() => {
    const count = Math.floor(effects.cityLightIntensity * CITY_POSITIONS.length);
    return CITY_POSITIONS.slice(0, count);
  }, [effects.cityLightIntensity]);
  
  return (
    <div className="pixel-globe section-panel">
      <h3 className="section-panel__title">
        <span className="pixel-globe__title-icon">🌍</span>
        Erde - Jahr {currentYear}
      </h3>
      
      <div className="pixel-globe__container">
        {/* Globe Frame with SVG */}
        <div className={`pixel-globe__frame ${isRunning ? 'pixel-globe__frame--active' : ''}`}>
          <svg 
            viewBox="0 0 500 300" 
            className="pixel-globe__svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Definitions for filters and gradients */}
            <defs>
              {/* Glow filter for city lights */}
              <filter id="cityGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              {/* Smog blur filter */}
              <filter id="smogBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              
              {/* Water gradient for depth effect */}
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.oceanColor} />
                <stop offset="50%" stopColor={colors.oceanColor} />
                <stop offset="100%" style={{ stopColor: 'rgb(20, 60, 100)' }} />
              </linearGradient>
              
              {/* Ice shimmer gradient */}
              <linearGradient id="iceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E8F4F8" />
                <stop offset="100%" stopColor="#B0E0E6" />
              </linearGradient>
            </defs>
            
            {/* Layer 1: Ocean Background */}
            <rect 
              x="0" y="0" 
              width="500" height="300" 
              fill="url(#oceanGradient)"
              className="pixel-globe__ocean pixel-globe__hoverable"
              onMouseEnter={(e) => handleMouseEnter('ocean', e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
            
            {/* Layer 2: Water Level Indicator (rising seas darken edges) */}
            <rect 
              x="0" y="0" 
              width="500" height="300" 
              fill={`rgba(0, 50, 80, ${effects.waterStress * 0.3})`}
              className="pixel-globe__water-stress"
              style={{ pointerEvents: 'none' }}
            />
            
            {/* Layer 3: Continents */}
            <g className="pixel-globe__continents">
              {Object.entries(CONTINENTS).map(([name, path]) => (
                <path
                  key={name}
                  d={path}
                  fill={colors.landColor}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                  className="pixel-globe__continent pixel-globe__hoverable"
                  onMouseEnter={(e) => handleMouseEnter('continent', e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                />
              ))}
            </g>
            
            {/* Layer 4: Forest Overlay */}
            <g className="pixel-globe__forests" style={{ opacity: effects.forestOpacity }}>
              {Object.entries(FOREST_REGIONS).map(([name, path]) => (
                <path
                  key={name}
                  d={path}
                  fill="#228B22"
                  className="pixel-globe__forest pixel-globe__hoverable"
                  onMouseEnter={(e) => handleMouseEnter('forest', e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                />
              ))}
            </g>
            
            {/* Layer 5: Desert Overlay */}
            <g className="pixel-globe__deserts" style={{ opacity: effects.desertIntensity }}>
              {Object.entries(DESERT_REGIONS).map(([name, path]) => (
                <path
                  key={name}
                  d={path}
                  fill="#D2B48C"
                  className="pixel-globe__desert pixel-globe__hoverable"
                  onMouseEnter={(e) => handleMouseEnter('desert', e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                />
              ))}
            </g>
            
            {/* Layer 6: Ice Caps - Each with its own transform origin */}
            <g className="pixel-globe__ice-caps">
              {/* Arctic - shrinks towards top */}
              <path
                d={ICE_CAPS.arctic}
                fill="url(#iceGradient)"
                className="pixel-globe__ice pixel-globe__ice--arctic pixel-globe__hoverable"
                style={{ 
                  transform: `scaleY(${effects.iceCapsScale})`,
                  transformOrigin: 'center top',
                  transformBox: 'fill-box'
                }}
                onMouseEnter={(e) => handleMouseEnter('ice', e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              {/* Antarctica - shrinks towards bottom */}
              <path
                d={ICE_CAPS.antarctica}
                fill="url(#iceGradient)"
                className="pixel-globe__ice pixel-globe__ice--antarctic pixel-globe__hoverable"
                style={{ 
                  transform: `scaleY(${effects.iceCapsScale})`,
                  transformOrigin: 'center bottom',
                  transformBox: 'fill-box'
                }}
                onMouseEnter={(e) => handleMouseEnter('ice', e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
            </g>
            
            {/* Layer 7: City Lights */}
            <g className="pixel-globe__cities" filter="url(#cityGlow)">
              {visibleCities.map((city, i) => (
                <circle
                  key={i}
                  cx={city.x}
                  cy={city.y}
                  r={2 + effects.cityLightIntensity}
                  fill="#FFD700"
                  className="pixel-globe__city pixel-globe__hoverable"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onMouseEnter={(e) => handleMouseEnter('city', e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <title>{city.name}</title>
                </circle>
              ))}
            </g>
            
            {/* Layer 8: Animal Icons */}
            <g className="pixel-globe__animals">
              {ANIMAL_POSITIONS.map((animal, i) => (
                <g 
                  key={i} 
                  transform={`translate(${animal.x}, ${animal.y})`}
                  className="pixel-globe__animal pixel-globe__hoverable"
                  onMouseEnter={(e) => handleMouseEnter(animal.type, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <AnimalIcon 
                    type={animal.type} 
                    opacity={effects.animalVisibility} 
                  />
                </g>
              ))}
            </g>
            
            {/* Layer 9: Smog/Haze Overlay */}
            <g className="pixel-globe__smog" filter="url(#smogBlur)">
              {/* Industrial smog over major regions */}
              <ellipse 
                cx="395" cy="62" 
                rx="60" ry="30" 
                fill={colors.smogColor}
                className="pixel-globe__smog-cloud pixel-globe__hoverable"
                onMouseEnter={(e) => handleMouseEnter('smog', e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              <ellipse 
                cx="255" cy="48" 
                rx="40" ry="20" 
                fill={colors.smogColor}
                className="pixel-globe__smog-cloud pixel-globe__hoverable"
                onMouseEnter={(e) => handleMouseEnter('smog', e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              <ellipse 
                cx="135" cy="68" 
                rx="35" ry="20" 
                fill={colors.smogColor}
                className="pixel-globe__smog-cloud pixel-globe__hoverable"
                onMouseEnter={(e) => handleMouseEnter('smog', e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              <ellipse 
                cx="352" cy="105" 
                rx="30" ry="20" 
                fill={colors.smogColor}
                className="pixel-globe__smog-cloud pixel-globe__hoverable"
                onMouseEnter={(e) => handleMouseEnter('smog', e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
            </g>
            
            {/* Grid overlay for retro effect */}
            <g className="pixel-globe__grid-overlay">
              {Array.from({ length: 11 }, (_, i) => (
                <line 
                  key={`h${i}`}
                  x1="0" y1={i * 30} 
                  x2="500" y2={i * 30}
                  stroke="rgba(0, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 17 }, (_, i) => (
                <line 
                  key={`v${i}`}
                  x1={i * 30} y1="0" 
                  x2={i * 30} y2="300"
                  stroke="rgba(0, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              ))}
            </g>
          </svg>
          
          {/* Scanline effect */}
          <div className="pixel-globe__scanlines" />
          
          {/* Tooltip */}
          <Tooltip 
            info={hoveredElement ? TOOLTIP_INFO[hoveredElement] : null}
            position={tooltipPosition}
          />
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
          <div className="stat-item">
            <span className="stat-icon">💧</span>
            <span className="stat-value">{indicators.waterUse.toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      <div className="pixel-globe__message">
        {indicators.biodiversity > 70 ? (
          <span className="message--good">🌿 Ökosystem stabil</span>
        ) : indicators.biodiversity > 50 ? (
          <span className="message--warning">⚠️ Ökosystem unter Druck</span>
        ) : indicators.biodiversity > 30 ? (
          <span className="message--danger">🚨 Kritischer Zustand!</span>
        ) : (
          <span className="message--critical">💀 Ökologischer Kollaps!</span>
        )}
      </div>
      
      {/* Effect Legend */}
      <div className="pixel-globe__legend">
        <div className="legend-item">
          <span className="legend-color legend-color--forest" />
          <span>Wälder</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--desert" />
          <span>Wüsten</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--ice" />
          <span>Eis</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-color--city" />
          <span>Städte</span>
        </div>
      </div>
    </div>
  );
};

export default PixelGlobe;
