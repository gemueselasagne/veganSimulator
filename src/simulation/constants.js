// ===== VEGAN SIMULATOR - SIMULATION CONSTANTS =====
// Based on scientific research and environmental data

// === CO2 Emissions per Diet Type (tonnes per person per year) ===
// Source: Poore & Nemecek (2018), Scarborough et al. (2014)
export const CO2_PER_DIET = {
  vegan: 1.5,        // Plant-based only
  vegetarian: 2.5,   // No meat, includes dairy/eggs
  pescatarian: 2.9,  // Includes fish
  mixed: 3.8,        // Average omnivore
  carnivore: 5.5,    // Heavy meat consumption
};

// === Land Use per Diet Type (hectares per person per year) ===
// Source: Our World in Data, Poore & Nemecek (2018)
export const LAND_USE_PER_DIET = {
  vegan: 0.13,       // Minimal land for crops
  vegetarian: 0.25,  // Some dairy requires pasture
  pescatarian: 0.22, // Fish farming + crops
  mixed: 0.43,       // Average agricultural footprint
  carnivore: 0.65,   // High land for livestock
};

// === Water Use per Diet Type (cubic meters per person per day) ===
// Source: Water Footprint Network
export const WATER_USE_PER_DIET = {
  vegan: 1.1,        // Lowest water footprint
  vegetarian: 1.8,   // Dairy adds significant water
  pescatarian: 1.5,  // Fish is water-efficient
  mixed: 2.5,        // Average consumption
  carnivore: 3.5,    // Beef especially water-intensive
};

// === Health Impact Factors per Diet Type ===
// Based on epidemiological studies: WHO, IARC, Harvard Health
// Higher = better health outcomes
export const HEALTH_FACTOR_PER_DIET = {
  vegan: 1.15,       // Lower heart disease, diabetes risk
  vegetarian: 1.10,  // Good health outcomes
  pescatarian: 1.08, // Omega-3 benefits
  mixed: 1.00,       // Baseline
  carnivore: 0.88,   // Higher processed meat risks
};

// === Biodiversity Impact Factors ===
// Relative impact on species preservation
// Lower value = more negative impact
export const BIODIVERSITY_FACTOR_PER_DIET = {
  vegan: 0.02,       // Minimal habitat destruction
  vegetarian: 0.05,  // Some dairy farming impact
  pescatarian: 0.08, // Overfishing concerns
  mixed: 0.12,       // Moderate impact
  carnivore: 0.18,   // Significant habitat loss
};

// === Food Efficiency Factors ===
// How efficiently diet converts resources to food
// Higher = more efficient, better food security
export const FOOD_EFFICIENCY_PER_DIET = {
  vegan: 1.0,        // Direct consumption of crops
  vegetarian: 0.7,   // Some feed conversion loss
  pescatarian: 0.65, // Fish farming efficiency varies
  mixed: 0.4,        // Significant feed conversion loss
  carnivore: 0.25,   // Highly inefficient calorie conversion
};

// === Animals Killed per Diet Type (all animals EXCEPT insects, per person per year) ===
// Source: FAO, Our World in Data, Fishcount.org.uk, Faunalytics
// Includes: 
//   - Vertebrates: cattle, pigs, chickens, fish, sheep, goats, etc.
//   - Invertebrates (non-insect): shrimp, prawns, crabs, lobsters, 
//     mollusks (mussels, clams, oysters, squid, octopus), etc.
// Note: Fish and crustaceans (esp. shrimp) make up the vast majority
// Estimates: ~1-2 trillion fish/year, ~300-500 billion crustaceans/year, 
//            ~100 billion mollusks/year, ~70 billion land animals/year
export const ANIMALS_KILLED_PER_DIET = {
  vegan: 0,          // No animal products
  vegetarian: 3,     // Indirect deaths (male chicks, bycatch for dairy)
  pescatarian: 250,  // High fish/seafood consumption (incl. shrimp, shellfish)
  mixed: 180,        // Average omnivore (fish, meat, seafood)
  carnivore: 350,    // Heavy meat & seafood consumption
};

// === Population Growth Factors ===
// Annual growth rate modifications
export const POPULATION_BASE_GROWTH = 0.009; // ~0.9% base growth rate

// === Baseline Values (2024) ===
export const BASELINES = {
  worldPopulation: 8.1,     // Billion people
  co2Emissions: 36.8,       // Gigatonnes/year (all sources)
  foodCo2Share: 0.26,       // Food system is ~26% of emissions
  agriculturalLand: 50,     // Million km²
  freshwaterUse: 70,        // % used for agriculture
  biodiversityIndex: 68,    // % remaining vs 1970 baseline
  foodSecurityIndex: 89,    // % with adequate food access
  healthIndex: 65,          // Global health score
  animalLives: 1500,        // Billion animals (excl. insects) killed/year for food
                            // Includes: ~1-2T fish, ~400B crustaceans, ~100B mollusks, ~70B land animals
};

// === Simulation Parameters ===
export const SIMULATION = {
  startYear: 2024,
  maxYear: 2200,
  ticksPerSecond: 1,
  speedOptions: [0.5, 1, 2, 5, 10],
};

// === Diet Labels (German) ===
export const DIET_LABELS = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarisch',
  pescatarian: 'Pesketarisch',
  mixed: 'Gemischt',
  carnivore: 'Carnivor',
};

// === Indicator Labels (German) ===
export const INDICATOR_LABELS = {
  co2: 'CO₂ Emissionen',
  landUse: 'Landnutzung',
  waterUse: 'Wasserverbrauch',
  healthIndex: 'Gesundheitsindex',
  population: 'Bevölkerung',
  biodiversity: 'Biodiversität',
  foodSecurity: 'Ernährungssicherheit',
  animalLives: 'Tierleben',
};

