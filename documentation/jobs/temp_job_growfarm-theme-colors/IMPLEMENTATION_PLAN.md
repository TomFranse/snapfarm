# GrowFarm Theme Colors

## Foundation Validation
- **What was tested:** Color values from `documentation/theme-inspiration/material-theme-growfarm.json` (dark scheme)
- **Result:** All colors extracted and applied to `src/shared/theme/defaultTheme.ts`

## User Stories
- As a user, I see the app in GrowFarm theme colors (green primary, sage secondary, earth tones) instead of the previous purple/pink scheme.

## Implementation Phases

### Phase 1: Apply GrowFarm Palette (Completed)
- **Risk:** 🟢 Low
- **Work:**
  - Replace COLORS constant with dark scheme values from material-theme-growfarm.json
  - Update palette (primary, secondary, background, text, error, divider, game)
  - Update button gradient (primaryContainer → primary)
  - Update game.variableColors to extended colors (Earth, Water, Plant, Grain, Grape, Tertiary, ReqTemperature)
  - Update button text hover and contained contrast
- **Gate:** Theme compiles without errors; no hardcoded colors outside theme file
- **Files:** `src/shared/theme/defaultTheme.ts`

## Technical Notes
- **Source:** Dark scheme from `material-theme-growfarm.json`
- **Mapping:** primary=#A4D397, secondary=#BBCCB2, background=#11140F, paper=#191D17 (surfaceContainerLow), text=#E1E4DA/#C2C8BC
- **Game variableColors:** Earth, Water, Plant, Grain, Grape, Tertiary, ReqTemperature from extended theme
- **Typography:** Montserrat retained (GrowFarm theme uses Montaga; user specified theme document only)
