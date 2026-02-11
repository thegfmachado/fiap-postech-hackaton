
-- MindEase Database Setup
-- This file contains the initial database schema and seed data

-- =========================================================
-- REQUIRED EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- PROFILES TABLE (equivalente ao users do types)
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  email TEXT NOT NULL,
  name TEXT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- INDEXES - PROFILES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON profiles(email);

CREATE INDEX IF NOT EXISTS idx_profiles_name
  ON profiles(name);

-- =========================================================
-- TASKS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,

  title TEXT NOT NULL,
  description TEXT NULL,

  status TEXT NOT NULL,
  priority TEXT NOT NULL,

  due_date TIMESTAMP WITH TIME ZONE NULL,

  estimated_pomodoros INTEGER NOT NULL,
  completed_pomodoros INTEGER NOT NULL DEFAULT 0,

  checklist JSONB NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- INDEXES - TASKS
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_tasks_priority
  ON tasks(priority);

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
$$ LANGUAGE plpgsql;

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
-- (não há user_id no types, então sem vínculo ao usuário)
-- =========================================================
CREATE POLICY "Allow full access to tasks"
ON tasks
FOR ALL
USING (true)
WITH CHECK (true);

-- =========================================================
-- AUTO-CREATE PROFILE AFTER USER SIGNUP
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email
  )
  VALUES (
    NEW.id,
    NEW.email
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
