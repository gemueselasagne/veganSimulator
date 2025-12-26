# 🥬 Vegan Simulator 🌍

An interactive web-based simulation that visualizes the global environmental, health, and ethical impacts of dietary choices. Adjust the world's diet distribution and watch how it affects our planet over time.

![Vegan Simulator](https://img.shields.io/badge/version-1.0-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple)

## 🎮 Features

- **Real-time Simulation**: Watch environmental indicators change as years progress
- **Interactive Diet Controls**: Adjust the global population distribution across 5 diet types
- **8 Environmental & Health Indicators**: Track CO₂, land use, water use, health, population, biodiversity, food security, and animal lives
- **Retro Pixel Art Aesthetic**: CRT-style visuals with animated pixel globe
- **Timeline Graphs**: Visualize historical trends of all indicators
- **Keyboard Controls**: Space to play/pause, arrow keys to adjust speed

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 How to Use

1. **Adjust Diet Distribution**: Use the sliders to set the percentage of the global population following each diet type (Vegan, Vegetarian, Pescatarian, Mixed, Carnivore)
2. **Start Simulation**: Press SPACE or click the Play button
3. **Observe Changes**: Watch how the indicators evolve over time
4. **Experiment**: Try different scenarios - what happens if 50% of the world goes vegan? What about 100%?

### Controls

| Key | Action |
|-----|--------|
| Space | Play/Pause simulation |
| ↑ / → | Increase speed |
| ↓ / ← | Decrease speed |

---

## 🔬 The Science Behind the Simulator

This simulator is built on peer-reviewed scientific research and data from reputable organizations. Here's a breakdown of the science behind each metric:

### 📊 Diet Types Modeled

| Diet | Description | % of Current Population |
|------|-------------|------------------------|
| **Vegan** | No animal products | ~1% |
| **Vegetarian** | No meat, includes dairy/eggs | ~5% |
| **Pescatarian** | No meat except fish/seafood | ~3% |
| **Mixed (Omnivore)** | Average global diet | ~85% |
| **Carnivore** | High meat consumption | ~6% |

### 🌡️ CO₂ Emissions

**Sources**: Poore & Nemecek (2018), Scarborough et al. (2014)

Food systems account for approximately **26% of global greenhouse gas emissions**. The carbon footprint varies dramatically by diet:

| Diet | CO₂ (tonnes/person/year) |
|------|--------------------------|
| Vegan | 1.5 |
| Vegetarian | 2.5 |
| Pescatarian | 2.9 |
| Mixed | 3.8 |
| Carnivore | 5.5 |

**Key Insight**: A vegan diet produces **60% less** food-related emissions than a high-meat diet. This is primarily due to:
- Livestock methane emissions (cattle, sheep)
- Feed crop production energy
- Land use change (deforestation for grazing)

### 🌍 Land Use

**Sources**: Our World in Data, Poore & Nemecek (2018)

Agriculture uses approximately **50 million km²** globally - about 50% of habitable land. Livestock farming is incredibly land-intensive:

| Diet | Land Use (hectares/person/year) |
|------|---------------------------------|
| Vegan | 0.13 |
| Vegetarian | 0.25 |
| Pescatarian | 0.22 |
| Mixed | 0.43 |
| Carnivore | 0.65 |

**Key Insight**: A vegan diet requires **80% less** land than a carnivore diet. This is because:
- Livestock need grazing land
- Feed crops require additional agricultural land
- 77% of agricultural land is used for livestock but produces only 18% of calories

### 💧 Water Use

**Source**: Water Footprint Network

Agriculture accounts for approximately **70% of freshwater withdrawals** globally. Animal products have significantly higher water footprints:

| Diet | Water Use (m³/person/day) |
|------|--------------------------|
| Vegan | 1.1 |
| Vegetarian | 1.8 |
| Pescatarian | 1.5 |
| Mixed | 2.5 |
| Carnivore | 3.5 |

**Key Insight**: Producing 1kg of beef requires approximately **15,000 liters** of water, compared to 1,500 liters for 1kg of wheat.

### ❤️ Health Impact

**Sources**: World Health Organization (WHO), International Agency for Research on Cancer (IARC), Harvard Health Studies

Diet significantly impacts chronic disease risk:

| Diet | Health Factor | Notes |
|------|--------------|-------|
| Vegan | 1.15 | Lower rates of heart disease, type 2 diabetes, certain cancers |
| Vegetarian | 1.10 | Reduced cardiovascular risk |
| Pescatarian | 1.08 | Omega-3 benefits from fish |
| Mixed | 1.00 | Baseline |
| Carnivore | 0.88 | Higher processed meat consumption linked to health risks |

**Key Research**:
- IARC classified processed meat as Group 1 carcinogen
- Adventist Health Studies show vegetarians live 3-7 years longer on average
- Plant-based diets reduce heart disease risk by up to 40%

### 🦋 Biodiversity

**Source**: WWF Living Planet Report, IPBES Global Assessment

The current biodiversity index stands at approximately **68%** compared to 1970 levels - we've lost nearly a third of wildlife populations.

**Diet Impact on Biodiversity**:
- Animal agriculture is the leading cause of habitat destruction
- 80% of Amazon deforestation is linked to cattle ranching
- Fishing causes significant marine ecosystem disruption

| Diet | Annual Biodiversity Loss Factor |
|------|--------------------------------|
| Vegan | 0.02 |
| Vegetarian | 0.05 |
| Pescatarian | 0.08 |
| Mixed | 0.12 |
| Carnivore | 0.18 |

### 🌾 Food Security & Efficiency

**Concept**: Trophic Level Energy Transfer

When animals eat plants, only ~10% of the energy is converted to meat (the "10% rule" in ecology). This creates massive inefficiency:

| Diet | Food Efficiency Factor |
|------|----------------------|
| Vegan | 1.0 (direct plant consumption) |
| Vegetarian | 0.7 |
| Pescatarian | 0.65 |
| Mixed | 0.4 |
| Carnivore | 0.25 |

**Key Insight**: The world currently produces enough food to feed 10 billion people, but much of it feeds livestock instead of humans. A shift toward plant-based diets could significantly improve global food security.

### 🐄 Animal Lives

**Sources**: FAO, Fishcount.org.uk, Faunalytics

The simulator tracks all animals killed for food **excluding insects**:

| Category | Approximate Annual Deaths (Billions) |
|----------|-------------------------------------|
| Fish | 1,000-2,000 |
| Crustaceans (shrimp, crabs) | 300-500 |
| Mollusks (mussels, squid) | ~100 |
| Land Animals | ~70 |
| **Total (estimated)** | **~1,500 billion** |

| Diet | Animals Killed (per person/year) |
|------|--------------------------------|
| Vegan | 0 |
| Vegetarian | ~3 (indirect: male chicks, etc.) |
| Pescatarian | ~250 (high fish/seafood) |
| Mixed | ~180 |
| Carnivore | ~350 |

---

## 📚 Scientific References

1. **Poore, J., & Nemecek, T. (2018)**. "Reducing food's environmental impacts through producers and consumers." *Science*, 360(6392), 987-992. [DOI: 10.1126/science.aaq0216](https://www.science.org/doi/10.1126/science.aaq0216)

2. **Scarborough, P., et al. (2014)**. "Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK." *Climatic Change*, 125(2), 179-192.

3. **Our World in Data** - Environmental Impacts of Food Production. [ourworldindata.org/environmental-impacts-of-food](https://ourworldindata.org/environmental-impacts-of-food)

4. **Water Footprint Network** - Product Water Footprints. [waterfootprint.org](https://waterfootprint.org)

5. **IPBES (2019)** - Global Assessment Report on Biodiversity and Ecosystem Services.

6. **WWF Living Planet Report (2022)** - Wildlife population trends.

7. **Fishcount.org.uk** - Estimating numbers of fish caught.

8. **FAO** - Food and Agriculture Organization livestock statistics.

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **Zustand** - State management
- **Recharts** - Timeline graphs
- **Custom CSS** - Retro pixel art aesthetic

## 📁 Project Structure

```
src/
├── components/
│   ├── DietSliders/      # Diet distribution controls
│   ├── IndicatorPanel/   # Environmental metrics display
│   ├── PixelGlobe/       # Animated pixel art globe
│   ├── SimulationControls/ # Play/pause/speed controls
│   ├── TimelineGraph/    # Historical data visualization
│   └── YearDisplay/      # Current simulation year
├── simulation/
│   ├── constants.js      # Scientific constants & baselines
│   └── simulationEngine.js # Core simulation calculations
├── store/
│   └── useSimulationStore.js # Global state management
└── styles/
    ├── pixelArt.css      # Retro styling
    └── variables.css     # CSS custom properties
```

## 🤝 Contributing

Contributions are welcome! If you have access to more recent scientific data or can improve the simulation models, please open a pull request.

## ⚠️ Disclaimer

This simulator is for educational purposes. While based on scientific research, it uses simplified models and should not be used for policy decisions. Real-world outcomes depend on many factors not captured here.

## 📄 License

MIT License - Feel free to use, modify, and distribute.

---

*"The greatest threat to our planet is the belief that someone else will save it."* — Robert Swan
