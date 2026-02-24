-- ════════════════════════════════════════════════════════════════════════════════
--
--    ░█████╗░██╗░░██╗███████╗███╗░░██╗████████╗
--    ██╔══██╗╚██╗██╔╝██╔════╝████╗░██║╚══██╔══╝
--    ███████║░╚███╔╝░█████╗░░██╔██╗██║░░░██║░░░
--    ██╔══██║░██╔██╗░██╔══╝░░██║╚████║░░░██║░░░
--    ██║░░██║██╔╝╚██╗███████╗██║░╚███║░░░██║░░░
--    ╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░
--
--    Platform Database Schema — Production Ready
--    Migration  : 0001_initial_schema
--    Compatible : Supabase (PostgreSQL 15+)
--    Last update: 2026-02-17
--
-- ════════════════════════════════════════════════════════════════════════════════
--
--  HOW TO APPLY
--  ────────────
--  Option A (recommended): Supabase CLI
--    supabase migration new initial_schema
--    → paste this file into supabase/migrations/<timestamp>_initial_schema.sql
--    supabase db push
--
--  Option B: Supabase Dashboard SQL Editor
--    Dashboard → SQL Editor → New Query → paste → Run
--
--  ROLLBACK
--  ────────
--  A companion rollback block is included at the very bottom of this file.
--  Uncomment and run that section only when you need to tear everything down.
--
--  IDEMPOTENCY
--  ───────────
--  Every statement uses IF [NOT] EXISTS / OR REPLACE / DROP … IF EXISTS.
--  Safe to re-run without side-effects.
--
-- ════════════════════════════════════════════════════════════════════════════════
--
--  TABLE OF CONTENTS
--  ─────────────────
--  §0   Schema hygiene & privilege baseline
--  §1   Custom types        (app_role, audit_action)
--  §2   Tables              (profiles, audit_log)
--  §3   Indexes
--  §4   Row Level Security  (enable + force)
--  §5   RLS Policies        (profiles, audit_log)
--  §6   Helper functions    (is_admin, current_user_role)
--  §7   Trigger functions   (updated_at, handle_new_user, audit)
--  §8   Triggers
--  §9   Table & column privileges
--  §10  Verification suite
--  §11  Rollback (commented out — uncomment to destroy)
--
-- ════════════════════════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════════════════════════
--  §0  SCHEMA HYGIENE & PRIVILEGE BASELINE
-- ════════════════════════════════════════════════════════════════════════════════

-- Guarantee the public schema exists
CREATE SCHEMA IF NOT EXISTS public;

-- Close the well-known Postgres "public schema" attack surface:
-- without this, any authenticated DB role can CREATE objects in public.
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Re-grant only what's needed for query resolution
GRANT USAGE ON SCHEMA public TO anon, authenticated;


-- ════════════════════════════════════════════════════════════════════════════════
--  §1  CUSTOM TYPES
-- ════════════════════════════════════════════════════════════════════════════════
-- Enums enforce valid values at the type level — no CHECK constraint drift.
-- To add a new role:   ALTER TYPE public.app_role    ADD VALUE 'new_role';
-- To add a new action: ALTER TYPE public.audit_action ADD VALUE 'new_action';

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM (
    'customer',       -- default consumer account
    'organization',   -- business / org account
    'provider',       -- service provider
    'admin'           -- platform administrator
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;  -- already exists, skip
END $$;

COMMENT ON TYPE public.app_role IS
  'Application-level RBAC role assigned to every profile. '
  'Extend with: ALTER TYPE public.app_role ADD VALUE ''new_role'';';

-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.audit_action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'SOFT_DELETE'   -- UPDATE that sets deleted_at; treated as its own event
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE public.audit_action IS
  'DML action recorded in audit_log. '
  'SOFT_DELETE is a special sub-type of UPDATE.';


-- ════════════════════════════════════════════════════════════════════════════════
--  §2  TABLES
-- ════════════════════════════════════════════════════════════════════════════════

-- ── 2a. profiles ────────────────────────────────────────────────────────────────
--
--  One row per auth.users entry.
--  Lifecycle:
--    created  → fn_handle_new_user trigger fires on auth.users INSERT
--    updated  → trg_profiles_set_updated_at keeps updated_at accurate
--    soft-del → set deleted_at; row hidden by RLS, preserved in audit_log
--    hard-del → CASCADE from auth.users DELETE (removes the profile row)
-- ────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (

  -- ── Identity ────────────────────────────────────────────────────────────────
  id            UUID            PRIMARY KEY
                                REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ── Contact ─────────────────────────────────────────────────────────────────
  -- email mirrors auth.users.email; validated + unique here as a second guard
  email         TEXT            NOT NULL,
  name          TEXT,           -- NULL when unknown; never stored as empty string
  -- E.164 format: optional leading +, then 8-15 digits (spaces/dashes stripped by trigger)
  phone         TEXT,

  -- ── Application metadata ────────────────────────────────────────────────────
  role          public.app_role NOT NULL DEFAULT 'customer',

  -- Flexible location bag. Recommended shape:
  --   { "city": "New York", "country": "US", "lat": 40.71, "lng": -74.00 }
  location      JSONB,
  avatar_url    TEXT,

  -- ── Soft-delete ─────────────────────────────────────────────────────────────
  -- NULL  → active record
  -- value → deactivated at that timestamp; invisible via RLS to all client roles
  deleted_at    TIMESTAMPTZ,

  -- ── Timestamps ──────────────────────────────────────────────────────────────
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT timezone('utc', now()),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT timezone('utc', now()),

  -- ── Constraints ─────────────────────────────────────────────────────────────

  -- Unique email (one profile per email address)
  CONSTRAINT profiles_email_unique
    UNIQUE (email),

  -- Basic RFC-5321 email shape check
  CONSTRAINT profiles_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),

  -- E.164 phone: optional +, 8-15 digits
  CONSTRAINT profiles_phone_e164
    CHECK (
      phone IS NULL
      OR phone ~ '^\+?[0-9]{8,15}$'
    ),

  -- avatar_url must be an http/https URL when present
  CONSTRAINT profiles_avatar_url_format
    CHECK (
      avatar_url IS NULL
      OR avatar_url ~* '^https?://.+'
    ),

  -- Clock sanity: updated_at must never precede created_at
  CONSTRAINT profiles_timestamps_order
    CHECK (updated_at >= created_at)
);

-- Table comments
COMMENT ON TABLE  public.profiles IS
  'One row per authenticated user. '
  'Mirrors auth.users with app-level metadata, soft-delete, and full audit trail.';

-- Column comments
COMMENT ON COLUMN public.profiles.id          IS 'FK → auth.users.id. Immutable after insert. Cascade-deletes on auth removal.';
COMMENT ON COLUMN public.profiles.email       IS 'Validated by CHECK. Unique. Should stay in sync with auth.users.email.';
COMMENT ON COLUMN public.profiles.name        IS 'Display name. NULL when unknown. Never stored as empty string (trigger sanitises).';
COMMENT ON COLUMN public.profiles.phone       IS 'E.164 format (e.g. +12125551234). Trigger strips spaces/dashes on sign-up.';
COMMENT ON COLUMN public.profiles.role        IS 'App-level RBAC. Defaults to customer. Enum prevents invalid values.';
COMMENT ON COLUMN public.profiles.location    IS 'Free-form JSONB. Recommended: { city, country, lat, lng }. Indexed on city.';
COMMENT ON COLUMN public.profiles.avatar_url  IS 'Must be a valid http/https URL when present.';
COMMENT ON COLUMN public.profiles.deleted_at  IS 'NULL = active. Timestamp = soft-deleted. RLS hides these rows from all client roles.';
COMMENT ON COLUMN public.profiles.created_at  IS 'Set once on INSERT. Never modified.';
COMMENT ON COLUMN public.profiles.updated_at  IS 'Auto-stamped on every UPDATE by trg_profiles_set_updated_at.';


-- ── 2b. audit_log ───────────────────────────────────────────────────────────────
--
--  Append-only ledger for all DML on audited tables.
--  Guarantees: no UPDATE or DELETE permitted via RLS (INSERT via trigger only).
-- ────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (

  id          BIGINT            GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name  TEXT              NOT NULL,
  record_id   UUID              NOT NULL,
  action      public.audit_action NOT NULL,

  -- Full row snapshots as JSONB diffs:
  old_data    JSONB,  -- NULL on INSERT
  new_data    JSONB,  -- NULL on DELETE

  -- Who made the change (auth.uid() of the calling session)
  changed_by  UUID,

  changed_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),

  -- Every row must carry at least one side of the diff
  CONSTRAINT audit_log_has_data
    CHECK (old_data IS NOT NULL OR new_data IS NOT NULL)
);

COMMENT ON TABLE  public.audit_log IS
  'Append-only audit trail. '
  'All writes are via SECURITY DEFINER triggers. '
  'Client roles cannot INSERT, UPDATE, or DELETE rows here.';

COMMENT ON COLUMN public.audit_log.old_data   IS 'Full row snapshot before the change. NULL for INSERT.';
COMMENT ON COLUMN public.audit_log.new_data   IS 'Full row snapshot after the change.  NULL for DELETE.';
COMMENT ON COLUMN public.audit_log.changed_by IS 'auth.uid() at the time of the change. NULL for system/trigger-only operations.';


-- ════════════════════════════════════════════════════════════════════════════════
--  §3  INDEXES
-- ════════════════════════════════════════════════════════════════════════════════
-- All partial indexes on profiles filter deleted_at IS NULL so soft-deleted
-- rows are excluded automatically and the index stays lean.

-- UNIQUE email index is created implicitly by profiles_email_unique — no duplicate.

-- Active records only (PK lookups skip deleted rows)
CREATE INDEX IF NOT EXISTS idx_profiles_active
  ON public.profiles (id)
  WHERE deleted_at IS NULL;

-- Role lookups: "list all providers", "list all admins"
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles (role)
  WHERE deleted_at IS NULL;

-- JSONB city filter: "find providers in New York"
CREATE INDEX IF NOT EXISTS idx_profiles_location_city
  ON public.profiles ((location->>'city'))
  WHERE deleted_at IS NULL;

-- Country filter: "find users in US"
CREATE INDEX IF NOT EXISTS idx_profiles_location_country
  ON public.profiles ((location->>'country'))
  WHERE deleted_at IS NULL;

-- phone — useful for deduplication checks
CREATE INDEX IF NOT EXISTS idx_profiles_phone
  ON public.profiles (phone)
  WHERE phone IS NOT NULL
    AND deleted_at IS NULL;

-- audit_log: look up all events for a specific record
CREATE INDEX IF NOT EXISTS idx_audit_record
  ON public.audit_log (table_name, record_id);

-- audit_log: look up all actions by a specific user
CREATE INDEX IF NOT EXISTS idx_audit_actor
  ON public.audit_log (changed_by);

-- audit_log: time-range queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_audit_time
  ON public.audit_log (changed_at DESC);


-- ════════════════════════════════════════════════════════════════════════════════
--  §4  ROW LEVEL SECURITY — ENABLE & FORCE
-- ════════════════════════════════════════════════════════════════════════════════
-- FORCE ensures RLS applies even to the table owner when connecting as a
-- non-superuser role (e.g. a Supabase edge function using service_role still
-- bypasses RLS, but a compromised connection using the table owner role won't).

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles  FORCE  ROW LEVEL SECURITY;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log FORCE  ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════════
--  §5  RLS POLICIES
-- ════════════════════════════════════════════════════════════════════════════════
-- Conventions:
--  • All policies are named "table: actor verb" for fast grep/readability.
--  • (SELECT auth.uid()) is used instead of auth.uid() — the subquery form
--    is cached within a statement and avoids repeated function evaluations.
--  • is_admin() is centralised in §6; change admin logic once, all policies update.
--  • No DELETE policy on profiles — hard-delete is only via auth.users CASCADE.

-- ── profiles: SELECT ────────────────────────────────────────────────────────────

-- Users read only their own active profile
DROP POLICY IF EXISTS "profiles: user selects own"   ON public.profiles;
CREATE POLICY          "profiles: user selects own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    AND deleted_at IS NULL
  );

-- Admins read all active profiles
DROP POLICY IF EXISTS "profiles: admin selects all"  ON public.profiles;
CREATE POLICY          "profiles: admin selects all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT public.is_admin())
    AND deleted_at IS NULL
  );

-- ── profiles: INSERT ────────────────────────────────────────────────────────────

-- Users may only insert a row for themselves
DROP POLICY IF EXISTS "profiles: user inserts own"   ON public.profiles;
CREATE POLICY          "profiles: user inserts own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- ── profiles: UPDATE ────────────────────────────────────────────────────────────

-- Users update their own active profile.
-- WITH CHECK re-validates after the change:
--   • id must still match the session uid (prevents id swap)
--   • role must equal the stored role (prevents self-promotion)
DROP POLICY IF EXISTS "profiles: user updates own"   ON public.profiles;
CREATE POLICY          "profiles: user updates own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    AND deleted_at IS NULL
  )
  WITH CHECK (
    (SELECT auth.uid()) = id
    AND role = (
      SELECT role
      FROM   public.profiles
      WHERE  id = (SELECT auth.uid())
    )
  );

-- Admins may update any active profile (including changing roles)
DROP POLICY IF EXISTS "profiles: admin updates all"  ON public.profiles;
CREATE POLICY          "profiles: admin updates all"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING      ((SELECT public.is_admin()) AND deleted_at IS NULL)
  WITH CHECK ((SELECT public.is_admin()));

-- ── profiles: DELETE ────────────────────────────────────────────────────────────
-- No policy created → denied to all client roles by default.
-- Soft-delete is achieved by setting deleted_at via the UPDATE policy.
-- True removal only occurs via CASCADE from auth.users deletion (superuser action).

-- ── audit_log: SELECT ───────────────────────────────────────────────────────────

-- Admins see the full audit trail
DROP POLICY IF EXISTS "audit_log: admin selects all" ON public.audit_log;
CREATE POLICY          "audit_log: admin selects all"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- Users see only their own audit entries
DROP POLICY IF EXISTS "audit_log: user selects own"  ON public.audit_log;
CREATE POLICY          "audit_log: user selects own"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (changed_by = (SELECT auth.uid()));

-- ── audit_log: INSERT / UPDATE / DELETE ─────────────────────────────────────────
-- No policies created → all denied to client roles.
-- Writes happen only via SECURITY DEFINER trigger (fn_audit_profiles).


-- ════════════════════════════════════════════════════════════════════════════════
--  §6  HELPER FUNCTIONS
-- ════════════════════════════════════════════════════════════════════════════════

-- ── is_admin() ──────────────────────────────────────────────────────────────────
--
--  Single source of truth for admin detection.
--  Reads the 'user_role' custom claim from the signed JWT.
--
--  How to set the claim (pick one):
--    A) Supabase Auth hook (recommended): set raw_app_meta_data->>'user_role' = 'admin'
--    B) SQL (service_role only):
--       UPDATE auth.users
--       SET    raw_app_meta_data = raw_app_meta_data || '{"user_role":"admin"}'
--       WHERE  id = '<user-uuid>';
--       Then ask the user to sign out and back in so the new JWT is issued.
-- ────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE          -- constant within a single SQL statement; Postgres can cache the result
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    FALSE
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;

COMMENT ON FUNCTION public.is_admin() IS
  'Returns TRUE when the current JWT carries user_role = ''admin''. '
  'Used by all RLS policies — change admin logic here only.';


-- ── current_user_role() ─────────────────────────────────────────────────────────
--
--  Convenience: returns the caller's app_role from their profile row.
--  Useful in application code: SELECT public.current_user_role();
-- ────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM   public.profiles
  WHERE  id         = (SELECT auth.uid())
    AND  deleted_at IS NULL
  LIMIT  1;
$$;

REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

COMMENT ON FUNCTION public.current_user_role() IS
  'Returns the app_role of the currently authenticated user. '
  'Returns NULL when unauthenticated or profile is soft-deleted.';


-- ════════════════════════════════════════════════════════════════════════════════
--  §7  TRIGGER FUNCTIONS
-- ════════════════════════════════════════════════════════════════════════════════

-- ── fn_set_updated_at() ─────────────────────────────────────────────────────────
--
--  BEFORE UPDATE: stamps updated_at = now() UTC.
--  Guards against clients supplying a stale or back-dated timestamp.
-- ────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Always stamp now(), ignoring whatever the client supplied
  NEW.updated_at := timezone('utc', now());

  -- Sanity guard: never let updated_at go before created_at
  IF NEW.updated_at < NEW.created_at THEN
    NEW.updated_at := NEW.created_at;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.fn_set_updated_at() FROM PUBLIC;

COMMENT ON FUNCTION public.fn_set_updated_at() IS
  'BEFORE UPDATE trigger: stamps updated_at = now() UTC. '
  'Rejects client-supplied timestamps and clock roll-backs.';


-- ── fn_handle_new_user() ────────────────────────────────────────────────────────
--
--  AFTER INSERT on auth.users: creates a matching profiles row.
--  • Sanitises name (trim + NULL-on-blank).
--  • Strips phone formatting to approach E.164.
--  • ON CONFLICT DO NOTHING → idempotent on retry / webhook dedup.
--  • EXCEPTION block → sign-up is NEVER blocked by a profile-creation error.
-- ────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name  TEXT;
  v_phone TEXT;
BEGIN
  -- Sanitise name: trim whitespace; store NULL rather than empty string
  v_name := NULLIF(
    TRIM(COALESCE(NEW.raw_user_meta_data->>'name', '')),
    ''
  );

  -- Sanitise phone: remove spaces, dashes, parentheses; then NULL-on-blank
  v_phone := NULLIF(
    REGEXP_REPLACE(
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      '[\s\-\(\)]', '', 'g'
    ),
    ''
  );

  INSERT INTO public.profiles (
    id,
    email,
    name,
    phone,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_phone,
    timezone('utc', now()),
    timezone('utc', now())
  )
  ON CONFLICT (id) DO NOTHING;  -- safe for retries and webhook deduplication

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the failure but never block the sign-up — a missing profile is
    -- recoverable; a failed auth.users insert is not.
    RAISE WARNING '[fn_handle_new_user] Failed to create profile for user %: %',
      NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.fn_handle_new_user() FROM PUBLIC;

COMMENT ON FUNCTION public.fn_handle_new_user() IS
  'AFTER INSERT on auth.users: inserts a profiles row for the new user. '
  'Idempotent (ON CONFLICT DO NOTHING). '
  'Errors are WARNINGs only — sign-up is never blocked.';


-- ── fn_audit_profiles() ─────────────────────────────────────────────────────────
--
--  AFTER INSERT/UPDATE/DELETE on profiles: writes a row to audit_log.
--  Detects SOFT_DELETE as a distinct event type.
-- ────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_audit_profiles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action    public.audit_action;
  v_old       JSONB := NULL;
  v_new       JSONB := NULL;
  v_record_id UUID;
BEGIN
  CASE TG_OP

    WHEN 'INSERT' THEN
      v_action     := 'INSERT';
      v_new        := to_jsonb(NEW);
      v_record_id  := NEW.id;

    WHEN 'UPDATE' THEN
      -- Distinguish a soft-delete UPDATE from a regular UPDATE
      IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        v_action := 'SOFT_DELETE';
      ELSE
        v_action := 'UPDATE';
      END IF;
      v_old       := to_jsonb(OLD);
      v_new       := to_jsonb(NEW);
      v_record_id := NEW.id;

    WHEN 'DELETE' THEN
      v_action     := 'DELETE';
      v_old        := to_jsonb(OLD);
      v_record_id  := OLD.id;

  END CASE;

  INSERT INTO public.audit_log (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_by,
    changed_at
  )
  VALUES (
    TG_TABLE_NAME,
    v_record_id,
    v_action,
    v_old,
    v_new,
    (SELECT auth.uid()),   -- NULL for system/service_role operations
    timezone('utc', now())
  );

  RETURN COALESCE(NEW, OLD);

EXCEPTION
  WHEN OTHERS THEN
    -- Audit failure must never break the actual DML operation
    RAISE WARNING '[fn_audit_profiles] Audit write failed for % on %: %',
      TG_OP, TG_TABLE_NAME, SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.fn_audit_profiles() FROM PUBLIC;

COMMENT ON FUNCTION public.fn_audit_profiles() IS
  'AFTER INSERT/UPDATE/DELETE on profiles: appends a row to audit_log. '
  'Distinguishes SOFT_DELETE from regular UPDATE. '
  'Errors are WARNINGs only — the originating DML is never rolled back.';


-- ════════════════════════════════════════════════════════════════════════════════
--  §8  TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════════

-- ── profiles: stamp updated_at on every UPDATE ───────────────────────────────────
DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
CREATE TRIGGER          trg_profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_set_updated_at();

-- ── profiles: write audit log on every DML ───────────────────────────────────────
DROP TRIGGER IF EXISTS trg_profiles_audit ON public.profiles;
CREATE TRIGGER          trg_profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_audit_profiles();

-- ── auth.users: auto-create profile on sign-up ───────────────────────────────────
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER          trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_handle_new_user();


-- ════════════════════════════════════════════════════════════════════════════════
--  §9  TABLE & COLUMN PRIVILEGES
-- ════════════════════════════════════════════════════════════════════════════════
-- Explicit GRANT/REVOKE beats relying on Supabase defaults.
-- service_role bypasses RLS entirely — keep it out of reach of client code.

-- ── profiles ─────────────────────────────────────────────────────────────────────

-- authenticated: select + upsert own row (RLS restricts to own rows)
GRANT SELECT, INSERT, UPDATE
  ON public.profiles
  TO authenticated;

-- No direct hard-delete from client roles; only CASCADE from auth.users
REVOKE DELETE
  ON public.profiles
  FROM authenticated, anon;

-- anon gets nothing — unauthenticated users cannot touch profiles
REVOKE ALL
  ON public.profiles
  FROM anon;

-- ── audit_log ─────────────────────────────────────────────────────────────────────

-- authenticated can read (RLS further restricts to own rows / admins)
GRANT SELECT
  ON public.audit_log
  TO authenticated;

-- No direct writes from any client role — triggers do all writes
REVOKE INSERT, UPDATE, DELETE
  ON public.audit_log
  FROM authenticated, anon;

-- ── Sequences ────────────────────────────────────────────────────────────────────
-- audit_log.id uses GENERATED ALWAYS AS IDENTITY — no external role needs the seq
REVOKE USAGE, SELECT
  ON ALL SEQUENCES IN SCHEMA public
  FROM anon;


-- ════════════════════════════════════════════════════════════════════════════════
--  §10  VERIFICATION SUITE
-- ════════════════════════════════════════════════════════════════════════════════
-- Run this section after applying the migration.
-- Every query should return rows / the expected value.

-- ── Tables exist ────────────────────────────────────────────────────────────────
SELECT '✓ profiles table'   AS check_name WHERE EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE  table_schema = 'public' AND table_name = 'profiles'
);
SELECT '✓ audit_log table'  AS check_name WHERE EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE  table_schema = 'public' AND table_name = 'audit_log'
);

-- ── Types exist ─────────────────────────────────────────────────────────────────
SELECT '✓ app_role type'    AS check_name WHERE EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role');
SELECT '✓ audit_action type' AS check_name WHERE EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action');

-- ── Column inventory ────────────────────────────────────────────────────────────
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM   information_schema.columns
WHERE  table_schema = 'public'
  AND  table_name   = 'profiles'
ORDER BY ordinal_position;

-- ── Constraints ─────────────────────────────────────────────────────────────────
SELECT
  conname                        AS constraint_name,
  contype                        AS type,  -- p=PK, u=UNIQUE, c=CHECK, f=FK
  pg_get_constraintdef(oid)      AS definition
FROM   pg_constraint
WHERE  conrelid = 'public.profiles'::regclass
ORDER BY contype, conname;

-- ── Indexes ─────────────────────────────────────────────────────────────────────
SELECT indexname, indexdef
FROM   pg_indexes
WHERE  schemaname = 'public'
  AND  tablename IN ('profiles', 'audit_log')
ORDER BY tablename, indexname;

-- ── RLS status ──────────────────────────────────────────────────────────────────
SELECT
  relname              AS table_name,
  relrowsecurity       AS rls_enabled,
  relforcerowsecurity  AS rls_forced
FROM   pg_class
WHERE  relnamespace = 'public'::regnamespace
  AND  relname IN ('profiles', 'audit_log');

-- ── RLS policies ────────────────────────────────────────────────────────────────
SELECT
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM   pg_policies
WHERE  schemaname = 'public'
  AND  tablename IN ('profiles', 'audit_log')
ORDER BY tablename, policyname;

-- ── Functions ───────────────────────────────────────────────────────────────────
SELECT
  routine_name,
  routine_type,
  security_type
FROM   information_schema.routines
WHERE  routine_schema = 'public'
  AND  routine_name IN (
    'is_admin',
    'current_user_role',
    'fn_set_updated_at',
    'fn_handle_new_user',
    'fn_audit_profiles'
  )
ORDER BY routine_name;

-- ── Triggers ────────────────────────────────────────────────────────────────────
SELECT
  trigger_name,
  event_object_schema,
  event_object_table,
  event_manipulation,
  action_timing
FROM   information_schema.triggers
WHERE  trigger_name IN (
  'trg_profiles_set_updated_at',
  'trg_profiles_audit',
  'trg_on_auth_user_created'
)
ORDER BY trigger_name;

-- ── Privilege audit ─────────────────────────────────────────────────────────────
SELECT
  grantee,
  table_name,
  privilege_type,
  is_grantable
FROM   information_schema.role_table_grants
WHERE  table_schema = 'public'
  AND  table_name IN ('profiles', 'audit_log')
ORDER BY table_name, grantee, privilege_type;


-- ════════════════════════════════════════════════════════════════════════════════
--  §11  ROLLBACK  (⚠️  UNCOMMENT ONLY TO DESTROY — IRREVERSIBLE IN PRODUCTION)
-- ════════════════════════════════════════════════════════════════════════════════
--
-- Tears down everything this migration created, in reverse dependency order.
-- Safe to run repeatedly (all statements are idempotent).
--
-- ────────────────────────────────────────────────────────────────────────────────
/*

-- Triggers
DROP TRIGGER IF EXISTS trg_on_auth_user_created    ON auth.users;
DROP TRIGGER IF EXISTS trg_profiles_audit          ON public.profiles;
DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;

-- Functions
DROP FUNCTION IF EXISTS public.fn_audit_profiles()   CASCADE;
DROP FUNCTION IF EXISTS public.fn_handle_new_user()  CASCADE;
DROP FUNCTION IF EXISTS public.fn_set_updated_at()   CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role()   CASCADE;
DROP FUNCTION IF EXISTS public.is_admin()            CASCADE;

-- Tables (audit_log first — no FK deps; profiles has FK to auth.users)
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.profiles  CASCADE;

-- Types
DROP TYPE IF EXISTS public.audit_action CASCADE;
DROP TYPE IF EXISTS public.app_role     CASCADE;

-- Restore default schema privilege
GRANT CREATE ON SCHEMA public TO PUBLIC;

*/
-- ════════════════════════════════════════════════════════════════════════════════
--  END OF MIGRATION 0001_initial_schema
-- ════════════════════════════════════════════════════════════════════════════════
