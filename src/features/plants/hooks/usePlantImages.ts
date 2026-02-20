import { useState, useEffect, useCallback } from "react";
import {
  getPlantImages,
  uploadPlantImage,
  deletePlantImage,
  ensurePlantImagesBucket,
} from "../services/plantImagesService";
import type { PlantImageWithUrl } from "../types/plantImages.types";

export const usePlantImages = (plantId: string | null) => {
  const [images, setImages] = useState<PlantImageWithUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!plantId) {
      setImages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getPlantImages(plantId);
      setImages(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load plant images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  const upload = useCallback(
    async (tag: string, file: File, displayOrder = 0) => {
      if (!plantId) throw new Error("Plant ID required");
      await ensurePlantImagesBucket();
      const created = await uploadPlantImage({
        plantId,
        tag,
        file,
        displayOrder,
      });
      await fetchImages();
      return created;
    },
    [plantId, fetchImages]
  );

  const remove = useCallback(
    async (tag: string) => {
      if (!plantId) throw new Error("Plant ID required");
      await deletePlantImage(plantId, tag);
      await fetchImages();
    },
    [plantId, fetchImages]
  );

  return { images, loading, error, upload, remove, refetch: fetchImages };
};
