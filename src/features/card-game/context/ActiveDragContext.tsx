/**
 * ActiveDragContext - Exposes the currently dragged card ID from dnd-kit.
 *
 * Used to compute focusedCardId (selected or dragged) for placement debug overlay.
 */

import { createContext, useContext, type ReactNode } from "react";

export interface ActiveDragContextValue {
  activeId: string | null;
}

const ActiveDragContext = createContext<ActiveDragContextValue | null>(null);

export function ActiveDragProvider({
  activeId,
  children,
}: {
  activeId: string | null;
  children: ReactNode;
}) {
  return <ActiveDragContext.Provider value={{ activeId }}>{children}</ActiveDragContext.Provider>;
}

export function useActiveDragContext(): ActiveDragContextValue {
  const ctx = useContext(ActiveDragContext);
  if (!ctx) throw new Error("useActiveDragContext must be used within ActiveDragProvider");
  return ctx;
}
