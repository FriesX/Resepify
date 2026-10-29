-- ========================================================================
-- RESEPIFY - SUPABASE OTORISASI ROLE ADMIN OTOMATIS (GOOGLE OAUTH & EMAIL)
-- ========================================================================
-- Script ini mengatur agar email owner 'edgarchuang343@gmail.com' otomatis
-- mendapatkan role 'admin', sedangkan pengguna lain otomatis menjadi 'viewer'.

-- 1. Buat atau perbarui Trigger Function pada database Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role public.user_role := 'viewer';
  user_full_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Cek apakah email yang login adalah Email Admin Utama
  IF LOWER(NEW.email) = 'edgarchuang343@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'viewer';
  END IF;

  -- Ekstrak nama dan avatar dari Google OAuth metadata jika tersedia
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'Pengguna'
  );

  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=' || NEW.email
  );

  -- Simpan / Update profil pengguna di tabel public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    role,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_avatar,
    assigned_role,
    'active',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    role = CASE 
      WHEN LOWER(EXCLUDED.email) = 'edgarchuang343@gmail.com' THEN 'admin'::public.user_role
      ELSE public.profiles.role 
    END,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Pasang Trigger pada tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Update profil yang sudah ada (jika sebelumnya sudah pernah register)
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'edgarchuang343@gmail.com';

-- Pastikan user lain tetap viewer jika bukan edgarchuang343@gmail.com
UPDATE public.profiles
SET role = 'viewer'
WHERE LOWER(email) != 'edgarchuang343@gmail.com' AND role = 'admin';

-- 4. Verifikasi hasil
SELECT id, email, display_name, role, status FROM public.profiles WHERE LOWER(email) = 'edgarchuang343@gmail.com';
