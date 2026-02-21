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

The bucket is created automatically on first upload via `ensurePlantImagesBucket()`. This requires an RLS policy on `storage.buckets` allowing anon/public to INSERT the plant-images bucket (see migrations).

If you prefer to create it manually:

1. Supabase Dashboard → Storage → New bucket
2. Name: `plant-images`
3. Public: Yes
4. Allowed MIME types: image/png, image/jpeg, image/webp, image/svg+xml
5. File size limit: 2MB

## Migration

Run `supabase db push` or apply `20260220120000_create_plant_images.sql` to create the table and storage RLS policies.

---

## Known vulnerability (temporary)

**Unauthenticated uploads allowed.** The app is not hosted yet. RLS policies currently allow anonymous (`anon`) users to upload, update, and delete plant images. This is intentional for local development.

**Before hosting:** Remove or restrict the anon policies so only `authenticated` users can manage plant images. Migration `20260220130000_allow_anon_plant_image_uploads.sql` adds the anon policies; create a new migration to drop them before production deployment.
