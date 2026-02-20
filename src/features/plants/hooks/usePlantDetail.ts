import { useState, useEffect, useCallback } from "react";
import { getPlantById } from "../services/plantsService";
import type { Plant } from "../types/plants.types";

export const usePlantDetail = (id: string | undefined) => {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlant = useCallback(async () => {
    if (!id) {
      setPlant(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getPlantById(id);
      setPlant(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load plant");
      setPlant(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchPlant();
  }, [fetchPlant]);

  return { plant, loading, error, refetch: fetchPlant };
};
