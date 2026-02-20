# Bottom Navbar Feature - Implementation Document

## Phase 1: Pre-Development Analysis

### 1.1 Branch & Workflow Check
- [x] Branch: `experimental` ✓

### 1.2 Rule Decision Tree
- **Backend/Secrets:** No
- **Database changes:** No
- **File placement:** `file-placement/RULE.md` → `components/common/` for BottomNav
- **Code structure:** `architecture/RULE.md` → Refactor Topbar, add GameProvider in `features/card-game/context/`
- **Security:** No new auth flows

### 1.3 Risk & Impact Assessment
- **Breaking changes:** Topbar removed, layout shifts from top to bottom
- **Impact:** App.tsx, MainLayout padding (top → bottom)
- **Testability:** Safe on experimental branch
- **Risk level:** Low

---

## Phase 2: Requirements & Design

### 2.1 User Stories

**As a user**, I want:
1. Navigation at the bottom of the screen (mobile-friendly bottom nav)
2. Score visible in the navbar
3. Less clutter: no app title, no setup button, no sign-in button (hidden for now)

### 2.1.1 User Journey & State Transition Mapping

**Current flow:** User sees top bar → navigates via Setup/Profile → content below.

**New flow:** User sees bottom nav → score always visible → content above nav. No Setup or Sign-in in nav.

**State transitions:**
- Entry: Any route → Bottom nav visible with score
- Navigation: Home ↔ other routes (Setup still reachable via direct URL if needed, but not in nav)
- Score: Persists across navigation (GameProvider at app level)

**Edge cases:**
- Session expiry: No change (sign-in hidden)
- Network loss: No change
- Refresh: Game state resets (useState in provider)

### 2.2 Existing Functionality
- `Topbar.tsx` - current top bar (to be replaced)
- `ProfileMenu` - sign-in/account (to be hidden via prop)
- `GameBoard` - displays totalScore (to move to nav)
- `useGameState` - provides totalScore (to lift to GameProvider)

### 2.3 Required Information
- None missing; codebase precedent exists.

### 2.4 Design Options

**Option A: Simplification** – Remove Topbar entirely, add minimal bottom bar
- Achieve by deleting Topbar, creating minimal BottomNav with score only

**Option B: Refactoring** – Refactor Topbar into BottomNav
- Achieve by converting Topbar to bottom position, reusing structure

**Option C: Minimal Addition** – New BottomNav component, remove Topbar
- New BottomNav.tsx, delete Topbar.tsx, update App

**Option D: New Implementation** – Full redesign with GameProvider
- GameProvider for score, new BottomNav, remove Topbar

**Recommendation:** Option C/D hybrid – Create BottomNav, add GameProvider to lift score, remove Topbar. Minimal new code, follows existing patterns.

### 2.5 Subjective Choices (User Input Needed)

**Q1:** When user is NOT on the home page (e.g. Setup), should the score show 0, or should we hide the score section?
**Proposed:** Show score always (0 when no game). Game state persists in session.

**Q2:** "Hide sign in for now" – use `display: none` / conditional render so it's easy to restore, or remove the ProfileMenu from the nav entirely?
**Proposed:** Conditional render with `HIDE_SIGN_IN = true` constant – easy to flip to restore.

---

## Phase 3: Architecture & Structure Planning

### 3.1 Architecture
- **BottomNav:** `src/components/common/BottomNav.tsx` (common, reusable)
- **GameProvider:** `src/features/card-game/context/GameProvider.tsx` (feature context)
- **Layout:** App padding changes from `pt` (top) to `pb` (bottom)

### 3.2 File Structure
```
src/
├── components/common/
│   ├── BottomNav.tsx      (new)
│   └── Topbar.tsx        (delete or keep for reference - will delete)
├── features/card-game/
│   └── context/
│       └── GameProvider.tsx  (new)
├── App.tsx                (modify)
└── pages/HomePage.tsx     (modify - use GameProvider)
```

### 3.3 Integration
- App wraps content with GameProvider
- BottomNav consumes useGameState from GameProvider (or a GameContext)
- GameBoard receives totalScore from context, no longer displays it (or we keep it in GameBoard and also show in nav – user said "put the score in there" so we move it to nav and remove from GameBoard)

---

## Phase 4: Implementation Plan

### 4.1 Component Design
- **BottomNav:** MUI `BottomNavigation` or `AppBar position="fixed" bottom` with score + optional nav items
- **GameProvider:** Wraps app, provides `{ board, hand, totalScore, scorePopup, playCard }` from useGameState

### 4.2 State & Data Flow
- GameProvider at App level → useGameState
- BottomNav reads totalScore from GameContext
- HomePage reads from GameContext (same as now, but from context)

### 4.3 UI/UX
- Bottom nav: fixed at bottom, compact height
- Score: Typography or Badge in nav
- Padding: Content has `pb` for nav height instead of `pt` for top bar

### 4.4 Files to Create/Modify
| File | Action |
|------|--------|
| `src/features/card-game/context/GameProvider.tsx` | Create |
| `src/components/common/BottomNav.tsx` | Create |
| `src/App.tsx` | Modify (GameProvider, BottomNav, padding) |
| `src/pages/HomePage.tsx` | Modify (use GameContext) |
| `src/features/card-game/components/GameBoard/GameBoard.tsx` | Modify (remove score display) |
| `src/components/common/Topbar.tsx` | Delete |

---

## User Approval

**Phase 4.7:** User approved implementation. Proceeded with coding.

---

## Phase 5: Implementation (Completed)

### Files Created
- `src/features/card-game/context/GameProvider.tsx`
- `src/components/common/BottomNav.tsx`

### Files Modified
- `src/App.tsx` - GameProvider, BottomNav, padding (pb)
- `src/pages/HomePage.tsx` - useGameContext, removed totalScore from GameBoard props
- `src/features/card-game/components/GameBoard/GameBoard.tsx` - removed score display
- `src/layouts/MainLayout/MainLayout.tsx` - updated comment

### Files Deleted
- `src/components/common/Topbar.tsx`

### Validation
- `pnpm lint` - 0 errors
- `pnpm validate:structure` - passed
- `pnpm arch:check` - no new violations
