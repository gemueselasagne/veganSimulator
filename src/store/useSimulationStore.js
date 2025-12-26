import { create } from 'zustand';
import { calculateIndicators } from '../simulation/simulationEngine';

// Initial diet distribution (percentages, must sum to 100)
const INITIAL_DIET = {
  vegan: 1,
  vegetarian: 5,
  pescatarian: 3,
  mixed: 85,
  carnivore: 6,
};

// Starting year
const START_YEAR = 2024;

// Initial world population in billions
const INITIAL_POPULATION = 8.1;

// Initial indicator values (baseline 2024)
const INITIAL_INDICATORS = {
  co2: 36.8,           // Billion tonnes CO2/year
  landUse: 50,         // Million km² for agriculture
  waterUse: 70,        // % of freshwater used for agriculture
  healthIndex: 65,     // General health score (0-100)
  population: 8.1,     // Billion people
  biodiversity: 68,    // % of species remaining vs 1970
  foodSecurity: 89,    // % of population with food security
  animalLives: 1500,   // Billion animals (excl. insects) killed/year for food
};

const useSimulationStore = create((set, get) => ({
  // === Simulation State ===
  isRunning: false,
  isPaused: false,
  speed: 1, // Years per second
  currentYear: START_YEAR,
  
  // === Diet Distribution ===
  diet: { ...INITIAL_DIET },
  
  // === Current Indicators ===
  indicators: { ...INITIAL_INDICATORS },
  
  // === History for Graphs ===
  history: [{
    year: START_YEAR,
    ...INITIAL_INDICATORS,
    diet: { ...INITIAL_DIET },
  }],
  
  // === Actions ===
  
  // Update diet percentages (must sum to 100)
  setDiet: (dietType, value) => {
    const { diet } = get();
    const currentValue = diet[dietType];
    const difference = value - currentValue;
    
    // Get other diet types to redistribute
    const otherTypes = Object.keys(diet).filter(t => t !== dietType);
    const otherTotal = otherTypes.reduce((sum, t) => sum + diet[t], 0);
    
    if (otherTotal === 0 && difference > 0) return;
    
    const newDiet = { ...diet, [dietType]: value };
    
    // Redistribute the difference proportionally among others
    otherTypes.forEach(type => {
      const proportion = diet[type] / otherTotal;
      newDiet[type] = Math.max(0, Math.round((diet[type] - difference * proportion) * 10) / 10);
    });
    
    // Ensure sum is exactly 100
    const sum = Object.values(newDiet).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) > 0.1) {
      const adjustment = 100 - sum;
      const largestOther = otherTypes.reduce((max, t) => 
        newDiet[t] > newDiet[max] ? t : max, otherTypes[0]);
      newDiet[largestOther] = Math.max(0, newDiet[largestOther] + adjustment);
    }
    
    set({ diet: newDiet });
  },
  
  // Set speed multiplier
  setSpeed: (speed) => set({ speed: Math.max(0.5, Math.min(10, speed)) }),
  
  // Start simulation
  start: () => {
    const { isRunning } = get();
    if (!isRunning) {
      set({ isRunning: true, isPaused: false });
    }
  },
  
  // Pause simulation
  pause: () => set({ isPaused: true }),
  
  // Resume simulation
  resume: () => set({ isPaused: false }),
  
  // Stop simulation
  stop: () => set({ isRunning: false, isPaused: false }),
  
  // Reset simulation to initial state
  reset: () => set({
    isRunning: false,
    isPaused: false,
    currentYear: START_YEAR,
    diet: { ...INITIAL_DIET },
    indicators: { ...INITIAL_INDICATORS },
    history: [{
      year: START_YEAR,
      ...INITIAL_INDICATORS,
      diet: { ...INITIAL_DIET },
    }],
  }),
  
  // Advance simulation by one year
  tick: () => {
    const { currentYear, diet, indicators, history, isRunning, isPaused } = get();
    
    if (!isRunning || isPaused) return;
    
    const newYear = currentYear + 1;
    const newIndicators = calculateIndicators(diet, indicators, newYear);
    
    const historyEntry = {
      year: newYear,
      ...newIndicators,
      diet: { ...diet },
    };
    
    set({
      currentYear: newYear,
      indicators: newIndicators,
      history: [...history, historyEntry],
    });
  },
  
  // Get diet color
  getDietColor: (dietType) => {
    const colors = {
      vegan: '#39ff14',
      vegetarian: '#7fff00',
      pescatarian: '#00bfff',
      mixed: '#ffaa00',
      carnivore: '#ff4444',
    };
    return colors[dietType] || '#ffffff';
  },
  
  // Get indicator info
  getIndicatorInfo: (indicatorKey) => {
    const info = {
      co2: {
        label: 'CO2 Emissionen',
        unit: 'Gt/Jahr',
        icon: '☁️',
        color: '#ff6b35',
        description: 'Jährliche CO2-Emissionen',
        goodDirection: 'down',
      },
      landUse: {
        label: 'Landnutzung',
        unit: 'Mio km²',
        icon: '🌍',
        color: '#8b4513',
        description: 'Landwirtschaftliche Fläche',
        goodDirection: 'down',
      },
      waterUse: {
        label: 'Wasserverbrauch',
        unit: '%',
        icon: '💧',
        color: '#1e90ff',
        description: 'Süßwasser für Landwirtschaft',
        goodDirection: 'down',
      },
      healthIndex: {
        label: 'Gesundheit',
        unit: 'Index',
        icon: '❤️',
        color: '#ff69b4',
        description: 'Globaler Gesundheitsindex',
        goodDirection: 'up',
      },
      population: {
        label: 'Bevölkerung',
        unit: 'Mrd',
        icon: '👥',
        color: '#ffd700',
        description: 'Weltbevölkerung',
        goodDirection: 'neutral',
      },
      biodiversity: {
        label: 'Biodiversität',
        unit: '%',
        icon: '🦋',
        color: '#32cd32',
        description: 'Artenvielfalt vs 1970',
        goodDirection: 'up',
      },
      foodSecurity: {
        label: 'Ernährungssicherheit',
        unit: '%',
        icon: '🌾',
        color: '#daa520',
        description: 'Bevölkerung mit Zugang',
        goodDirection: 'up',
      },
      animalLives: {
        label: 'Tierleben',
        unit: 'Mrd/Jahr',
        icon: '🐄',
        color: '#c41e3a',
        description: 'Getötete Tiere (ohne Insekten)',
        goodDirection: 'down',
      },
    };
    return info[indicatorKey] || {};
  },
}));

export default useSimulationStore;

