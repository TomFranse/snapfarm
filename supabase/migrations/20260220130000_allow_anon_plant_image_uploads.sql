-- TEMPORARY: Allow anonymous users to upload/manage plant images.
-- App is not hosted yet. Before production, remove these policies and restrict to authenticated only.
-- See DOC_PLANT_IMAGES.md "Known vulnerability" section.

-- plant_images table: allow anon INSERT, UPDATE, DELETE
CREATE POLICY "Anon manage plant_images"
ON public.plant_images FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Storage: allow anon upload, update, delete for plant-images bucket
CREATE POLICY "Anon upload plant-images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'plant-images');

CREATE POLICY "Anon update plant-images"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'plant-images');

CREATE POLICY "Anon delete plant-images"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'plant-images');
