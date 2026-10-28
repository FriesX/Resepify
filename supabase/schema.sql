-- ========================================================================
-- RESEPIFY - SUPABASE POSTGRESQL PRODUCTION SCHEMA & ROW LEVEL SECURITY
-- PRD Section 8, 9, 10, 11 (OWASP Top 10:2025 Compliant)
-- ========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('guest', 'viewer', 'contributor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recipe_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recipe_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meal_type AS ENUM ('sarapan', 'makan_siang', 'makan_malam', 'camilan', 'minuman', 'pencuci_mulut');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
-- Storing application profiles tied to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'viewer',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. RECIPES TABLE
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL CHECK (char_length(title) >= 5),
    slug VARCHAR(150) NOT NULL UNIQUE,
    summary VARCHAR(300) NOT NULL,
    description TEXT,
    cover_image_url TEXT NOT NULL,
    cuisine VARCHAR(50) NOT NULL DEFAULT 'Indonesia',
    meal_type meal_type NOT NULL DEFAULT 'makan_siang',
    prep_time_minutes INTEGER NOT NULL DEFAULT 15 CHECK (prep_time_minutes >= 0),
    cook_time_minutes INTEGER NOT NULL DEFAULT 30 CHECK (cook_time_minutes >= 0),
    servings INTEGER NOT NULL DEFAULT 4 CHECK (servings > 0),
    difficulty recipe_difficulty NOT NULL DEFAULT 'medium',
    status recipe_status NOT NULL DEFAULT 'draft',
    tips TEXT,
    source_attribution TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    published_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- 6. RECIPE INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 1,
    name VARCHAR(150) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    note VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. RECIPE STEPS TABLE (Supports step images and short videos)
CREATE TABLE IF NOT EXISTS public.recipe_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 1,
    instruction TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. RECIPE CATEGORIES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.recipe_categories (
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- 9. AUDIT EVENTS TABLE (No sensitive tokens/passwords stored)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.profiles(id),
    actor_name TEXT NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    entity_title TEXT,
    metadata_minimal JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING (PRD Section 7)
CREATE INDEX IF NOT EXISTS idx_recipes_status ON public.recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON public.recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON public.recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON public.recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON public.recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON public.recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON public.recipe_ingredients(recipe_id, position);
CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON public.recipe_steps(recipe_id, position);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admin can update profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Public authenticated users can read active categories"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin has full access to categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- RECIPES POLICIES (Strict Guest Gate & Viewer Published Only)
CREATE POLICY "Authenticated viewers can ONLY read published recipes"
    ON public.recipes FOR SELECT
    USING (
        (auth.role() = 'authenticated' AND status = 'published')
        OR public.is_admin()
    );

CREATE POLICY "Admin has full write access to recipes"
    ON public.recipes FOR ALL
    USING (public.is_admin());

-- INGREDIENTS & STEPS POLICIES
CREATE POLICY "Viewers can read ingredients of published recipes"
    ON public.recipe_ingredients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE id = recipe_ingredients.recipe_id
              AND (status = 'published' AND auth.role() = 'authenticated' OR public.is_admin())
        )
    );

CREATE POLICY "Admin has full access to ingredients"
    ON public.recipe_ingredients FOR ALL
    USING (public.is_admin());

CREATE POLICY "Viewers can read steps of published recipes"
    ON public.recipe_steps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE id = recipe_steps.recipe_id
              AND (status = 'published' AND auth.role() = 'authenticated' OR public.is_admin())
        )
    );

CREATE POLICY "Admin has full access to steps"
    ON public.recipe_steps FOR ALL
    USING (public.is_admin());

-- AUDIT LOGS POLICIES
CREATE POLICY "Admin can read and insert audit events"
    ON public.audit_events FOR ALL
    USING (public.is_admin());
