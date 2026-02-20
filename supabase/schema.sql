-- ============================================================
-- PORTIFY — Supabase Database Schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  headline    TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  location    TEXT,
  website     TEXT,
  github      TEXT,
  linkedin    TEXT,
  twitter     TEXT,
  instagram   TEXT,
  youtube     TEXT,
  dribbble    TEXT,
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Skills ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  category    TEXT DEFAULT 'Other',
  level       INTEGER DEFAULT 3 CHECK (level BETWEEN 1 AND 5),
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  tech_stack  TEXT[] DEFAULT '{}',
  github_url  TEXT,
  live_url    TEXT,
  image_url   TEXT,
  featured    BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Experiences ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  description TEXT,
  start_date  DATE,
  end_date    DATE,
  is_current  BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Education ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree      TEXT,
  field       TEXT,
  start_year  INTEGER,
  end_year    INTEGER,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      LOWER(REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', '_'))
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education   ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are viewable if public or own" ON profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- SKILLS
CREATE POLICY "Skills viewable if profile is public or own" ON skills
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE is_public = true)
    OR profile_id = auth.uid()
  );

CREATE POLICY "Users can manage own skills" ON skills
  FOR ALL USING (profile_id = auth.uid());

-- PROJECTS
CREATE POLICY "Projects viewable if profile is public or own" ON projects
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE is_public = true)
    OR profile_id = auth.uid()
  );

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (profile_id = auth.uid());

-- EXPERIENCES
CREATE POLICY "Experiences viewable if profile is public or own" ON experiences
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE is_public = true)
    OR profile_id = auth.uid()
  );

CREATE POLICY "Users can manage own experiences" ON experiences
  FOR ALL USING (profile_id = auth.uid());

-- EDUCATION
CREATE POLICY "Education viewable if profile is public or own" ON education
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE is_public = true)
    OR profile_id = auth.uid()
  );

CREATE POLICY "Users can manage own education" ON education
  FOR ALL USING (profile_id = auth.uid());

-- ── Storage bucket for avatars ────────────────────────────────
-- Run this separately in Supabase Storage or SQL Editor:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portify',
  'portify',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public portify assets are accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'portify');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portify'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portify'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portify'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
