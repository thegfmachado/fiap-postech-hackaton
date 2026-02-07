-- =========================================================
-- REQUIRED EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- USER PROFILES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Pomodoro settings
  pomodoro_duration_minutes INTEGER NOT NULL DEFAULT 25,
  short_break_minutes INTEGER NOT NULL DEFAULT 5,
  long_break_minutes INTEGER NOT NULL DEFAULT 15,
  long_break_after_pomodoros INTEGER NOT NULL DEFAULT 4,

  -- UI / Accessibility
  view_mode TEXT
    CHECK (view_mode IN ('summary', 'detailed'))
    DEFAULT 'summary',

  contrast_intensity TEXT
    CHECK (contrast_intensity IN ('low', 'high'))
    DEFAULT 'low',

  spacing TEXT
    CHECK (spacing IN ('small', 'medium', 'large'))
    DEFAULT 'medium',

  font_size TEXT
    CHECK (font_size IN ('small', 'medium', 'large'))
    DEFAULT 'medium',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- INDEXES - PROFILES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_name
  ON profiles(name);

CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON profiles(email);

-- =========================================================
-- TASKS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT NULL,

  status TEXT NOT NULL
    CHECK (status IN ('to_do', 'in_progress', 'done'))
    DEFAULT 'to_do',

  pomodoro_count INTEGER NOT NULL DEFAULT 1,

  due_date TIMESTAMP WITH TIME ZONE NULL,

  checklist JSONB NOT NULL DEFAULT '[]',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- INDEXES - TASKS
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id
  ON tasks(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date
  ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_tasks_created_at
  ON tasks(created_at DESC);

-- =========================================================
-- GENERIC FUNCTION FOR updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- =========================================================
-- updated_at TRIGGERS
-- =========================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- POLICIES - PROFILES
-- =========================================================
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- =========================================================
-- POLICIES - TASKS
-- =========================================================
CREATE POLICY "Users can view their own tasks"
ON tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
ON tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON tasks
FOR DELETE
USING (auth.uid() = user_id);

-- =========================================================
-- AUTO-CREATE PROFILE AFTER USER SIGNUP
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
