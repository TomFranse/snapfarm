# Plant Random Hand – Random Chance for Database Plants in Player's Hand

## Phase 1: Pre-Development Analysis

### 1.1 Branch & Workflow Check
- [ ] Verify branch to be: `experimental` (workflow/RULE.md)

### 1.2 Rule Decision Tree

**Backend/Secrets?** NO → Skip

**Database changes?** NO → Skip (read-only: fetching plants; no schema changes)

**File placement?** Yes – per `file-placement/RULE.md` and `architecture/RULE.md`:
- New service function: `features/plants/services/plantsService.ts` (extend existing)
- Plant→GameCard converter: `features/card-game/services/` (consumer owns transform per architecture)
- Hook/state changes: `features/card-game/hooks/useGameState.ts`, `context/GameProvider.tsx`

**Code structure?** Per `architecture/RULE.md`:
- Cross-feature: card-game consumes plants data; consumer feature owns Plant→GameCard transform
- Import direction: card-game may import from plants (services, types) – downward flow

**Security?** No auth changes; plants table is read-only. No new secrets.

### 1.3 Risk & Impact Assessment
- **Breaking changes:** None – additive only
- **Impact:** Low – extends existing `generateCard` flow
- **Testability:** Manual – play cards, observe plant cards appear with configured chance
- **High-risk?** No – no DB writes, no auth, no cloud functions

---

## Phase 2: Requirements & Design

### 2.1 User Stories

**US1:** As a player, when I draw a new card (after playing one), there is a configurable random chance that the card is a real plant from the database instead of a randomly generated one.

**US2:** As a player, plant cards use the plant's actual environment values (L, S, M, W, R, T, F) scaled to the 0–10 card game scale, so they feel consistent with the plant detail view.

**US3:** As a player, plant cards use the plant's actual effects (delta_t, delta_l, etc.) mapped to up/down/neutral, so adjacency behavior matches the plant's real characteristics.

**Acceptance criteria:**
- Happy path: With X% chance, replacement card is a database plant; otherwise random
- Plants excluded: `test-plant` excluded from pool
- Null handling: Missing opt values → 0 (or sensible default)
- Initial hand: TBD (see Decision Point 2.5)
- Loading: Plants fetched on game mount; if not yet loaded, fallback to random card

### 2.1.1 User Journey & State Transition Mapping

**Initial States:**
- User opens app → navigates to Home (card game)
- GameProvider mounts → useGameState initializes hand (3 cards), board (9 slots)

**State Transitions:**
| From | Trigger | To |
|------|---------|-----|
| Game idle | User drags card to empty slot | playCard → card removed from hand, new card drawn |
| Hand (3 cards) | playCard | Hand (3 cards) – one replaced |
| Drawing new card | generateCard/generateCardOrPlantCard | Either random card OR plant card (by chance) |

**Navigation Flows:**
- Entry: App → HomePage → GameBoard + CardHand
- No navigation away from game during play (single-page flow)
- User can navigate to Plants list/detail via BottomNav – game state persists (GameProvider is app-level)

**Edge Cases:**
- **Plants not yet loaded:** Replacement card = random (generateCard). No loading UI needed for card draw.
- **Supabase not configured:** getPlantsForCards returns []; always use random cards
- **All plants filtered out:** Same as empty – random only
- **User navigates away mid-play:** Game state preserved; plants cache preserved
- **Refresh mid-flow:** Full reset – new game, plants re-fetched

**Cross-Feature:**
- Plants feature: provides data (getPlantsForCards)
- Card-game feature: consumes data, owns Plant→GameCard transform
- useGlobalLimits: used by plants feature; card-game can use DEFAULT_GLOBAL_LIMITS or receive limits from provider

### 2.2 Existing Functionality

| Item | Location | Purpose |
|------|----------|---------|
| generateCard | `card-game/services/gameLogic.ts` | Creates random GameCard |
| createInitialHand | `card-game/services/gameLogic.ts` | Returns 3 random cards |
| playCard | `card-game/hooks/useGameState.ts` | Replaces played card with generateCard() |
| getPlants, getPlantById | `plants/services/plantsService.ts` | Fetch plants (need extended for card fields) |
| optToScale | `plants/components/PlantEnvPips/PlantEnvPips.tsx` | Maps opt + limits → 0–10 |
| CARD_ENV_CONFIG | `plants/constants/envConfig.ts` | Order: L, S, M, W, R, T, F (7 vars) |
| DEFAULT_GLOBAL_LIMITS | `plants/types/globalLimitsDefaults.ts` | Min/max for scaling |
| Plant, PlantEffects | `plants/types/plants.types.ts` | Types for plant data |

### 2.3 Required Information Gathering
- **External:** None – Supabase plants table schema known
- **App context:** Architecture, card game flow, plant types – all in codebase
- **Design intent:** See Decision Points below

### 2.4 Design Options

**Option A: Simplification** – Not applicable; we are adding behavior, not removing.

**Option B: Refactoring** – Extract `generateCard` usage into a single call site that can be swapped. Minimal refactor of playCard to use a "card source" abstraction.

**Option C: Minimal Addition** – Add `getPlantsForCards`, `plantToGameCard`, `generateCardOrPlantCard`; fetch plants in GameProvider; pass to useGameState; use in playCard replacement only (not initial hand). Reuse optToScale logic (inline or shared).

**Option D: New Implementation** – Same as C but also support plants in initial hand (requires async hand init or two-phase loading).

**Recommendation:** Option C – minimal addition, plants only in replacement draws. Avoids async hand initialization complexity.

### 2.5 Decision Point Matrix

**Subjective choices requiring user input:**

1. **Initial hand:** Should plants appear in the initial 3 cards, or only when drawing replacements?
   - A: Only replacements (simpler, no loading delay)
   - B: Initial hand too (requires waiting for plants before showing game)

2. **Plant chance:** What default probability (e.g. 20%) for a plant card vs random?
   - Suggest: 0.2 (20%)

3. **Configurability:** Should plant chance be configurable (e.g. constant, or future settings UI)?
   - Suggest: Constant for now (e.g. `PLANT_CARD_CHANCE = 0.2`)

---

## Phase 4–5: Implementation Complete

### Decisions Applied
- **Design:** Option C (minimal addition)
- **Initial hand:** Plants only in replacement draws
- **Plant chance:** 0.2 (20%)
- **Configurability:** Constant `PLANT_CARD_CHANCE`

### Files Modified
| File | Change |
|------|--------|
| `plants/services/plantsService.ts` | Added `getPlantsForCards()` – fetches id, type, l_opt, s_opt, m_opt, w_opt, r_opt, effects; excludes test-plant |
| `card-game/types/cardGame.types.ts` | Added `PlantForCard`, `GlobalLimitsForCard` |
| `card-game/services/gameLogic.ts` | Added `optToScale`, `deltaToEffect`, `plantToGameCard`, `generateCardOrPlantCard` |
| `card-game/context/GameProvider.tsx` | Fetches plants on mount, passes to `useGameState` |
| `card-game/hooks/useGameState.ts` | Accepts `plants`, `limits`; uses `generateCardOrPlantCard` on replacement |

### Manual Testing Steps
1. Start app, navigate to Home (card game)
2. Play several cards to the board
3. Observe ~20% of replacement cards are plant cards (id `plant-{plantId}-{n}`)
4. Plant cards show L, S, M, W, R values from database; effects match plant `effects`
5. Without Supabase: all cards remain random
