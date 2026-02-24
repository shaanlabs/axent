-- ════════════════════════════════════════════════════════════════════════════════
-- AXENT - Clean Schema Migration (Drop Old, Apply New)
-- ════════════════════════════════════════════════════════════════════════════════
-- Run this INSTEAD of the main schema file if you get errors about existing tables
-- This safely drops the old simple schema and applies the new production schema
-- ════════════════════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════════════════════════
-- STEP 1: DROP OLD SCHEMA (if exists)
-- ════════════════════════════════════════════════════════════════════════════════

-- Drop old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;

-- Drop old function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.fn_handle_new_user() CASCADE;

-- Drop old table (this is safe - will recreate with new structure)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop old types if they exist
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.audit_action CASCADE;


-- ════════════════════════════════════════════════════════════════════════════════
-- STEP 2: NOW PASTE THE ENTIRE CONTENT FROM supabase_schema.sql BELOW THIS LINE
-- ════════════════════════════════════════════════════════════════════════════════
-- (Copy everything from supabase_schema.sql starting from the §0 section)
