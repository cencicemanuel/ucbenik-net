-- ============================================================
-- ucbenik.net — migration script
-- Run this if your database already exists (schema.sql was
-- already applied before). Safe to run multiple times.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. Add user_id to listings (if missing)
-- ────────────────────────────────────────────────────────────

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;


-- ────────────────────────────────────────────────────────────
-- 2. Create saved_listings table (if missing)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_listings (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now() NOT NULL,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id  uuid        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  UNIQUE (user_id, listing_id)
);

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- 3. Replace the insecure INSERT policy on listings
-- ────────────────────────────────────────────────────────────

-- Remove the old "allow everyone" policy
DROP POLICY IF EXISTS "Public insert listings" ON listings;

-- Only logged-in users can post, and user_id must match
CREATE POLICY IF NOT EXISTS "Authenticated insert own listings"
  ON listings FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );


-- ────────────────────────────────────────────────────────────
-- 4. Add owner-only UPDATE and DELETE on listings
-- ────────────────────────────────────────────────────────────

CREATE POLICY IF NOT EXISTS "Owner read own listings"
  ON listings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Owner update own listings"
  ON listings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Owner delete own listings"
  ON listings FOR DELETE
  USING (user_id = auth.uid());


-- ────────────────────────────────────────────────────────────
-- 5. Policies for saved_listings
-- ────────────────────────────────────────────────────────────

CREATE POLICY IF NOT EXISTS "Owner read own saved listings"
  ON saved_listings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Owner insert own saved listings"
  ON saved_listings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Owner delete own saved listings"
  ON saved_listings FOR DELETE
  USING (user_id = auth.uid());
