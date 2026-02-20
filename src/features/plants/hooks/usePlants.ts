import { useState, useEffect, useCallback } from "react";
import { getPlants } from "../services/plantsService";
import type { PlantListItem } from "../types/plants.types";

export const usePlants = () => {
  const [plants, setPlants] = useState<PlantListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlants();
      setPlants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load plants");
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlants();
  }, [fetchPlants]);

  return { plants, loading, error, refetch: fetchPlants };
};
