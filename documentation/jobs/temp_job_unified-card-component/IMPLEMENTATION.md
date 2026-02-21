# Unified Card Component & Theme-Only Colors

## Phase 1: Pre-Development Analysis

### 1.1 Branch & Workflow Check
- [x] Branch: `experimental` ✓

### 1.2 Rule Decision Tree
- **Backend/Secrets?** NO → Skip
- **Database changes?** NO → Skip
- **File placement?** `components/common/` for reusable Card; `shared/theme/` for colors
- **Code structure?** Common component in `components/common/Card/`; theme in `shared/theme/`
- **Security?** N/A
- **Implementation details?** `code-style/RULE.md` applies

### 1.3 Risk & Impact Assessment
- **Breaking changes:** SetupCard uses common Card; GameCard, CardSlot use Paper - refactor will touch both
- **Impact:** Low–medium; SetupCard must continue to work
- **Testability:** Manual testing on experimental branch
- **High-risk?** No

---

## Phase 2: Requirements & Design

### 2.1 User Stories

**User Story 1:** As a developer, I want one common card component for all card-like UI (slots, cards, slotted cards, hand cards) so that styling and behavior are consistent and maintainable.

**Acceptance criteria:**
- Happy path: Single Card component used by GameCard, CardSlot, CardHand, SetupCard
- Error states: N/A
- Loading/empty: N/A
- Accessibility: Preserve existing keyboard/drag behavior

**User Story 2:** As a developer, I want all app colors declared only in the theme file so that design changes are centralized.

**Acceptance criteria:**
- Happy path: No hardcoded hex/rgba in components; theme is the single source
- VariablePips: Variable colors moved to theme palette
- Components: Use theme palette tokens only

### 2.1.1 User Journey & State Transition Mapping
- **Feature type:** Refactor; no user-facing navigation changes
- **States:** Same as before (hand, board, slot, drop target)
- **Edge cases:** None new

### 2.2 Existing Functionality Search

| Component | Current | Uses |
|-----------|---------|------|
| `common/Card` | MuiCard | SetupCard (content cards) |
| `GameCard` | Paper | Card content (pips, duration) |
| `CardSlot` | Paper | Empty slot or GameCard |
| `CardHand` | Box + GameCard | Renders GameCard list |
| `VariablePips` | Box | Hardcoded VARIABLE_COLORS |

**Patterns found:**
- `common/Card`: MuiCard, CardHeader/Content/Actions, hoverable, elevation
- Game components: Paper with custom styling (border, elevation, cursor, drag)

### 2.3 Required Information Gathering
- No missing external info
- No missing app context

### 2.4 Design Options (Progressive Complexity)

**Option A: Simplification**
- Extend existing common Card with `variant` prop: `default` | `slot` | `game-card`
- Default variant: unchanged (SetupCard continues to work)
- Slot variant: slot styling (drop target, empty)
- Game-card variant: card styling (selected, draggable)
- **Pros:** Minimal new code, single component
- **Cons:** Card API becomes more complex

**Option B: Refactoring**
- Keep common Card as-is for content cards
- Create new `CardShell` in common for game-specific card shells
- GameCard and CardSlot use CardShell
- **Pros:** Separation of concerns
- **Cons:** Two card-like components (user asked for "1 common")

**Option C: Minimal Addition**
- Add `variant` prop to common Card; support `content` | `slot` | `game-card`
- Content: current behavior (CardHeader/Content/Actions)
- Slot/game-card: render as Paper-like shell with variant-specific sx
- **Pros:** One component, backward compatible
- **Cons:** Card may need conditional children structure

**Option D: New Implementation**
- Create new unified Card from scratch
- Replace both common Card and game Paper usage
- Single component with full variant support
- **Pros:** Clean slate
- **Cons:** More work, risk of breaking SetupCard

---

## User Decision (2.4)

**Chosen approach: D** – New implementation from scratch.

**Additional requirement:** Size of cards should all be the same. Card and slot are fine to be the same size.

---

## Colors to Theme

**VariablePips** currently has:
- `VARIABLE_COLORS`: 7 hex strings → move to theme
- `rgba(255,255,255,0.15)` → use theme palette (e.g. `action.disabledBackground` or new token)

**Theme additions needed:**
- `palette.variablePips` or `palette.game.variableColors`: array of 7 colors
- Or use existing palette tokens if suitable

**Other components:** CardSlot, GameCard, ScorePopup already use theme palette strings (`primary.main`, `divider`, `text.secondary`, etc.) ✓

---

## Phase 5: Implementation (Completed)

### Files Modified
- `src/shared/theme/defaultTheme.ts` – Added palette.game.variableColors, palette.game.pipEmpty
- `src/components/common/Card/Card.tsx` – New unified Card with variants: content | slot | game-card
- `src/features/card-game/components/GameCard/GameCard.tsx` – Uses common Card (variant="game-card")
- `src/features/card-game/components/CardSlot/CardSlot.tsx` – Uses common Card (variant="slot")
- `src/features/card-game/components/VariablePips/VariablePips.tsx` – Uses theme.palette.game colors

### Unified Dimensions
- CARD_DIMENSIONS: minWidth 110, minHeight 120 (card and slot same size)

### SetupCard
- Unchanged; uses Card with default variant="content"
