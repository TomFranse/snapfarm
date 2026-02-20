-- plant_images: many tagged images per plant (links to Supabase Storage)
CREATE TABLE IF NOT EXISTS public.plant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id TEXT NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  UNIQUE(plant_id, tag)
);

CREATE INDEX idx_plant_images_plant_id ON public.plant_images(plant_id);

-- RLS
ALTER TABLE public.plant_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plant_images" ON public.plant_images FOR SELECT USING (true);
CREATE POLICY "Authenticated manage plant_images" ON public.plant_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage RLS for plant-images bucket (bucket created via Dashboard or ensurePlantImagesBucket())
-- Public read: anyone can view plant images
CREATE POLICY "Public read plant-images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images');

-- Allow authenticated uploads (or use service role for admin uploads)
CREATE POLICY "Authenticated upload plant-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images');

-- Allow authenticated update/delete for upsert and replacement
CREATE POLICY "Authenticated update plant-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'plant-images');

CREATE POLICY "Authenticated delete plant-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'plant-images');
