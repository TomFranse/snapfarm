-- Allow anon/public to create the plant-images bucket (for ensurePlantImagesBucket).
-- Required because createBucket() inserts into storage.buckets; RLS blocks anon by default.
-- TEMPORARY - remove before production.

CREATE POLICY "Anon create plant-images bucket"
ON storage.buckets FOR INSERT
TO anon
WITH CHECK (name = 'plant-images');

CREATE POLICY "Public create plant-images bucket"
ON storage.buckets FOR INSERT
TO public
WITH CHECK (name = 'plant-images');
