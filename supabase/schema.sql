-- ============================================================
-- ucbenik.net — full database schema
-- Run this in Supabase SQL Editor to set up from scratch.
-- If your database already exists, run migration.sql instead.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. LISTINGS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS listings (
  id             uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at     timestamptz   DEFAULT now() NOT NULL,
  user_id        uuid          REFERENCES auth.users(id) ON DELETE SET NULL,
  title          text          NOT NULL,
  author         text,
  school_name    text,
  school_city    text,
  subject        text,
  grade_year     int           CHECK (grade_year BETWEEN 1 AND 4),
  condition      text          CHECK (condition IN ('odlično', 'dobro', 'sprejemljivo')) NOT NULL,
  price          numeric(8,2)  NOT NULL CHECK (price >= 0),
  description    text,
  photos         text[]        DEFAULT '{}' NOT NULL,
  seller_name    text          NOT NULL,
  seller_contact text          NOT NULL,
  seller_city    text,
  is_active      boolean       DEFAULT true NOT NULL
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can browse active listings (no login needed)
CREATE POLICY "Public read active listings"
  ON listings FOR SELECT
  USING (is_active = true);

-- Owners can also see their own inactive listings (e.g. after deactivating)
CREATE POLICY "Owner read own listings"
  ON listings FOR SELECT
  USING (user_id = auth.uid());

-- Only logged-in users can post, and user_id must match their account
CREATE POLICY "Authenticated insert own listings"
  ON listings FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Only the owner can update their listing
CREATE POLICY "Owner update own listings"
  ON listings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Only the owner can delete their listing
CREATE POLICY "Owner delete own listings"
  ON listings FOR DELETE
  USING (user_id = auth.uid());


-- ────────────────────────────────────────────────────────────
-- 2. SAVED LISTINGS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_listings (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now() NOT NULL,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id  uuid        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  UNIQUE (user_id, listing_id)
);

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved listings
CREATE POLICY "Owner read own saved listings"
  ON saved_listings FOR SELECT
  USING (user_id = auth.uid());

-- Users can only save listings as themselves
CREATE POLICY "Owner insert own saved listings"
  ON saved_listings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can only unsave their own listings
CREATE POLICY "Owner delete own saved listings"
  ON saved_listings FOR DELETE
  USING (user_id = auth.uid());


-- ────────────────────────────────────────────────────────────
-- 3. STORAGE
-- ────────────────────────────────────────────────────────────

-- Create a public bucket called "photos" in the Supabase dashboard:
--   Storage → New bucket → Name: photos → Public: ON
--
-- Then in Storage → photos → Policies, add:
--
--   INSERT policy (authenticated users only):
--     (bucket_id = 'photos' AND auth.uid() IS NOT NULL)
--
--   DELETE policy (owner only — optional):
--     (bucket_id = 'photos' AND auth.uid() IS NOT NULL)
