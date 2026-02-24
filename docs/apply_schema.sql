-- ════════════════════════════════════════════════════════════════════════════════
-- AXENT - Complete Clean Migration (All-in-One)
-- ════════════════════════════════════════════════════════════════════════════════
-- Copy this ENTIRE file and run it in Supabase SQL Editor
-- This will clean up old schema and apply the new production schema
-- ════════════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════════════
-- PART 1: CLEANUP OLD SCHEMA
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS trg_profiles_audit ON public.profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.fn_handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.fn_set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.fn_audit_profiles() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Drop tables
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.audit_action CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- PART 2: APPLY NEW PRODUCTION SCHEMA
-- ══════════════════════════════════════════════════════════════════════════════

-- Schema hygiene
CREATE SCHEMA IF NOT EXISTS public;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Custom types
CREATE TYPE public.app_role AS ENUM (
  'customer',
  'organization',
  'provider',
  'admin'
);

CREATE TYPE public.audit_action AS ENUM (
  'INSERT',
  'UPDATE',
  'DELETE',
  'SOFT_DELETE'
);

-- Profiles table
CREATE TABLE public.profiles (
  id            UUID            PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT            NOT NULL,
  name          TEXT,
  phone         TEXT,
  role          public.app_role NOT NULL DEFAULT 'customer',
  location      JSONB,
  avatar_url    TEXT,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT timezone('utc', now()),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT timezone('utc', now()),
  
  CONSTRAINT profiles_email_unique UNIQUE (email),
  CONSTRAINT profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT profiles_phone_e164 CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{8,15}$'),
  CONSTRAINT profiles_avatar_url_format CHECK (avatar_url IS NULL OR avatar_url ~* '^https?://.+'),
  CONSTRAINT profiles_timestamps_order CHECK (updated_at >= created_at)
);

-- Audit log table
CREATE TABLE public.audit_log (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name  TEXT NOT NULL,
  record_id   UUID NOT NULL,
  action      public.audit_action NOT NULL,
  old_data    JSONB,
  new_data    JSONB,
  changed_by  UUID,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  
  CONSTRAINT audit_log_has_data CHECK (old_data IS NOT NULL OR new_data IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_profiles_active ON public.profiles (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_role ON public.profiles (role) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_location_city ON public.profiles ((location->>'city')) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_location_country ON public.profiles ((location->>'country')) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_phone ON public.profiles (phone) WHERE phone IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_audit_record ON public.audit_log (table_name, record_id);
CREATE INDEX idx_audit_actor ON public.audit_log (changed_by);
CREATE INDEX idx_audit_time ON public.audit_log (changed_at DESC);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log FORCE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() ->> 'user_role') = 'admin', FALSE);
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.app_role
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles
  WHERE id = (SELECT auth.uid()) AND deleted_at IS NULL LIMIT 1;
$$;

-- Trigger functions
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := timezone('utc', now());
  IF NEW.updated_at < NEW.created_at THEN
    NEW.updated_at := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_phone TEXT;
BEGIN
  v_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'name', '')), '');
  v_phone := NULLIF(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'phone', ''), '[\s\-\(\)]', '', 'g'), '');
  
  INSERT INTO public.profiles (id, email, name, phone, created_at, updated_at)
  VALUES (NEW.id, NEW.email, v_name, v_phone, timezone('utc', now()), timezone('utc', now()))
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[fn_handle_new_user] Failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_audit_profiles()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action public.audit_action;
  v_old JSONB := NULL;
  v_new JSONB := NULL;
  v_record_id UUID;
BEGIN
  CASE TG_OP
    WHEN 'INSERT' THEN
      v_action := 'INSERT';
      v_new := to_jsonb(NEW);
      v_record_id := NEW.id;
    WHEN 'UPDATE' THEN
      IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        v_action := 'SOFT_DELETE';
      ELSE
        v_action := 'UPDATE';
      END IF;
      v_old := to_jsonb(OLD);
      v_new := to_jsonb(NEW);
      v_record_id := NEW.id;
    WHEN 'DELETE' THEN
      v_action := 'DELETE';
      v_old := to_jsonb(OLD);
      v_record_id := OLD.id;
  END CASE;
  
  INSERT INTO public.audit_log (table_name, record_id, action, old_data, new_data, changed_by, changed_at)
  VALUES (TG_TABLE_NAME, v_record_id, v_action, v_old, v_new, (SELECT auth.uid()), timezone('utc', now()));
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[fn_audit_profiles] Failed: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers
CREATE TRIGGER trg_profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_profiles();

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.fn_handle_new_user();

-- RLS Policies
CREATE POLICY "profiles: user selects own" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id AND deleted_at IS NULL);

CREATE POLICY "profiles: admin selects all" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()) AND deleted_at IS NULL);

CREATE POLICY "profiles: user inserts own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "profiles: user updates own" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id AND deleted_at IS NULL)
  WITH CHECK ((SELECT auth.uid()) = id AND role = (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "profiles: admin updates all" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()) AND deleted_at IS NULL)
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "audit_log: admin selects all" ON public.audit_log
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));

CREATE POLICY "audit_log: user selects own" ON public.audit_log
  FOR SELECT TO authenticated
  USING (changed_by = (SELECT auth.uid()));

-- Privileges
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
REVOKE DELETE ON public.profiles FROM authenticated, anon;
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT ON public.audit_log TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.audit_log FROM authenticated, anon;
REVOKE USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_audit_profiles() FROM PUBLIC;

-- ══════════════════════════════════════════════════════════════════════════════
-- SUCCESS! Schema applied ✓
-- ══════════════════════════════════════════════════════════════════════════════
