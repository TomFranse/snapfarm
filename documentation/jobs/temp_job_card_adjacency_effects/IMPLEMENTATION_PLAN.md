# Card Adjacency Effect Indicators

## 1. Gather Required Information

### 1a. Feature Type
- [x] **UI Component** – New visual element (effect indicators: up/down/neutral per variable)
- [x] **Business Logic** – Apply +2/-2 to adjacent slot variables on card placement

### 1b. Required Information

**Always required:**
- [x] **Outcome:** Cards show 7 effect indicators (one per variable) to the right of the pip grid. On placement, adjacent slots' variables are modified: up = +2, down = -2, neutral = no change. Values clamped 0–10.
- [x] **Users:** User playing the card game
- [x] **Location:** GameCard component (VariablePips), gameLogic service, useGameState hook

**UI Component:**
- [x] **Design:** Column of 7 symbols (▲ up, ▼ down, ■ square) aligned with each pip row, to the right of the pip grid. Up = green-ish, down = red-ish, neutral = muted/gray.
- [x] **Placement:** Right side of card, next to VariablePips grid
- [x] **Responsive:** Cards fixed 120×168px; no special responsive needs
- [x] **States:** Static indicators; no interactive states

**Business Logic:**
- [x] **Input → Output:** Board + placedSlotIndex + effects → new board with adjacent slot variables modified
- [x] **Example:** Slot 4, effect "up" on var 0 → slots 1,3,5,7 get +2 to var 0 (clamped to 10)
- [x] **Edge cases:** Clamp 0–10; no retroactive rescoring; effects apply to all adjacent (empty and occupied)

---

## 2. Foundation Risk

**Riskiest assumption:** The `applyAdjacentEffects` logic correctly modifies slot variables for all adjacent slots (empty and occupied), with proper clamping, and integrates correctly with the existing placement flow (including `resetAdjacentEmptySlots`).

**Validation:** Pure internal logic; no external API or DB. Deterministic and testable via unit test. Adjacency map already exists and is proven.

---

## 3. Foundation Validation

**Tested:** Adjacency map and slot structure.
- `getAdjacentSlotIndices(4)` → [1, 3, 5, 7] ✓
- Slot structure: `{ id, variables: { values: [7 numbers] }, card }` ✓
- Variable values 0–10, clamp behavior is trivial ✓

**Result:** Foundation is sound. Proceed. Gate: Phase 1 will include a unit test for `applyAdjacentEffects` with known inputs/outputs.

---

## 4. User Stories

**US1:** As a user viewing a card in hand or on the board, I see 7 effect indicators (up/down/neutral) to the right of the pip grid, one per variable row, so I know how placing the card will affect adjacent slots.

**US2:** As a user placing a card, adjacent slots' variables are modified according to the card's effect indicators (+2 for up, -2 for down, clamped 0–10) so the board state reflects the card's impact.

**US3:** As a user, I see the slot pips update visually when an adjacent card's effects are applied, so I can observe the change.

**Acceptance criteria:**
- 7 indicators in a column, aligned with pip rows
- Up = ▲ (green-ish), down = ▼ (red-ish), neutral = ■ (gray)
- Effects apply one-time on placement to all adjacent slots
- Values clamped 0–10
- No retroactive rescoring of already-occupied slots
- Slot pips visually update with new values

---

## 5. Existing Functionality

| Item | Location | Purpose |
|------|----------|---------|
| GameCard | `features/card-game/components/GameCard/` | Card with pips, duration badge |
| VariablePips | `features/card-game/components/VariablePips/` | 7×5 pip grid, theme.palette.game |
| gameLogic | `features/card-game/services/gameLogic.ts` | generateCard, getAdjacentSlotIndices, resetAdjacentEmptySlots |
| useGameState | `features/card-game/hooks/useGameState.ts` | playCard, board/hand state |
| cardGame.types | `features/card-game/types/cardGame.types.ts` | GameCard, Slot, CardVariables |

**Reuse strategy:** Extend GameCard and VariablePips; add applyAdjacentEffects to gameLogic; wire into useGameState playCard flow.

---

## 6. Implementation Phases

### Phase 1: Types, logic, and unit test
- **Risk:** 🟡 Medium (new logic, integrates with existing flow)
- **Work:**
  1. Add `EffectDirection` type and `effects` tuple to `GameCard` in cardGame.types.ts
  2. Add `generateEffects()` and `applyAdjacentEffects()` to gameLogic.ts; update `generateCard()`
  3. Add unit test for `applyAdjacentEffects`: known board, known effects, assert adjacent slot variables change correctly and clamp
- **Gate:** Unit test passes; `applyAdjacentEffects` produces expected output for (board, slotIndex, effects)
- **If gate fails:** Debug clamp/adjacency logic

### Phase 2: Integration and placement flow
- **Risk:** 🟡 Medium (state update order)
- **Work:**
  1. Import `applyAdjacentEffects` in useGameState
  2. In playCard setBoard: Place card → apply effects → reset adjacent empty slots → decrement durations
  3. Ensure existing cards in hand get `effects` (generateCard already returns it after Phase 1)
- **Gate:** Place card; adjacent slots (empty and occupied) show updated pips; no console errors
- **If gate fails:** Check order of operations; ensure board state is immutable

### Phase 3: UI indicators
- **Risk:** 🟢 Low (known patterns)
- **Work:**
  1. Add optional `effects` prop to VariablePips; render indicator column when present
  2. Use ▲ (U+25B2), ▼ (U+25BC), ■ (U+25A0); colors from theme or inline
  3. Pass `card.effects` from GameCard to VariablePips
- **Gate:** Cards in hand and on board show 7 indicators to the right of pips; symbols and colors correct
- **If gate fails:** Check flex layout, pipSize alignment

---

## 7. Technical Notes

- **Order of operations:** Place card → apply effects → reset adjacent empty slots → duration decrement. Effects on empty adjacent slots are overwritten by reset (by design; those slots get new random values). Effects on occupied adjacent slots persist.
- **Effect magnitude:** +2 / -2 per variable (maps to "one circle" on a 5-pip scale, or "2 points" on 0–10 scale).
- **Database:** Not linked yet; effects and variable values will be linked to DB later.

---

## 8. Files to Create/Modify

| Action | Path |
|--------|------|
| Modify | `src/features/card-game/types/cardGame.types.ts` |
| Modify | `src/features/card-game/services/gameLogic.ts` |
| Create | `src/features/card-game/services/gameLogic.test.ts` (or add to existing if present) |
| Modify | `src/features/card-game/hooks/useGameState.ts` |
| Modify | `src/features/card-game/components/VariablePips/VariablePips.tsx` |
| Modify | `src/features/card-game/components/GameCard/GameCard.tsx` |

---

## 9. Technical Checklist (Pre-Implementation)

- [x] **validate:structure:** Passed
- [x] **arch:check:** Passed (pre-existing warnings in setup feature; card-game changes stay within feature)
- [x] **Layer boundaries:** All changes within card-game feature; no new cross-feature imports
- [x] **Complexity:** Additions are localized; no new circular dependencies expected
