# Plant Soil (s_opt), Wind (w_opt), Pest Resistance (r_opt)

## 1. Gather Required Information

### 1a. Feature Type
- [x] **Database Change** – New columns on plants, new columns on global_limits
- [x] **UI Component** – Global settings fields, PlantEnvPips rows, EnvironmentSection rows
- [x] **Business Logic** – s_opt = average of porosity, acidity, fertility (normalized)

### 1b. Required Information

**Always required:**
- [x] **Outcome:** Add s_opt (soil, computed from P+F+A), w_opt (wind resistance), r_opt (pest resistance); add their min/max to global settings
- [x] **Users:** Any user viewing plants or editing global limits
- [x] **Location:** DB migration, plants types, GlobalSettingsSection, PlantEnvPips, PlantDetailContent EnvironmentSection

**Database Change:**
- [x] **Schema:** plants table (add s_opt, w_opt, r_opt); global_limits table (add s_min, s_max, w_min, w_max, r_min, r_max)
- [x] **s_opt formula:** Average of p_opt, f_opt, a_opt with acidity normalized to 0–100: `(p_opt + f_opt + (a_opt - 3.5) / 6 * 100) / 3`. NULL if any of p_opt, f_opt, a_opt is NULL.
- [x] **Metrics:** s_opt 0–100 (soil quality index); w_opt 0–100 (wind resistance %); r_opt 0–100 (pest resistance %)

**UI Component:**
- [x] **Design:** Same pattern as existing T, L, F, P, M, A (TextField pairs for min/max, pip rows, EnvRow)
- [x] **Placement:** GlobalSettingsSection (6 new fields), PlantEnvPips (3 new rows), EnvironmentSection (3 new EnvRows)

---

## 2. Foundation Risk

**Riskiest assumption:** PostgreSQL generated column for s_opt works with the formula and NULL handling; migration applies cleanly to existing plants table.

**Validation:** PostgreSQL 12+ supports `GENERATED ALWAYS AS (expression) STORED`. Formula is deterministic. Migration can be tested locally with `supabase db push` or `supabase migration up`.

---

## 3. Foundation Validation

**Tested:** N/A – migration and formula are standard SQL. No external API. Risk is low.

**Gate:** Phase 1 migration runs successfully; s_opt backfill/expression produces correct values for sample rows.

---

## 4. User Stories

**US1:** As a user, I see Soil (S), Wind (W), and Pest resistance (R) in global limits so I can adjust min/max for pip scaling.

**US2:** As a user viewing a plant, I see S, W, R as pip rows (and in Environment section) so I can compare plant preferences across these dimensions.

**US3:** As a user, s_opt is automatically derived from porosity, acidity, and fertility so I don’t have to maintain it manually.

**Acceptance criteria:**
- s_opt = (p_opt + f_opt + normalized_a) / 3; NULL if any input NULL
- w_opt, r_opt stored as NUMERIC; null until populated
- Global settings: S min/max, W min/max, R min/max (defaults: 0–100)
- PlantEnvPips: 3 new rows (S, W, R) with icons and colors
- EnvironmentSection: 3 new EnvRows
- Existing localStorage limits merged with defaults so new keys get values

---

## 5. Existing Functionality

| Item | Location | Purpose |
|------|----------|---------|
| plants table | `supabase/migrations/` | Wide table, opt columns |
| global_limits table | Same | t_min/t_max, l_min/l_max, etc. |
| GlobalLimits, Plant | `features/plants/types/plants.types.ts` | TypeScript interfaces |
| DEFAULT_GLOBAL_LIMITS | `features/plants/types/globalLimitsDefaults.ts` | Default min/max |
| GlobalSettingsSection | `features/plants/components/GlobalSettingsSection/` | FIELDS array, TextField grid |
| PlantEnvPips | `features/plants/components/PlantEnvPips/` | ENV_CONFIG, optToScale, getPipFills |
| PlantDetailContent | `features/plants/components/PlantDetailContent/` | EnvironmentSection, EnvRow |
| useGlobalLimits | `features/plants/hooks/useGlobalLimits.ts` | Load/save limits; must merge with defaults for new keys |

---

## 6. Implementation Phases

### Phase 1: Database migration
- **Risk:** 🟡 Medium (schema change, generated column)
- **Work:**
  1. Create migration: add to `plants`: `s_opt NUMERIC`, `w_opt NUMERIC`, `r_opt NUMERIC`; one-time UPDATE to populate s_opt from (p_opt, f_opt, a_opt)
  2. Add to `global_limits`: `s_min`, `s_max`, `w_min`, `w_max`, `r_min`, `r_max` (all NUMERIC NOT NULL with defaults 0, 100, 0, 100, 0, 100)
  3. Update existing global_limits row if needed (ALTER with DEFAULT or backfill)
- **Gate:** Migration runs; `SELECT id, s_opt, w_opt, r_opt FROM plants LIMIT 5` returns expected s_opt for rows with p_opt, f_opt, a_opt
- **If gate fails:** Adjust generated column expression; check PostgreSQL version

### Phase 2: Types and global limits
- **Risk:** 🟢 Low
- **Work:**
  1. Add `s_opt`, `w_opt`, `r_opt` to Plant interface
  2. Add `s_min`, `s_max`, `w_min`, `w_max`, `r_min`, `r_max` to GlobalLimits
  3. Add defaults to DEFAULT_GLOBAL_LIMITS: s "0"/"100", w "0"/"100", r "0"/"100"
  4. Update useGlobalLimits: merge loaded storage with DEFAULT_GLOBAL_LIMITS so new keys get defaults
- **Gate:** TypeScript compiles; global limits include S, W, R; old localStorage still works
- **If gate fails:** Fix merge logic; ensure idx/id preserved

### Phase 3: UI – GlobalSettingsSection and PlantEnvPips
- **Risk:** 🟢 Low
- **Work:**
  1. Add S min/max, W min/max, R min/max to GlobalSettingsSection FIELDS
  2. Add S, W, R to PlantEnvPips ENV_CONFIG and ENV_COLORS (icons: LandscapeIcon/Soil, AirIcon/Wind, BugReportIcon/Pest; colors: earth brown, light blue, red/orange)
  3. Add S, W, R to PlantDetailContent EnvironmentSection EnvRows
- **Gate:** Global limits accordion shows S/W/R; plant detail shows 9 pip rows and EnvRows
- **If gate fails:** Check FIELDS key types; verify limits passed to PlantEnvPips

---

## 7. Technical Notes

### s_opt formula
- P, F: 0–100
- A (pH): 3.5–9.5 → normalize: `(a_opt - 3.5) / 6 * 100`
- s_opt = (p_opt + f_opt + normalized_a) / 3; range 0–100
- NULL if any of p_opt, f_opt, a_opt is NULL

### w_opt, r_opt
- 0–100 scale (percentage / strength)
- No min/max on plants; use global limits for pip scaling

### global_limits migration
- `ALTER TABLE global_limits ADD COLUMN s_min NUMERIC NOT NULL DEFAULT 0` etc.
- May need to handle existing row: `UPDATE global_limits SET s_min=0, s_max=100, ... WHERE id='default'` if defaults don’t apply on add

### localStorage merge
- `loadFromStorage`: `return stored ? { ...DEFAULT_GLOBAL_LIMITS, ...stored } : null` so new keys get defaults when user has old saved limits

### Icons (MUI)
- Soil: `TerrainIcon` or `GrassIcon` (already used for F) – use `LandscapeIcon` or `EcoIcon` for soil
- Wind: `AirIcon` or `AcUnitIcon`
- Pest: `BugReportIcon`

---

## 8. Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `supabase/migrations/YYYYMMDDHHMMSS_add_plant_s_w_r_opts.sql` |
| Modify | `src/features/plants/types/plants.types.ts` |
| Modify | `src/features/plants/types/globalLimitsDefaults.ts` |
| Modify | `src/features/plants/hooks/useGlobalLimits.ts` |
| Modify | `src/features/plants/components/GlobalSettingsSection/GlobalSettingsSection.tsx` |
| Modify | `src/features/plants/components/PlantEnvPips/PlantEnvPips.tsx` |
| Modify | `src/features/plants/components/PlantDetailContent/PlantDetailContent.tsx` |

---

## 9. Opinionated Choices

1. **s_opt as regular column** – Initially populated from P+F+A; user can adjust manually thereafter.
2. **0–100 for w_opt, r_opt** – Matches F, P, M; common for resistance/strength metrics.
3. **Merge defaults in useGlobalLimits** – Ensures new keys (s_min, etc.) get defaults when loading old localStorage.
4. **S, W, R in PlantEnvPips** – Full parity with T, L, F, P, M, A for consistency.

**Alternatives considered:**
- Compute s_opt in app: Simpler migration but duplicates logic and can drift.
- Different scale for w/r: 1–10 or 1–5 possible but 0–100 aligns with existing vars.
