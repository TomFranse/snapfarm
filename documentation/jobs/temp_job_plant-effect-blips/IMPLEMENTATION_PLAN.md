# Plant Effect Delta → Blips Normalization

## Phase 1: Pre-Development Analysis

### 1.1 Branch & Workflow
- [x] Branch: experimental

### 1.2 Rule Check
- **Backend/Secrets:** No
- **Database:** No changes
- **File placement:** Modify existing `PlantEnvPips.tsx`
- **Architecture:** plants feature, no structural changes
- **Security:** N/A (display only)

### 1.3 Risk & Impact
- **Risk:** Low – display-only change
- **Breaking:** No
- **Testability:** Manual – view plant detail, verify effect numbers match blip scale

---

## Phase 2: Requirements & Design

### 2.1 User Story
**US1:** As a user viewing a plant, I see the effect delta expressed in blip equivalents (same 0–10 scale as the pips) so it matches what I see in the game.

**Acceptance criteria:**
- Effect numbers use the same scale as the 5 pips (0–10 total)
- Formula: `delta_blips = delta / (gMax - gMin) * 10` (same normalization as `optToScale`)
- Positive/negative and color (green/red) unchanged
- When `gMax === gMin`, show 0 or omit (avoid divide-by-zero)

### 2.2 Existing Functionality
- `optToScale(opt, gMin, gMax)`: maps raw value to 0–10 using `(opt - min) / (max - min) * 10`
- Card game: variables 0–10, effects +2/-2 per pip direction
- Plant effects: raw deltas (ΔT, ΔL, etc.) in variable-native units

### 2.3 Normalization Formula
```
delta_blips = delta / (parseFloat(gMax) - parseFloat(gMin)) * 10
```
When `gMax === gMin`: use 0 (or skip display).

### 2.4 Display Format (Subjective)
**🔴 DECISION POINT:** How should we display the blip value?

| Option | Example | Pros | Cons |
|--------|---------|------|------|
| **A. 1 decimal** | -0.6, +1.2 | Precise | Can look noisy |
| **B. Integer rounded** | -1, +1 | Clean, matches game feel | Loses precision |
| **C. Half-blip precision** | -0.5, +1.0 | Balances precision/readability | Slightly more complex |

---

## Phase 3–4: Implementation Plan (Pending Approval)

### Files to Modify
- `src/features/plants/components/PlantEnvPips/PlantEnvPips.tsx`

### Changes
1. Add `deltaToBlips(delta, gMin, gMax): number` – same formula as optToScale but for delta (no offset).
2. When rendering effect: call `deltaToBlips(delta, limits[minKey], limits[maxKey])` instead of raw `delta`.
3. Format displayed value per user choice (A/B/C above).

### Complexity
- Low: one helper, one display change.

---

## Decision Points

**Q1:** Display format for blip value – **C (half-blip)** ✓

**Q2:** When `gMax === gMin` (zero range) – show 0; when normalized blips === 0, hide effect
