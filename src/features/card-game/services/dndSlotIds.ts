/**
 * DnD slot ID helpers - droppable id format for card slots.
 * Format: "slot-{index}" (must match CardSlot useDroppable id).
 */

const SLOT_ID_PREFIX = "slot-";

export function parseSlotIndex(overId: string | number): number | null {
  const id = String(overId);
  if (!id.startsWith(SLOT_ID_PREFIX)) return null;
  const index = parseInt(id.replace(SLOT_ID_PREFIX, ""), 10);
  return Number.isNaN(index) ? null : index;
}
