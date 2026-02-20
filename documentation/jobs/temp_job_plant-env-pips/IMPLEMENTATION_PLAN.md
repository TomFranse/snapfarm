# Plant Environment Pips (T, L, F, P, M, A)

## 1. Gather Required Information

### 1a. Feature Type
- [x] **UI Component** – New visual element (colored pips)
- [x] **Business Logic** – Map plant opt + global limits → 0–10 scale

### 1b. Required Information

**Always required:**
- [x] **Outcome:** Show 6 env params (T, L, F, P, M, A) as colored circles on a 1–10 scale at top of plant detail page
- [x] **Users:** Any user viewing plant detail
- [x] **Location:** Top of plant detail page (PlantDetailContent)

**UI Component:**
- [x] **Design:** Reuse VariablePips visual style (circles, colors, half/full fill)
- [x] **Placement:** Top of plant detail, above Basic/Environment sections
- [x] **Responsive:** Same as existing plant page (Container maxWidth="sm")
- [x] **States:** Normal (values present), empty (opt null → show empty pips)

**Business Logic:**
- [x] **Formula:** `value = (opt - global_min) / (global_max - global_min) * 10`, clamped to [0, 10]
- [x] **Example:** global T min=0, max=20, plant t_opt=10 → value=5 → half filled
- [x] **Edge cases:** opt null → 0; min=max → 5 (middle)

---

## 2. Foundation Risk

**Riskiest assumption:** The mapping formula and pip fill logic produce the expected visual (half filled when opt is midpoint).

**Validation:** VariablePips already uses `getPipFills(5)` → 2 full + 1 half + 2 empty. Formula `(10-0)/(20-0)*10 = 5`. ✓ No external API or DB; logic is deterministic and testable.

---

## 3. Foundation Validation

**Tested:** Formula and getPipFills behavior (from existing VariablePips).
- `getPipFills(5)` → [2, 2, 1, 0, 0] → 2.5 pips filled ✓
- `(opt - min) / (max - min) * 10` with opt=10, min=0, max=20 → 5 ✓

**Result:** Foundation is sound. Proceed.

---

## 4. User Stories

**US1:** As a user viewing a plant, I see T, L, F, P, M, A as 6 rows of colored circles (5 pips each) at the top so I can quickly compare plant preferences.

**US2:** As a user, each pip row shows fill proportional to where the plant’s opt value falls between global min and max (1–10 scale) so the display matches the card game style.

**Acceptance criteria:**
- 6 rows, one per variable (T, L, F, P, M, A)
- Same colors, pip size, gap, and fill rules as VariablePips
- opt null → all pips empty for that row
- global min=max → show middle (5) for that variable

---

## 5. Existing Functionality

| Item | Location | Purpose |
|------|----------|---------|
| VariablePips | `features/card-game/components/VariablePips/` | 7 vars × 5 pips, getPipFills, theme.palette.game |
| useGlobalLimits | `features/plants/hooks/useGlobalLimits.ts` | Global min/max from localStorage or defaults |
| PlantDetailContent | `features/plants/components/PlantDetailContent/` | Plant detail layout, EnvironmentSection |
| theme.palette.game | `shared/theme/defaultTheme.ts` | variableColors, pipEmpty, pipSize, pipGap |

**Reuse strategy:** Do not import from card-game (avoid cross-feature coupling). Implement plant-specific pips in plants feature using the same visual rules (theme.palette.game, getPipFills logic).

---

## 6. Implementation Phases

### Phase 1: Plant env pips component + integration
- **Risk:** 🟡 Medium (known patterns, new context)
- **Work:**
  1. Add `optToScaleValue(opt, gMin, gMax): number` util in `features/plants/utils/` (or inline in component)
  2. Create `PlantEnvPips` in `features/plants/components/PlantEnvPips/`
     - Props: `plant`, `limits` (GlobalLimits)
     - Compute 6 values from t_opt, l_opt, f_opt, p_opt, m_opt, a_opt + limits
     - Reuse getPipFills logic, theme.palette.game, same Box/circle structure as VariablePips
     - Layout: 6 rows × 5 cols (or 1 col × 6 rows with labels T, L, F, P, M, A)
  3. Add `PlantEnvPips` at top of PlantDetailContent (with useGlobalLimits)
- **Gate:** Plant detail page shows 6 pip rows; changing global limits updates fill; opt=midpoint → half filled
- **If gate fails:** Check formula, theme access, and getPipFills logic

### Phase 2: Labels and layout polish
- **Risk:** 🟢 Low
- **Work:**
  1. Add labels (T, L, F, P, M, A) next to each row
  2. Adjust layout for readability (e.g. horizontal vs vertical)
- **Gate:** Labels visible; layout matches design intent
- **If gate fails:** Adjust spacing/layout

---

## 7. Technical Notes

- **Architecture:** PlantEnvPips lives in plants feature. No import from card-game. Uses shared theme.
- **Formula:** `(opt - parseFloat(gMin)) / (parseFloat(gMax) - parseFloat(gMin)) * 10` with clamp [0,10]. If denominator 0, use 5.
- **Variable order:** T, L, F, P, M, A → variableColors[0..5]
- **Layout:** 6 rows × 5 cols (like VariablePips but 6 vars instead of 7), or 6 rows with label + 5 pips each

---

## 8. Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/features/plants/utils/optToScale.ts` (or inline) |
| Create | `src/features/plants/components/PlantEnvPips/PlantEnvPips.tsx` |
| Modify | `src/features/plants/components/PlantDetailContent/PlantDetailContent.tsx` |
