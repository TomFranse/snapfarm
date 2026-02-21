# DnD-Kit Card Placement Feature

## Phase 1: Pre-Development Analysis

### 1.1 Branch & Workflow Check
- [x] Branch verified: `experimental`

### 1.2 Rule Decision Tree
- **Backend/Secrets?** NO → Skip
- **Database changes?** NO → Skip
- **File placement?** Checked `file-placement/RULE.md`, `architecture/RULE.md`
- **Code structure?** Architecture: shared DnD infra + feature hooks
- **Security?** No new security concerns (client-side DnD)

### 1.3 Risk & Impact Assessment
- **Breaking changes:** Replaces HTML5 DnD with dnd-kit; API surface of useCardInteraction changes internally but HomePage/component props can stay compatible
- **Impact:** Card game feature only; no other features affected
- **Testability:** Experimental branch; manual testing sufficient
- **Risk level:** Low–moderate (dependency addition, refactor of working feature)

---

## Phase 2: Requirements & Design

### 2.1 User Stories

**US1:** As a player, I can drag a card from my hand to a slot so that I can place it using mouse/touch.
- Happy path: Drag card over slot → slot highlights → release → card placed
- Error: Slot occupied → no highlight, no drop
- Edge: Drop outside slots → card returns to hand

**US2:** As a player, I can click a card to select it, then click a slot to place it so that I can use keyboard/click-only input.
- Happy path: Click card → card selected → click empty slot → card placed
- Edge: Click elsewhere → selection cleared

**US3:** When dragging near a slot, that slot is highlighted to show where the card will snap when released.
- Uses dnd-kit collision detection (e.g. closestCenter) to determine "closest" slot

**US4:** When dragging away from all slots, releasing returns the card to my hand.
- No playCard call; card remains in hand

### 2.1.1 User Journey & State Transition Mapping

| State | Entry | Exit / Transition |
|-------|-------|-------------------|
| Idle | Page load, after drop/cancel | Click card → Selected; Drag card → Dragging |
| Selected | Click card | Click slot → Play; Click card again → Idle; Click elsewhere → Idle |
| Dragging | Drag start on card | Drop on slot → Play; Drop outside → Idle (return to hand) |
| Playing | playCard called | Score popup → Idle |

**Navigation flows:**
- Entry: HomePage → GameBoard + CardHand
- No route changes; all interactions stay on HomePage

**Edge cases:**
- Navigate away mid-drag: React unmount cleans up; no persistence needed
- Session expire: N/A (no auth for card game)
- Network: N/A (local state only)
- Refresh mid-flow: State resets (hand/board from useGameState)
- Click vs drag: Click = select; Drag = drag (no conflict; drag clears selection)

**Cross-feature:** None; card game is self-contained.

---

### 2.2 Existing Functionality
- `useCardInteraction`: HTML5 DnD + click-to-select; `playCard`, `dropTargetSlotIndex`, handlers
- `CardSlot`: `isDropTarget`, `onDragOver`, `onDrop`, `onClick`
- `CardHand`: `selectedCardId`, `onCardSelect`, `onDragStart`, `onDragEnd`
- `GameCard`: `draggable`, `onDragStart`, `onDragEnd`, `onClick`
- `Card` (common): `isDropTarget` styling for slots

### 2.3 Required Information
- dnd-kit packages: `@dnd-kit/core`, `@dnd-kit/utilities` (for CSS transform)
- Collision: `closestCenter` for slot highlighting
- Architecture: `shared/context/DndContext.tsx` + `shared/hooks/useDnd.ts` (per architecture rule) OR feature-scoped DndContext

---

### Decision: User Journey (2.1.1)
**Q:** Are there any user states, transitions, or edge cases missing?
**A:** No. User confirmed journey is complete.

---

## Design Options (2.4)

**Option A: Simplification**
- Remove/simplify existing code. Not applicable: we must add dnd-kit and replace HTML5 DnD.

**Option B: Refactoring**
- Refactor `useCardInteraction` to use dnd-kit internally.
- Replace HTML5 events with dnd-kit `DndContext` callbacks.
- Keep same component props (dropTargetSlotIndex, handlers) so GameBoard/CardHand/CardSlot stay mostly unchanged.
- Add `DndContext` + `DragOverlay` at HomePage level.

**Option C: Minimal Addition**
- Add shared `CardGameDndProvider` wrapping HomePage content.
- New `useCardGameDnd` hook that wraps dnd-kit and exposes same interface as `useCardInteraction`.
- Components receive same props; internal implementation switches to dnd-kit.
- Reuse `isDropTarget` on CardSlot; derive from dnd-kit `over` state.

**Option D: New Implementation**
- Full dnd-kit setup: `DndContext`, `useDraggable`, `useDroppable`, `DragOverlay`.
- New `CardGameDndProvider` in feature or shared.
- Rewrite `useCardInteraction` to be dnd-kit-driven.
- Same external API for pages/components.

**Recommendation:** Option C or D. B/C/D are similar; C emphasizes minimal new code, D emphasizes clean dnd-kit integration. Architecture suggests shared DnD infra, so we could add `shared/context/CardGameDndContext.tsx` (or keep it feature-scoped in `card-game`). The card game is the only DnD consumer, so feature-scoped is simpler.

### Decision: Design Approach
**Q:** Which approach?
**A:** D – Full dnd-kit setup, rewrite interaction logic, same external API.

---

### Decision: Subjective Choices (2.5)

**Q1 – DnD infrastructure location**
**A:** (a) Shared – `shared/context/DndContext.tsx` + `shared/hooks/useDnd.ts`

**Q2 – "Close to slot" definition**
**A:** (a) closestCenter – highlights slot whose center is closest to drag center

---

## Phase 3: Architecture & Structure Planning

### 3.1 Architecture
- **Feature vs shared:** DnD infra in `shared/` (context + hooks); domain logic in `features/card-game/hooks/useCardInteraction.ts`
- **Layers:** DndContext (shared/context) → useDnd (shared/hooks) → useCardInteraction (feature hook) → components
- **Import direction:** Pages → components → hooks; hooks → services/utils/types

### 3.2 File Placement (validated)
- `shared/context/DndContext.tsx` – DndContext provider with closestCenter, sensors
- `shared/hooks/useDnd.ts` – Optional shared hook if needed; or keep logic in feature
- `src/features/card-game/hooks/useCardInteraction.ts` – Refactor to use dnd-kit
- Modify: `CardHand`, `GameCard`, `CardSlot`, `GameBoard`, `HomePage`

### 3.3 Dependencies
- Add: `@dnd-kit/core`, `@dnd-kit/utilities`

### 3.4 Complexity
- useCardInteraction: refactor, similar cyclomatic; collision/over logic is straightforward
- New DndContext: thin wrapper; within thresholds

---

## Phase 4: Implementation Plan

### 4.1 Component/API Design
- **DndContext:** Wraps game area; `onDragStart`, `onDragOver`, `onDragEnd`; `collisionDetection={closestCenter}`
- **Draggable cards:** `useDraggable` in GameCard (or wrapper); id = card.id
- **Droppable slots:** `useDroppable` in CardSlot; id = `slot-${slotIndex}`; only when empty
- **DragOverlay:** Renders dragged card; stays mounted; conditionally render child when activeId
- **Click-to-place:** Unchanged; selectedCardId + onSlotClick

### 4.2 State & Data Flow
- `activeId` (dragging): from DndContext onDragStart/onDragEnd
- `over` (closest droppable): from DndContext; map to `dropTargetSlotIndex` for CardSlot
- On drop: if `over` is slot → playCard(cardId, slotIndex); else no-op (card stays in hand)

### 4.3 File Changes
| File | Action |
|------|--------|
| `package.json` | Add @dnd-kit/core, @dnd-kit/utilities |
| `shared/context/DndContext.tsx` | Create – DndContext + sensors + closestCenter |
| `shared/hooks/useDnd.ts` | Create – optional; or inline in DndContext |
| `features/card-game/hooks/useCardInteraction.ts` | Refactor – use DndContext, remove HTML5 handlers |
| `features/card-game/components/GameCard/GameCard.tsx` | Add useDraggable wrapper or draggable wrapper component |
| `features/card-game/components/CardSlot/CardSlot.tsx` | Add useDroppable; receive isDropTarget from over |
| `features/card-game/components/CardHand/CardHand.tsx` | Use draggable cards; pass dnd-kit props |
| `pages/HomePage.tsx` | Wrap in DndContext; add DragOverlay |

### 4.4 Manual Testing Steps
1. Drag card over empty slot → slot highlights
2. Release over slot → card placed
3. Drag card away from slots, release → card returns to hand
4. Click card, click slot → card placed (unchanged)
5. Drag over occupied slot → no highlight, drop outside returns to hand

---

## 🔴 DECISION POINT (Phase 4.7)

**Implementation plan summary:**
- User stories: US1–US4 (drag, click-to-place, slot highlight, return to hand)
- Design: Option D (full dnd-kit)
- DnD infra: Shared (DndContext + useDnd)
- Collision: closestCenter
- Files: Create shared/context/DndContext.tsx, shared/hooks/useDnd.ts; refactor useCardInteraction, GameCard, CardSlot, CardHand; wrap HomePage

### Decision: Implementation Plan Approved
**Q:** Does this implementation plan look correct? Should I proceed with implementation?
**A:** User approved. Proceeded with implementation.

---

## Phase 5: Implementation (Complete)

### Files Created
- `shared/context/DndContext.tsx` - AppDndContext with sensors, closestCenter
- `shared/hooks/useDnd.ts` - Re-export useDndContext
- `features/card-game/context/CardGameDndProvider.tsx` - DndContext + DragOverlay, onDragEnd
- `features/card-game/services/dndSlotIds.ts` - getSlotDroppableId, parseSlotIndex

### Files Modified
- `features/card-game/hooks/useCardInteraction.ts` - Uses useDndContext for dropTargetSlotIndex
- `features/card-game/components/GameCard/GameCard.tsx` - useDraggable, CSS transform
- `features/card-game/components/CardSlot/CardSlot.tsx` - useDroppable, removed HTML5 handlers
- `features/card-game/components/CardHand/CardHand.tsx` - Removed drag props
- `features/card-game/components/GameBoard/GameBoard.tsx` - Removed drag props
- `pages/HomePage.tsx` - CardGameDndProvider wrapper, HomePageContent
- `package.json` - Added @dnd-kit/core, @dnd-kit/utilities
