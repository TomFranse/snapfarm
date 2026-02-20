import { getSupabase, isSupabaseConfigured } from "@shared/services/supabaseService";
import type { PlantImage, PlantImageWithUrl } from "../types/plantImages.types";

const PLANT_IMAGES_BUCKET = "plant-images";

/**
 * Ensure the plant-images bucket exists. Call once at app init or before first upload.
 * Creates bucket with public read, image-only, 2MB limit. Idempotent (ignores "already exists").
 */
export const ensurePlantImagesBucket = async (): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  const { error } = await supabase.storage.createBucket(PLANT_IMAGES_BUCKET, {
    public: true,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
  });
  if (error && error.message !== "The resource already exists") {
    console.error("[plantImages] createBucket failed", {
      bucket: PLANT_IMAGES_BUCKET,
      errorMessage: error.message,
      errorName: error.name,
      errorDetails: (error as { details?: string })?.details,
    });
    throw error;
  }
};

/**
 * Build storage path for a plant image: {plant_id}/{plant_id}_{tag}.{ext}
 */
export const buildStoragePath = (plantId: string, tag: string, ext: string): string => {
  const safeExt = ext.startsWith(".") ? ext.slice(1) : ext;
  return `${plantId}/${plantId}_${tag}.${safeExt}`;
};

/**
 * Get file extension from filename or MIME type
 */
const getExtension = (file: File): string => {
  const name = file.name;
  const dot = name.lastIndexOf(".");
  if (dot >= 0) return name.slice(dot + 1).toLowerCase();
  const mime = file.type;
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "image/svg+xml") return "svg";
  return "png";
};

export interface UploadPlantImageParams {
  plantId: string;
  tag: string;
  file: File;
  displayOrder?: number;
}

/**
 * Upload a plant image and upsert the plant_images record.
 */
export const uploadPlantImage = async (params: UploadPlantImageParams): Promise<PlantImage> => {
  const { plantId, tag, file, displayOrder = 0 } = params;
  const supabase = getSupabase();
  const ext = getExtension(file);
  const storagePath = buildStoragePath(plantId, tag, ext);

  const { error: uploadError } = await supabase.storage
    .from(PLANT_IMAGES_BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("[plantImages] storage upload failed", {
      storagePath,
      plantId,
      tag,
      errorMessage: uploadError.message,
      errorName: uploadError.name,
    });
    throw uploadError;
  }

  const { data, error } = await supabase
    .from("plant_images")
    .upsert(
      {
        plant_id: plantId,
        tag,
        storage_path: storagePath,
        display_order: displayOrder,
      },
      { onConflict: "plant_id,tag" }
    )
    .select()
    .single();

  if (error) {
    console.error("[plantImages] plant_images upsert failed", {
      plantId,
      tag,
      errorMessage: error.message,
      errorCode: error.code,
    });
    throw error;
  }
  return data as PlantImage;
};

/**
 * Fetch all tagged images for a plant, with public URLs.
 */
export const getPlantImages = async (plantId: string): Promise<PlantImageWithUrl[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("plant_images")
    .select("*")
    .eq("plant_id", plantId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  if (!data?.length) return [];

  return (data as PlantImage[]).map((row) => ({
    ...row,
    public_url: supabase.storage.from(PLANT_IMAGES_BUCKET).getPublicUrl(row.storage_path).data
      .publicUrl,
  }));
};

/**
 * Get a single image by plant and tag.
 */
export const getPlantImageByTag = async (
  plantId: string,
  tag: string
): Promise<PlantImageWithUrl | null> => {
  const images = await getPlantImages(plantId);
  return images.find((i) => i.tag === tag) ?? null;
};

/**
 * Delete a plant image (storage file and DB record).
 */
export const deletePlantImage = async (plantId: string, tag: string): Promise<void> => {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("plant_images")
    .select("storage_path")
    .eq("plant_id", plantId)
    .eq("tag", tag)
    .single();

  if (data?.storage_path) {
    await supabase.storage.from(PLANT_IMAGES_BUCKET).remove([data.storage_path]);
  }
  await supabase.from("plant_images").delete().eq("plant_id", plantId).eq("tag", tag);
};
