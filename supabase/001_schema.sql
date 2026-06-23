-- GymTrack Database Schema
-- Run this first in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id      TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS splits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  days_per_week INTEGER,
  is_active     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enforce one active split per user at DB level
CREATE UNIQUE INDEX IF NOT EXISTS one_active_split_per_user
  ON splits(user_id) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS split_days (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id      UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
  day_number    INTEGER NOT NULL,
  name          TEXT NOT NULL,
  is_rest_day   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  muscle_group  TEXT,
  equipment     TEXT
);

CREATE TABLE IF NOT EXISTS day_exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_day_id  UUID NOT NULL REFERENCES split_days(id) ON DELETE CASCADE,
  exercise_id   UUID NOT NULL REFERENCES exercises(id),
  order_index   INTEGER NOT NULL DEFAULT 0,
  sets          INTEGER,
  reps          TEXT,
  rpe           INTEGER,
  notes         TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  split_id      UUID REFERENCES splits(id) ON DELETE SET NULL,
  split_day_id  UUID REFERENCES split_days(id) ON DELETE SET NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  finished_at   TIMESTAMPTZ,
  duration_min  INTEGER,
  notes         TEXT,
  is_rest_day   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS logged_sets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id   UUID NOT NULL REFERENCES exercises(id),
  set_number    INTEGER NOT NULL,
  reps          INTEGER,
  weight        DECIMAL(6,2),
  unit          TEXT DEFAULT 'kg',
  rpe           INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bodyweight_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight        DECIMAL(5,2) NOT NULL,
  unit          TEXT DEFAULT 'kg',
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE splits         ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_days     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises      ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_exercises  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE logged_sets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bodyweight_log ENABLE ROW LEVEL SECURITY;

-- Service role bypass for all tables (used by webhook + server actions)
CREATE POLICY "service_role_bypass_users"       ON users          FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_splits"      ON splits         FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_split_days"  ON split_days     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_exercises"   ON exercises      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_day_ex"      ON day_exercises  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_sessions"    ON sessions       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_sets"        ON logged_sets    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass_bw"          ON bodyweight_log FOR ALL USING (auth.role() = 'service_role');
