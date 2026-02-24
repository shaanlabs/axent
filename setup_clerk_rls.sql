-- AXENT MVP: Clerk + Supabase Integration Script
-- Run this in the Supabase SQL Editor to configure Row Level Security (RLS) to use the Clerk JWT.
-- Reference: https://clerk.com/docs/integrations/databases/supabase

-- 1. Create a function to extract the Clerk user ID from the custom JWT
create or replace function requesting_user_id()
returns text
language sql stable
as $$
  -- When using Clerk's "supabase" JWT template, the user ID is in the "sub" claim.
  select nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$;

-- 2. Ensure RLS is enabled on all important tables (example: profiles)
alter table public.profiles enable row level security;

-- 3. Drop existing permissive policies (if any) to reset security
-- drop policy if exists "Enable read access for all users" on "public"."profiles";
-- drop policy if exists "Enable insert for authenticated users only" on "public"."profiles";

-- 4. Create RLS policies using the new requesting_user_id() function
-- Example: Users can only read and update their own profile
create policy "Users can view own profile" 
on public.profiles for select 
using ( requesting_user_id() = id );

create policy "Users can update own profile" 
on public.profiles for update 
using ( requesting_user_id() = id );

create policy "Users can insert own profile" 
on public.profiles for insert 
with check ( requesting_user_id() = id );

-- Important: Repeat step 4 for other tables like `projects`, `equipment`, etc.
-- using ( requesting_user_id() = clerk_user_id_column )

-- Note: Ensure you have added the "supabase" JWT template in your Clerk Dashboard!
