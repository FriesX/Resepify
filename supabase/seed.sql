-- ========================================================================
-- RESEPIFY - SUPABASE INITIAL SEED DATA
-- Jalankan query ini di Supabase SQL Editor untuk menanam resep awal
-- ========================================================================

-- 1. SEED KATEGORI
INSERT INTO public.categories (name, slug, description, icon, is_active)
VALUES
  ('Makanan Utama', 'makanan-utama', 'Hidangan utama berat berprotein dan kaya rempah', 'Utensils', true),
  ('Masakan Nusantara', 'masakan-nusantara', 'Kuliner otentik warisan berbagai daerah di Indonesia', 'Flame', true),
  ('Sarapan Praktis', 'sarapan-praktis', 'Menu lezat, cepat disiapkan, dan berenergi untuk pagi hari', 'Sunrise', true),
  ('Camilan & Kudapan', 'camilan-kudapan', 'Kudapan gurih, renyah, dan manis untuk waktu santai', 'Cookie', true),
  ('Pencuci Mulut & Kue', 'pencuci-mulut', 'Hidangan penutup manis, puding lembut, dan cake modern', 'Cake', true),
  ('Minuman Segar', 'minuman-segar', 'Minuman tradisional segar, es buah, dan pelepas dahaga', 'Coffee', true),
  ('Menu Sehat & Sayur', 'menu-sehat', 'Olahan sayuran segar dan menu rendah minyak', 'Salad', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED RESEP: RENDANG MINANG
INSERT INTO public.recipes (
  title, slug, summary, description, cover_image_url, cuisine, meal_type,
  prep_time_minutes, cook_time_minutes, servings, difficulty, status, is_featured, views_count, tips, source_attribution
) VALUES (
  'Rendang Daging Sapi Minang Asli Warisan Nenek',
  'rendang-daging-sapi-minang-asli',
  'Rendang daging sapi khas Minangkabau yang dimasak perlahan hingga bumbu meresap hitam karamel dan serat daging sangat empuk.',
  'Rendang bukan sekadar masakan, melainkan filosofi kesabaran kuliner Minang. Menggunakan santan murni dari kelapa tua dan rempah aromatik segar (lengkuas, jahe, serai, daun kunyit). Dimasak dengan teknik perlahan bertahap mulai dari gulai, kalio, hingga menjadi rendang hitam pekat yang gurih meresap.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  'Indonesia',
  'makan_siang',
  30, 180, 6, 'hard', 'published', true, 1420,
  'Gunakan api lilin yang sangat kecil setelah santan mengental (tahap kalio) agar minyak keluar alami tanpa membuat dasar wajan gosong.',
  'Resep Warisan Keluarga Bukittinggi'
) ON CONFLICT (slug) DO NOTHING;

-- Relasikan Bahan Rendang
DO $$
DECLARE
  r_id UUID;
BEGIN
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'rendang-daging-sapi-minang-asli' LIMIT 1;
  IF r_id IS NOT NULL THEN
    DELETE FROM public.recipe_ingredients WHERE recipe_id = r_id;
    INSERT INTO public.recipe_ingredients (recipe_id, position, name, quantity, unit, note) VALUES
      (r_id, 1, 'Daging Gandik Sapi', '1', 'kg', 'potong searah serat 4x4 cm'),
      (r_id, 2, 'Santan Kental', '1500', 'ml', 'dari 3 butir kelapa tua perasan pertama'),
      (r_id, 3, 'Santan Encer', '500', 'ml', 'perasan kedua'),
      (r_id, 4, 'Bawang Merah', '120', 'gr', 'haluskan'),
      (r_id, 5, 'Bawang Putih', '60', 'gr', 'haluskan'),
      (r_id, 6, 'Cabai Merah Keriting', '150', 'gr', 'haluskan'),
      (r_id, 7, 'Lengkuas', '40', 'gr', 'haluskan sebagian'),
      (r_id, 8, 'Serai', '3', 'batang', 'memarkan'),
      (r_id, 9, 'Daun Kunyit', '2', 'lembar', 'simpulkan'),
      (r_id, 10, 'Asam Kandis', '2', 'buah', 'jangan dipecah');

    DELETE FROM public.recipe_steps WHERE recipe_id = r_id;
    INSERT INTO public.recipe_steps (recipe_id, position, instruction, image_url) VALUES
      (r_id, 1, 'Haluskan bumbu halus (bawang merah, bawang putih, cabai, jahe, lengkuas) hingga benar-benar halus dan berminyak.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'),
      (r_id, 2, 'Siapkan wajan besi tebal. Tuangkan santan encer dan santan kental, masukkan bumbu halus, serai, daun kunyit, dan daun jeruk.', NULL),
      (r_id, 3, 'Masak di atas api sedang sambil terus diaduk perlahan hingga mendidih dan mengeluarkan minyak kemerahan.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'),
      (r_id, 4, 'Masukkan potongan daging sapi. Aduk rata dan turunkan ke api sedang-kecil hingga kuah menyusut menjadi kalio cokelat.', NULL),
      (r_id, 5, 'Masukkan asam kandis dan garam. Kecilkan api ke setelan paling kecil hingga bumbu berubah menjadi cokelat gelap kehitaman.', NULL);
  END IF;
END $$;

-- 3. SEED RESEP: AYAM BAKAR TALIWANG
INSERT INTO public.recipes (
  title, slug, summary, description, cover_image_url, cuisine, meal_type,
  prep_time_minutes, cook_time_minutes, servings, difficulty, status, is_featured, views_count, tips, source_attribution
) VALUES (
  'Ayam Bakar Taliwang Pedas Gurih Khas Lombok',
  'ayam-bakar-taliwang-pedas-gurih',
  'Ayam kampung muda bakar dengan olesan bumbu terasi Lombok, cabai rawit pedas menyengat, dan aroma asap gurih arang.',
  'Ayam Taliwang adalah kuliner legendaris khas NTB. Dibuat dengan ayam kampung pejantan muda agar daging tetap empuk lembut dan manis alami.',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80',
  'Indonesia',
  'makan_malam',
  25, 40, 4, 'medium', 'published', true, 980,
  'Gunakan terasi bakar kualitas prima untuk aroma wangi khas yang tidak tengik.',
  'Eksplorasi Kuliner Lombok Asli'
) ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  r_id UUID;
BEGIN
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'ayam-bakar-taliwang-pedas-gurih' LIMIT 1;
  IF r_id IS NOT NULL THEN
    DELETE FROM public.recipe_ingredients WHERE recipe_id = r_id;
    INSERT INTO public.recipe_ingredients (recipe_id, position, name, quantity, unit, note) VALUES
      (r_id, 1, 'Ayam Kampung Muda', '1', 'ekor', 'belah dada bentuk bekakak'),
      (r_id, 2, 'Cabai Rawit Merah', '12', 'buah', 'sesuai selera'),
      (r_id, 3, 'Terasi Lombok Bakar', '1', 'sdm', 'bakar hingga wangi'),
      (r_id, 4, 'Kencur', '2', 'cm', 'kupas'),
      (r_id, 5, 'Santan Kental', '150', 'ml', 'untuk mematangkan bumbu');

    DELETE FROM public.recipe_steps WHERE recipe_id = r_id;
    INSERT INTO public.recipe_steps (recipe_id, position, instruction, image_url) VALUES
      (r_id, 1, 'Lumuri ayam kampung dengan perasan air jeruk limau dan garam. Diamkan selama 15 menit.', NULL),
      (r_id, 2, 'Bakar ayam di atas bara arang hingga setengah matang beraroma asap.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'),
      (r_id, 3, 'Tumis bumbu halus (cabai, bawang, kencur, terasi) dengan santan hingga menyusut dan berminyak.', NULL),
      (r_id, 4, 'Celupkan ayam bakar ke dalam bumbu, lalu bakar kembali hingga matang terkaramelisasi.', NULL);
  END IF;
END $$;

-- 4. SEED RESEP: SOTO BETAWI
INSERT INTO public.recipes (
  title, slug, summary, cover_image_url, cuisine, meal_type,
  prep_time_minutes, cook_time_minutes, servings, difficulty, status, is_featured, views_count, tips
) VALUES (
  'Soto Betawi Kuah Susu Gurih Creamy Rempah',
  'soto-betawi-kuah-susu-gurih',
  'Soto khas Jakarta dengan kuah kaldu perpaduan santan dan susu evaporasi yang gurih manis, potongan daging sapi empuk, dan emping renyah.',
  'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=1200&q=80',
  'Indonesia',
  'makan_siang',
  20, 60, 5, 'medium', 'published', false, 810,
  'Rebus daging pertama kali dan buang air rebusan pertama untuk kuah kaldu bersih bening.'
) ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  r_id UUID;
BEGIN
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'soto-betawi-kuah-susu-gurih' LIMIT 1;
  IF r_id IS NOT NULL THEN
    DELETE FROM public.recipe_ingredients WHERE recipe_id = r_id;
    INSERT INTO public.recipe_ingredients (recipe_id, position, name, quantity, unit, note) VALUES
      (r_id, 1, 'Daging Sapi Sengkel', '600', 'gr', 'potong dadu'),
      (r_id, 2, 'Susu Evaporasi', '300', 'ml', 'creamy'),
      (r_id, 3, 'Santan Sedang', '500', 'ml', 'segar');

    DELETE FROM public.recipe_steps WHERE recipe_id = r_id;
    INSERT INTO public.recipe_steps (recipe_id, position, instruction) VALUES
      (r_id, 1, 'Rebus potongan daging sengkel dengan rempah kayu manis, cengkih, dan kapulaga hingga empuk.'),
      (r_id, 2, 'Tumis bumbu halus dan masukkan ke dalam kaldu daging.'),
      (r_id, 3, 'Tuang susu evaporasi dan santan perlahan sambil diaduk rata hingga mendidih harum.');
  END IF;
END $$;
