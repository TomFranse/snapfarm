import { useEffect, useState } from "react";
import type { GameCard, Slot } from "@features/card-game/types/cardGame.types";
import { getFirstPlantImageUrl } from "@features/plants/services/plantImagesService";

function parsePlantIdFromCardId(cardId: string): string | null {
  if (!cardId.startsWith("plant-")) return null;
  const parts = cardId.split("-");
  if (parts.length < 3) return null;
  parts.shift();
  parts.pop();
  return parts.join("-");
}

/**
 * Fetches image URLs for plant cards in hand and on board. Returns a map of cardId -> imageUrl.
 */
export function usePlantCardImageMap(hand: GameCard[], board: Slot[]): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const handIds = hand.filter((c) => c.id.startsWith("plant-")).map((c) => c.id);
    const boardIds = board.filter((s) => s.card?.id.startsWith("plant-")).map((s) => s.card!.id);
    const plantCardIds = [...new Set([...handIds, ...boardIds])];
    if (plantCardIds.length === 0) {
      setMap({});
      return;
    }
    const fetchAll = async () => {
      const entries = await Promise.all(
        plantCardIds.map(async (cardId) => {
          const plantId = parsePlantIdFromCardId(cardId);
          if (!plantId) return [cardId, null] as const;
          const url = await getFirstPlantImageUrl(plantId);
          return [cardId, url] as const;
        })
      );
      setMap(Object.fromEntries(entries.filter(([, url]) => Boolean(url)) as [string, string][]));
    };
    void fetchAll();
  }, [hand, board]);

  return map;
}
