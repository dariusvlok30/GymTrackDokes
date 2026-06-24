-- GymTrack User Profile Extension
-- Run in Supabase SQL Editor AFTER existing migrations
-- Safe to re-run: ADD COLUMN IF NOT EXISTS skips if already present

ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS height_cm DECIMAL(5,1);
ALTER TABLE users ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,1);
ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'moderate'
  CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS units TEXT NOT NULL DEFAULT 'metric'
  CHECK (units IN ('metric', 'imperial'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'dark'
  CHECK (theme IN ('dark', 'light'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarded BOOLEAN NOT NULL DEFAULT FALSE;

-- Mark existing users as already onboarded so they don't get redirected to the wizard
UPDATE users SET onboarded = TRUE WHERE onboarded = FALSE;
