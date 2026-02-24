/**
 * AppDndContext - Shared DndContext with default sensors and collision detection.
 *
 * Uses pointerWithin so the highlighted slot matches cursor/finger position.
 * Falls back to rectIntersection for Keyboard sensor (pointerWithin is pointer-only).
 * Pass onDragStart, onDragEnd for domain-specific handling.
 */

import type { ReactNode } from "react";
import {
  DndContext as DndKitContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

export interface AppDndContextProps {
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

export function AppDndContext({ children, onDragStart, onDragEnd }: AppDndContextProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 2 },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndKitContext>
  );
}
