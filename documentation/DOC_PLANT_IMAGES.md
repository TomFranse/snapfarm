# Plant Images Feature

Tagged images for plants, stored in Supabase Storage and linked via `plant_images` table.

## Database

- **Table**: `plant_images` (plant_id, tag, storage_path, display_order)
- **Storage bucket**: `plant-images` (public read, image types, 2MB limit)

## Usage

```ts
import { usePlantImages } from "@features/plants/hooks/usePlantImages";
import { getPlantImages, uploadPlantImage } from "@features/plants/services/plantImagesService";

// In a component
const { images, loading, upload, remove } = usePlantImages("tomato");

// Upload: tomato_small, tomato_medium, tomato_large, tomato_dying
await upload("small", file);
await upload("medium", file, 1);  // displayOrder
await upload("large", file, 2);
await upload("dying", file, 3);

// Remove
await remove("small");
```

## Storage path convention

`{plant_id}/{plant_id}_{tag}.{ext}` — e.g. `tomato/tomato_small.png`

## Bucket setup

The bucket is created automatically on first upload via `ensurePlantImagesBucket()`. If you prefer to create it manually:

1. Supabase Dashboard → Storage → New bucket
2. Name: `plant-images`
3. Public: Yes
4. Allowed MIME types: image/png, image/jpeg, image/webp, image/svg+xml
5. File size limit: 2MB

## Migration

Run `supabase db push` or apply `20260220120000_create_plant_images.sql` to create the table and storage RLS policies.
