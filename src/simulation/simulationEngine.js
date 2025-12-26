// ===== VEGAN SIMULATOR - SIMULATION ENGINE =====
// Calculates environmental and health indicators based on diet distribution

import {
  CO2_PER_DIET,
  LAND_USE_PER_DIET,
  WATER_USE_PER_DIET,
  HEALTH_FACTOR_PER_DIET,
  BIODIVERSITY_FACTOR_PER_DIET,
  FOOD_EFFICIENCY_PER_DIET,
  ANIMALS_KILLED_PER_DIET,
  POPULATION_BASE_GROWTH,
  BASELINES,
} from './constants';

/**
 * Calculate weighted average based on diet distribution
 * @param {Object} diet - Diet percentages {vegan, vegetarian, pescatarian, mixed, carnivore}
 * @param {Object} factors - Factor values per diet type
 * @returns {number} Weighted average
 */
const weightedAverage = (diet, factors) => {
  return Object.keys(diet).reduce((sum, dietType) => {
    const percentage = diet[dietType] / 100;
    const factor = factors[dietType] || 0;
    return sum + percentage * factor;
  }, 0);
};

/**
 * Calculate CO2 emissions
 * @param {Object} diet - Diet distribution
 * @param {number} population - World population in billions
 * @returns {number} CO2 emissions in Gt/year
 */
const calculateCO2 = (diet, population) => {
  const avgCO2PerPerson = weightedAverage(diet, CO2_PER_DIET);
  const foodCO2 = avgCO2PerPerson * population; // Billion tonnes
  
  // Non-food emissions (energy, transport, industry) - grows slowly
  const nonFoodCO2 = BASELINES.co2Emissions * (1 - BASELINES.foodCo2Share);
  
  // Total emissions
  const totalCO2 = foodCO2 + nonFoodCO2;
  
  return Math.round(totalCO2 * 10) / 10;
};

/**
 * Calculate agricultural land use
 * @param {Object} diet - Diet distribution
 * @param {number} population - World population in billions
 * @returns {number} Land use in million km²
 */
const calculateLandUse = (diet, population) => {
  const avgLandPerPerson = weightedAverage(diet, LAND_USE_PER_DIET);
  // Convert hectares to million km² (1 million km² = 100 million hectares)
  const landUse = avgLandPerPerson * population * 10;
  
  // Ensure within reasonable bounds
  return Math.round(Math.max(10, Math.min(80, landUse)) * 10) / 10;
};

/**
 * Calculate water use percentage
 * @param {Object} diet - Diet distribution
 * @param {number} population - World population in billions
 * @returns {number} Water use as percentage of freshwater
 */
const calculateWaterUse = (diet, population) => {
  const avgWaterPerPerson = weightedAverage(diet, WATER_USE_PER_DIET);
  const baseWater = BASELINES.freshwaterUse;
  
  // Reference: current diet at 8.1 billion uses ~70%
  const referenceConsumption = 2.5 * 8.1; // Current average * current population
  const newConsumption = avgWaterPerPerson * population;
  
  const waterUse = baseWater * (newConsumption / referenceConsumption);
  
  // Cap between 30% and 95%
  return Math.round(Math.max(30, Math.min(95, waterUse)) * 10) / 10;
};

/**
 * Calculate global health index
 * @param {Object} diet - Diet distribution
 * @param {number} previousHealth - Previous health index
 * @returns {number} Health index (0-100)
 */
const calculateHealth = (diet, previousHealth) => {
  const avgHealthFactor = weightedAverage(diet, HEALTH_FACTOR_PER_DIET);
  
  // Health changes slowly over time
  const targetHealth = BASELINES.healthIndex * avgHealthFactor;
  const changeRate = 0.05; // 5% movement toward target per year
  
  const newHealth = previousHealth + (targetHealth - previousHealth) * changeRate;
  
  // Cap between 40 and 95
  return Math.round(Math.max(40, Math.min(95, newHealth)) * 10) / 10;
};

/**
 * Calculate world population
 * @param {Object} diet - Diet distribution
 * @param {number} previousPopulation - Previous population in billions
 * @param {number} foodSecurity - Food security index
 * @returns {number} Population in billions
 */
const calculatePopulation = (diet, previousPopulation, foodSecurity) => {
  // Base growth rate modified by food security
  const foodSecurityFactor = foodSecurity / 100;
  
  // Growth rate decreases as food security decreases
  const growthRate = POPULATION_BASE_GROWTH * foodSecurityFactor;
  
  // Also factor in health-related mortality
  const healthFactor = weightedAverage(diet, HEALTH_FACTOR_PER_DIET);
  const adjustedGrowth = growthRate * (0.5 + healthFactor * 0.5);
  
  // Apply growth
  const newPopulation = previousPopulation * (1 + adjustedGrowth);
  
  // Soft cap around 15 billion
  const carryingCapacity = 15;
  const cappedPopulation = newPopulation > carryingCapacity 
    ? carryingCapacity - (carryingCapacity - newPopulation) * 0.1
    : newPopulation;
  
  return Math.round(cappedPopulation * 100) / 100;
};

/**
 * Calculate biodiversity index
 * @param {Object} diet - Diet distribution
 * @param {number} previousBiodiversity - Previous biodiversity index
 * @param {number} landUse - Current land use
 * @returns {number} Biodiversity index (0-100)
 */
const calculateBiodiversity = (diet, previousBiodiversity, landUse) => {
  const avgBioFactor = weightedAverage(diet, BIODIVERSITY_FACTOR_PER_DIET);
  
  // Land use heavily impacts biodiversity
  const landPressure = landUse / BASELINES.agriculturalLand;
  
  // Annual change in biodiversity
  const annualLoss = avgBioFactor * landPressure;
  
  // Biodiversity can slowly recover if pressure is low
  const recoveryRate = landPressure < 0.8 ? 0.002 : 0;
  
  const newBiodiversity = previousBiodiversity - annualLoss + recoveryRate * (100 - previousBiodiversity);
  
  // Cap between 10 and 100
  return Math.round(Math.max(10, Math.min(100, newBiodiversity)) * 10) / 10;
};

/**
 * Calculate food security index
 * @param {Object} diet - Diet distribution
 * @param {number} population - World population
 * @param {number} landUse - Agricultural land use
 * @returns {number} Food security index (0-100)
 */
const calculateFoodSecurity = (diet, population, landUse) => {
  const avgEfficiency = weightedAverage(diet, FOOD_EFFICIENCY_PER_DIET);
  
  // Food production capacity based on land and efficiency
  const productionCapacity = landUse * avgEfficiency * 10;
  
  // Population demand
  const demand = population * 1.2; // Base demand per billion people
  
  // Security ratio
  const securityRatio = productionCapacity / demand;
  
  // Convert to index (100 = fully secure)
  const foodSecurity = Math.min(100, securityRatio * 100);
  
  return Math.round(Math.max(30, foodSecurity) * 10) / 10;
};

/**
 * Calculate annual animals killed for food (all animals except insects)
 * Includes: vertebrates (land animals, fish) and invertebrates (crustaceans, mollusks)
 * @param {Object} diet - Diet distribution
 * @param {number} population - World population in billions
 * @returns {number} Animals killed in billions per year
 */
const calculateAnimalLives = (diet, population) => {
  const avgAnimalsPerPerson = weightedAverage(diet, ANIMALS_KILLED_PER_DIET);
  const totalAnimals = avgAnimalsPerPerson * population;
  
  return Math.round(totalAnimals * 10) / 10;
};

/**
 * Main calculation function - calculates all indicators for the next year
 * @param {Object} diet - Current diet distribution
 * @param {Object} currentIndicators - Current indicator values
 * @param {number} year - Current year
 * @returns {Object} New indicator values
 */
export const calculateIndicators = (diet, currentIndicators, year) => {
  const {
    co2,
    landUse,
    waterUse,
    healthIndex,
    population,
    biodiversity,
    foodSecurity,
    animalLives,
  } = currentIndicators;
  
  // Calculate new values
  const newPopulation = calculatePopulation(diet, population, foodSecurity);
  const newLandUse = calculateLandUse(diet, newPopulation);
  const newCO2 = calculateCO2(diet, newPopulation);
  const newWaterUse = calculateWaterUse(diet, newPopulation);
  const newBiodiversity = calculateBiodiversity(diet, biodiversity, newLandUse);
  const newFoodSecurity = calculateFoodSecurity(diet, newPopulation, newLandUse);
  const newHealth = calculateHealth(diet, healthIndex);
  const newAnimalLives = calculateAnimalLives(diet, newPopulation);
  
  return {
    co2: newCO2,
    landUse: newLandUse,
    waterUse: newWaterUse,
    healthIndex: newHealth,
    population: newPopulation,
    biodiversity: newBiodiversity,
    foodSecurity: newFoodSecurity,
    animalLives: newAnimalLives,
  };
};

/**
 * Get trend direction for an indicator
 * @param {Array} history - History array
 * @param {string} indicator - Indicator key
 * @returns {string} 'up', 'down', or 'stable'
 */
export const getTrend = (history, indicator) => {
  if (history.length < 2) return 'stable';
  
  const recent = history.slice(-5);
  const first = recent[0][indicator];
  const last = recent[recent.length - 1][indicator];
  const change = ((last - first) / first) * 100;
  
  if (change > 1) return 'up';
  if (change < -1) return 'down';
  return 'stable';
};

/**
 * Calculate percentage change from baseline
 * @param {number} current - Current value
 * @param {number} baseline - Baseline value
 * @returns {number} Percentage change
 */
export const getChangeFromBaseline = (current, baseline) => {
  return Math.round(((current - baseline) / baseline) * 1000) / 10;
};

