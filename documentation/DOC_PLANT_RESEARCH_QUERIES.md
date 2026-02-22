# Plant Research Queries for Realistic Values

Use these questions with Google or Gemini to find realistic environment values for each plant. Target scale: 0–100 (or convert to it). For temperature use °C; for light use hours; for pH use 3.5–9.5.

---

## Plants in Database

| id | type |
|----|------|
| cannabis-sativa | cannabis-sativa |
| Chestnut | Chestnut |
| comfrey | comfrey |
| Garlic | Garlic |
| Goumi | Goumi |
| Hardy Kiwi | Hardy Kiwi |
| Mulberry | Mulberry |
| Strawberry | Strawberry |
| tomato | tomato |

*(Exclude: test-plant – placeholder)*

---

## Variable Definitions & Target Scales

| Var | Name | Scale | Unit | Notes |
|-----|------|-------|------|-------|
| T | Temperature | 0–100 | °C | Optimal growing temp; map -5°C→0, 35°C→100 |
| L | Light | 0–100 | hours/day | Optimal daily light; map 0→0, 16→100 |
| F | Fertility | 0–100 | % | Soil fertility / nutrient level |
| P | Porosity | 0–100 | % | Drainage / soil looseness |
| M | Moisture | 0–100 | % | Soil moisture / water needs |
| A | Acidity | 3.5–9.5 | pH | Soil pH (direct, no conversion) |
| S | Soil quality | 0–100 | % | Composite of P+F+A; or general soil preference |
| W | Wind resistance | 0–100 | % | Tolerance to wind exposure |
| R | Pest resistance | 0–100 | % | Resistance to pests/diseases |

---

## Search Questions by Variable

### Temperature (T) – optimal growing temperature °C

- "[plant name] optimal growing temperature Celsius"
- "[plant name] ideal temperature range for growth"
- "[plant name] minimum and maximum temperature tolerance"
- "[plant name] cold hardiness zone USDA"

### Light (L) – hours of light per day

- "[plant name] hours of sunlight needed per day"
- "[plant name] light requirements full sun partial shade"
- "[plant name] optimal day length for growth"
- "[plant name] photoperiod requirements"

### Fertility (F) – soil nutrient level 0–100

- "[plant name] soil fertility requirements"
- "[plant name] nutrient needs low medium high"
- "[plant name] fertilizer requirements"
- "[plant name] soil nitrogen phosphorus potassium needs"

### Porosity (P) – drainage / soil structure 0–100

- "[plant name] soil drainage requirements"
- "[plant name] prefers sandy loam clay soil"
- "[plant name] well-drained soil needs"
- "[plant name] soil texture preferences"

### Moisture (M) – water / humidity 0–100

- "[plant name] water requirements drought tolerant"
- "[plant name] soil moisture needs"
- "[plant name] watering frequency"
- "[plant name] humidity requirements"

### Acidity (A) – soil pH 3.5–9.5

- "[plant name] soil pH requirements"
- "[plant name] acidic alkaline soil preference"
- "[plant name] optimal pH for growth"
- "[plant name] lime tolerant acid loving"

### Soil quality (S) – composite or general 0–100

- "[plant name] soil type preferences"
- "[plant name] best soil conditions"
- "[plant name] soil quality requirements"
- *Or compute from P, F, A: S = (P + F + normalized_A) / 3*

### Wind resistance (W) – 0–100

- "[plant name] wind tolerance"
- "[plant name] wind resistant"
- "[plant name] sheltered position requirements"
- "[plant name] exposure tolerance coastal wind"

### Pest resistance (R) – 0–100

- "[plant name] pest resistance"
- "[plant name] disease resistance"
- "[plant name] common pests and diseases"
- "[plant name] pest and disease susceptibility"

---

## Example Prompt for Gemini

```
I need realistic environment values for these plants for a gardening/game database.
Target scale 0–100 for most variables; temperature in °C; light in hours; pH 3.5–9.5.

Plants: cannabis-sativa, Chestnut, comfrey, Garlic, Goumi, Hardy Kiwi, Mulberry, Strawberry, tomato

For each plant, find and report:
- T (optimal temp °C)
- L (hours light/day)
- F (fertility 0–100)
- P (porosity/drainage 0–100)
- M (moisture 0–100)
- A (soil pH)
- W (wind resistance 0–100)
- R (pest resistance 0–100)

Use search queries like "[plant] optimal growing temperature", "[plant] soil pH requirements", "[plant] wind tolerance", etc.
Convert qualitative terms (low/medium/high) to 0–100 where needed.
```

---

## Batch Search Template (one plant)

```
[Plant: e.g. Tomato]

1. Tomato optimal growing temperature Celsius
2. Tomato hours sunlight per day
3. Tomato soil fertility requirements
4. Tomato soil drainage porosity
5. Tomato water moisture requirements
6. Tomato soil pH requirements
7. Tomato wind tolerance resistance
8. Tomato pest disease resistance
```
