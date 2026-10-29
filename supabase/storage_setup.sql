-- ========================================================================
-- RESEPIFY - SUPABASE STORAGE BUCKET SETUP
-- Jalankan query ini di Supabase SQL Editor untuk mengaktifkan bucket 'recipe-images'
-- ========================================================================

-- 1. Buat bucket penyimpanan 'recipe-images' jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images',
  true,
  10485760, -- Batas maksimal 10 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Bersihkan policy lama agar tidak duplikat
DROP POLICY IF EXISTS "Public can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete recipe images" ON storage.objects;

-- 3. Policy: Hanya izinkan pengguna terautentikasi (Admin) yang bisa query / listing daftar file
-- Catatan: Pengunjung publik tetap bisa menampilkan seluruh foto di website melalui URL publik
-- karena bucket ini berstatus 'public = true'. Menghapus policy SELECT publik mencegah orang luar
-- mengintip seluruh daftar file di bucket (menghilangkan peringatan Supabase Security Advisor).
CREATE POLICY "Authenticated users can select recipe images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'recipe-images');

-- 4. Policy: Izinkan pengguna terautentikasi (Admin) mengunggah foto
CREATE POLICY "Authenticated users can upload recipe images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');

-- 5. Policy: Izinkan pengguna terautentikasi (Admin) memperbarui foto
CREATE POLICY "Authenticated users can update recipe images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe-images');

-- 6. Policy: Izinkan pengguna terautentikasi (Admin) menghapus foto
CREATE POLICY "Authenticated users can delete recipe images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recipe-images');
