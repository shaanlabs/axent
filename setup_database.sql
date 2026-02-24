-- ==========================================
-- AXENT ENTERPRISE MVP: Complete Supabase Database Schema
-- Includes Clerk Integration, Teams, Bidding, AI Queues, Vector Mapping, and Advanced RLS
-- ==========================================

-- 1. CLERK INTEGRATION: Extract user ID from the custom JWT
create or replace function requesting_user_id()
returns text
language sql stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$;

-- 2. AUTOMATIC TIMESTAMP TRIGGER
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin 
  new.updated_at = now(); 
  return new; 
end;
$$;

-- 3. SEARCH TEXT AUTOMATION TRIGGERS
create or replace function update_equipment_search()
returns trigger language plpgsql as $$
begin
  new.search_text := to_tsvector('english', coalesce(new.name,'') || ' ' || coalesce(new.type,'') || ' ' || coalesce(new.category,''));
  return new;
end;
$$;

create or replace function update_project_search()
returns trigger language plpgsql as $$
begin
  new.search_text := to_tsvector('english', coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.work_type,''));
  return new;
end;
$$;


-- ==========================================
-- TABLE DEFINITIONS
-- ==========================================

-- A. PROFILES & ORGANIZATIONS (TEAMS SYSTEM)

create table public.profiles (
  id text primary key, -- Clerk User ID
  email text not null,
  name text,
  role text not null check (role in ('customer', 'provider', 'organization_owner', 'organization_member', 'admin', 'moderator')) default 'customer',
  dashboard_type text default 'customer',
  location jsonb,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);
create trigger set_updated_at before update on public.profiles for each row execute function update_updated_at();

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id text references public.profiles(id) on delete cascade,
  industry text, -- mining, construction, agriculture
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);
create trigger set_updated_at before update on public.organizations for each row execute function update_updated_at();

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id text references public.profiles(id) on delete cascade,
  role text check (role in ('owner','manager','operator','viewer')) default 'viewer',
  joined_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  constraint unique_org_member unique (organization_id, user_id)
);

-- B. EQUIPMENT, AVAILABILITY, REVIEWS

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  ownership_type text not null check (ownership_type in ('user','organization')) default 'user',
  owner_user_id text references public.profiles(id),
  owner_org_id uuid references public.organizations(id),
  name text not null,
  type text not null,
  category text not null,
  pricing jsonb not null, -- {"per_hour": 500, "per_day": 3500, "per_project": 80000}
  location jsonb not null,
  available boolean default true,
  specifications jsonb,
  image_url text,
  search_text tsvector,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  deleted_at timestamp with time zone
);
create trigger set_updated_at before update on public.equipment for each row execute function update_updated_at();
create trigger equipment_search_update before insert or update on public.equipment for each row execute function update_equipment_search();

create table public.equipment_availability (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text not null check (status in ('booked','maintenance','blocked')),
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);
create trigger set_updated_at before update on public.equipment_availability for each row execute function update_updated_at();

-- C. PROJECTS & BIDS

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  title text not null default 'New Project',
  description text,
  location jsonb,
  work_type text,
  estimated_cost_min numeric,
  estimated_cost_max numeric,
  estimated_duration_days integer,
  required_machinery jsonb,
  search_text tsvector,
  status text not null check (status in ('draft', 'estimated', 'active', 'completed')) default 'estimated',
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  deleted_at timestamp with time zone
);
create trigger set_updated_at before update on public.projects for each row execute function update_updated_at();
create trigger project_search_update before insert or update on public.projects for each row execute function update_project_search();

create table public.bids (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  equipment_id uuid references public.equipment(id) on delete set null,
  bidder_id text not null references public.profiles(id),
  bid_amount numeric not null,
  pricing_type text check (pricing_type in ('hour','day','project')),
  estimated_days integer,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);
create trigger set_updated_at before update on public.bids for each row execute function update_updated_at();

-- D. RENTALS, REVIEWS, PAYMENTS

create table public.rentals (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  renter_id text not null references public.profiles(id) on delete cascade,
  owner_user_id text references public.profiles(id),
  owner_org_id uuid references public.organizations(id),
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  total_cost numeric not null,
  status text not null check (status in ('pending', 'approved', 'active', 'completed', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  deleted_at timestamp with time zone
);
create trigger set_updated_at before update on public.rentals for each row execute function update_updated_at();

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  reviewer_id text not null references public.profiles(id),
  reviewee_id text references public.profiles(id),
  equipment_id uuid references public.equipment(id) on delete cascade,
  rating numeric(3,1) not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  constraint unique_review_per_rental_reviewer unique (rental_id, reviewer_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  payer_id text references public.profiles(id),
  amount numeric not null,
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  transaction_id text,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  constraint unique_transaction unique (transaction_id)
);
create trigger set_updated_at before update on public.payments for each row execute function update_updated_at();

-- E. MEDIA & AI

create table public.media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id text not null references public.profiles(id) on delete cascade,
  file_url text not null,
  file_type text check (file_type in ('image','video')),
  file_size_kb integer,
  compressed boolean default true,
  ai_processed boolean default false,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  deleted_at timestamp with time zone
);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id text references public.profiles(id) on delete cascade,
  status text check (status in ('queued','processing','completed','failed')) default 'queued',
  progress integer default 0,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);
create trigger set_updated_at before update on public.ai_jobs for each row execute function update_updated_at();

create table public.ai_estimations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  detected_work_type text,
  estimated_cost_min numeric,
  estimated_cost_max numeric,
  estimated_duration_days integer,
  recommended_machinery jsonb,
  confidence_score numeric,
  model_version text,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);

create table public.vector_index (
  id uuid primary key default gen_random_uuid(),
  reference_type text not null, -- 'project', 'equipment', 'media'
  reference_id uuid not null,
  external_id text not null,
  provider text not null default 'chroma', -- 'chroma', 'qdrant'
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);

create table public.ai_user_memory (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  embedding_id text not null,
  preference_tags text[],
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);

-- F. TRACKING & AUDITING

create table public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  activity_type text not null, -- rent, list, bid, project
  reference_id uuid,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  type text not null, -- bid, rental, ai, system
  is_read boolean default false,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);

create table public.storage_usage (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  total_storage_mb numeric default 0,
  total_files integer default 0,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  updated_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null,
  constraint unique_storage_user unique (user_id)
);
create trigger set_updated_at before update on public.storage_usage for each row execute function update_updated_at();

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text, -- Can be null for system actions
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);

create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id text not null references public.profiles(id),
  action text not null,
  target_table text not null,
  target_id uuid,
  created_at timestamp with time zone default timezone('Asia/Kolkata'::text, now()) not null
);


-- ==========================================
-- INDEXES FOR PERFORMANCE SCALING
-- ==========================================

create index idx_org_owner on public.organizations(owner_id);
create index idx_org_members_org on public.organization_members(organization_id);
create index idx_org_members_user on public.organization_members(user_id);

create index idx_equipment_owner_user on public.equipment(owner_user_id);
create index idx_equipment_owner_org on public.equipment(owner_org_id);
create index idx_equipment_category on public.equipment(category);
create index idx_equip_search on public.equipment using gin(search_text);
create index idx_equipment_active on public.equipment(category) where deleted_at is null;

create index idx_ea_equipment on public.equipment_availability(equipment_id);

create index idx_projects_user on public.projects(user_id);
create index idx_projects_org on public.projects(organization_id);
create index idx_projects_search on public.projects using gin(search_text);
create index idx_projects_active on public.projects(user_id) where deleted_at is null;

create index idx_bids_project on public.bids(project_id);
create index idx_bids_bidder on public.bids(bidder_id);
create index idx_bids_equipment on public.bids(equipment_id);

create index idx_rentals_equipment on public.rentals(equipment_id);
create index idx_rentals_renter on public.rentals(renter_id);
create index idx_rentals_owner_user on public.rentals(owner_user_id);
create index idx_rentals_owner_org on public.rentals(owner_org_id);
create index idx_rentals_active on public.rentals(renter_id) where deleted_at is null;

create index idx_reviews_rental on public.reviews(rental_id);
create index idx_reviews_equipment on public.reviews(equipment_id);

create index idx_payments_rental on public.payments(rental_id);

create index idx_media_project on public.media(project_id);
create index idx_media_user on public.media(user_id);

create index idx_ai_jobs_project on public.ai_jobs(project_id);
create index idx_ai_jobs_user on public.ai_jobs(user_id);

create index idx_vector_index_ref on public.vector_index(reference_id);
create index idx_ai_user_mem_user on public.ai_user_memory(user_id);

create index idx_notifications_user on public.notifications(user_id);
create index idx_user_activity_user on public.user_activity(user_id);


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on core tables
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.equipment enable row level security;
alter table public.equipment_availability enable row level security;
alter table public.projects enable row level security;
alter table public.bids enable row level security;
alter table public.rentals enable row level security;
alter table public.reviews enable row level security;
alter table public.payments enable row level security;
alter table public.media enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.ai_estimations enable row level security;
alter table public.ai_user_memory enable row level security;
alter table public.vector_index enable row level security;
alter table public.user_activity enable row level security;
alter table public.notifications enable row level security;
alter table public.storage_usage enable row level security;
alter table public.audit_logs enable row level security;
alter table public.admin_actions enable row level security;

-- PROFILES
create policy "Users can view any profile" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (requesting_user_id() = id);
create policy "Current user can insert profile" on public.profiles for insert with check (requesting_user_id() = id);

-- ORGANIZATIONS
create policy "Anyone can view organizations" on public.organizations for select using (true);
create policy "Org Owners/Members can update org" on public.organizations for update using (
  requesting_user_id() = owner_id OR 
  requesting_user_id() in (select user_id from public.organization_members where organization_id = id and role in ('owner','manager'))
);
create policy "Current user can insert org" on public.organizations for insert with check (requesting_user_id() = owner_id);

create policy "Members can view org membership" on public.organization_members for select using (
  requesting_user_id() = user_id OR
  requesting_user_id() in (select owner_id from public.organizations where id = organization_id)
);
create policy "Org owners/managers can insert members" on public.organization_members for insert with check (
  requesting_user_id() in (select owner_id from public.organizations where id = organization_id)
);
create policy "Org owners/managers can delete members" on public.organization_members for delete using (
  requesting_user_id() = user_id OR
  requesting_user_id() in (select owner_id from public.organizations where id = organization_id)
);


-- EQUIPMENT
create policy "Anyone can view equipment" on public.equipment for select using (deleted_at is null);
create policy "Owners/Org Managers can insert equipment" on public.equipment for insert with check (
  (ownership_type = 'user' AND requesting_user_id() = owner_user_id) OR
  (ownership_type = 'organization' AND requesting_user_id() in (select user_id from public.organization_members where organization_id = owner_org_id and role in ('owner','manager','operator')))
);
create policy "Owners/Org Managers can update equipment" on public.equipment for update using (
  (ownership_type = 'user' AND requesting_user_id() = owner_user_id) OR
  (ownership_type = 'organization' AND requesting_user_id() in (select user_id from public.organization_members where organization_id = owner_org_id and role in ('owner','manager','operator')))
) with check (
  (ownership_type = 'user' AND requesting_user_id() = owner_user_id) OR
  (ownership_type = 'organization' AND requesting_user_id() in (select user_id from public.organization_members where organization_id = owner_org_id and role in ('owner','manager','operator')))
);
create policy "Owners/Org Managers can delete equipment" on public.equipment for delete using (
  (ownership_type = 'user' AND requesting_user_id() = owner_user_id) OR
  (ownership_type = 'organization' AND requesting_user_id() in (select user_id from public.organization_members where organization_id = owner_org_id and role in ('owner','manager','operator')))
);

-- EQUIPMENT AVAILABILITY
create policy "Anyone can view equipment availability" on public.equipment_availability for select using (true);
create policy "Owners/Managers can insert equipment availability" on public.equipment_availability for insert with check (
  requesting_user_id() in (select owner_user_id from public.equipment where id = equipment_id and ownership_type = 'user') OR
  requesting_user_id() in (select m.user_id from public.equipment e join public.organization_members m on e.owner_org_id = m.organization_id where e.id = equipment_id and e.ownership_type = 'organization' and m.role in ('owner','manager','operator'))
);
create policy "Owners/Managers can update equipment availability" on public.equipment_availability for update using (
  requesting_user_id() in (select owner_user_id from public.equipment where id = equipment_id and ownership_type = 'user') OR
  requesting_user_id() in (select m.user_id from public.equipment e join public.organization_members m on e.owner_org_id = m.organization_id where e.id = equipment_id and e.ownership_type = 'organization' and m.role in ('owner','manager','operator'))
);
create policy "Owners/Managers can delete equipment availability" on public.equipment_availability for delete using (
  requesting_user_id() in (select owner_user_id from public.equipment where id = equipment_id and ownership_type = 'user') OR
  requesting_user_id() in (select m.user_id from public.equipment e join public.organization_members m on e.owner_org_id = m.organization_id where e.id = equipment_id and e.ownership_type = 'organization' and m.role in ('owner','manager','operator'))
);

-- PROJECTS
create policy "Users can view own and org projects" on public.projects for select using (
  (
    requesting_user_id() = user_id OR
    (organization_id IS NOT NULL AND requesting_user_id() in (select user_id from public.organization_members where organization_id = projects.organization_id))
  )
  AND deleted_at is null
);
create policy "Users can insert own projects" on public.projects for insert with check (requesting_user_id() = user_id);
create policy "Users can update own projects" on public.projects for update using (requesting_user_id() = user_id);

-- BIDS
create policy "Anyone connected to project can view bids" on public.bids for select using (
  requesting_user_id() = bidder_id OR 
  requesting_user_id() in (select user_id from public.projects where id = project_id) OR
  requesting_user_id() in (select m.user_id from public.projects p join public.organization_members m on p.organization_id = m.organization_id where p.id = project_id)
);
create policy "Providers can insert bids" on public.bids for insert with check (requesting_user_id() = bidder_id);
create policy "Providers can update own bids" on public.bids for update using (requesting_user_id() = bidder_id);

-- Notice: Status transitions should be enforced via a SECURITY DEFINER function rather than raw RLS
-- to prevent project owners from arbitrarily updating the bid_amount or message of another user.

-- RENTALS
create policy "Renter and Owner can view rental" on public.rentals for select using (
  requesting_user_id() = renter_id OR 
  requesting_user_id() = owner_user_id OR
  (owner_org_id IS NOT NULL AND requesting_user_id() in (select user_id from public.organization_members where organization_id = owner_org_id))
);
create policy "Renters can insert rentals" on public.rentals for insert with check (requesting_user_id() = renter_id);

-- REVIEWS
create policy "Anyone can view reviews" on public.reviews for select using (true);
create policy "Participants can insert review" on public.reviews for insert with check (
  requesting_user_id() = reviewer_id AND (
    requesting_user_id() in (select renter_id from public.rentals where id = rental_id) OR
    requesting_user_id() in (select owner_user_id from public.rentals where id = rental_id) OR
    requesting_user_id() in (select m.user_id from public.rentals r join public.organization_members m on r.owner_org_id = m.organization_id where r.id = rental_id)
  )
);

-- PAYMENTS
create policy "Renter and Owner can view payment" on public.payments for select using (
  requesting_user_id() in (select renter_id from public.rentals where id = rental_id) OR
  requesting_user_id() in (select owner_user_id from public.rentals where id = rental_id) OR
  requesting_user_id() in (select m.user_id from public.rentals r join public.organization_members m on r.owner_org_id = m.organization_id where r.id = rental_id)
);
-- Notice: Insert and Update policies omitted for payments so only the server can modify payment statuses
create policy "Deny client insert on payments" on public.payments for insert with check (false);
create policy "Deny client update on payments" on public.payments for update using (false);

-- MEDIA
create policy "Users can view relevant media" on public.media for select using (
  requesting_user_id() = user_id OR 
  requesting_user_id() in (select user_id from public.projects where id = project_id) OR
  requesting_user_id() in (select m.user_id from public.projects p join public.organization_members m on p.organization_id = m.organization_id where p.id = project_id)
);
create policy "Users can insert media" on public.media for insert with check (requesting_user_id() = user_id);

-- AI JOBS & ESTIMATIONS
create policy "Users can view own AI jobs" on public.ai_jobs for select using (requesting_user_id() = user_id);
create policy "Users can view own estimations" on public.ai_estimations for select using (
  requesting_user_id() in (select user_id from public.projects where id = project_id) OR
  requesting_user_id() in (
    select m.user_id from public.projects p 
    join public.organization_members m on p.organization_id = m.organization_id 
    where p.id = project_id
  )
);

-- USER ACTIVITY & MEMORY
create policy "Users can view own activity" on public.user_activity for select using (requesting_user_id() = user_id);
create policy "Users manage own activity (insert)" on public.user_activity for insert with check (requesting_user_id() = user_id);
create policy "Users manage own activity (update)" on public.user_activity for update using (requesting_user_id() = user_id);
create policy "Users manage own activity (delete)" on public.user_activity for delete using (requesting_user_id() = user_id);

create policy "Users can view own AI memory" on public.ai_user_memory for select using (requesting_user_id() = user_id);
create policy "Users manage own AI memory (insert)" on public.ai_user_memory for insert with check (requesting_user_id() = user_id);
create policy "Users manage own AI memory (update)" on public.ai_user_memory for update using (requesting_user_id() = user_id);
create policy "Users manage own AI memory (delete)" on public.ai_user_memory for delete using (requesting_user_id() = user_id);

-- NOTIFICATIONS & STORAGE
create policy "Users can view own notifications" on public.notifications for select using (requesting_user_id() = user_id);
create policy "Users can update (read) own notifications" on public.notifications for update using (requesting_user_id() = user_id);
create policy "Deny client insert on notifications" on public.notifications for insert with check (false);

create policy "Users can view own storage" on public.storage_usage for select using (requesting_user_id() = user_id);

-- BACKEND-ONLY DEFINITIONS (DENY ALL TO CLIENT)
create policy "Deny all client access to vector_index" on public.vector_index for all using (false);
create policy "Deny all client access to audit_logs" on public.audit_logs for all using (false);
create policy "Admin only for admin_actions" on public.admin_actions for all using (requesting_user_id() in (select id from public.profiles where role = 'admin')) with check (requesting_user_id() in (select id from public.profiles where role = 'admin'));

-- ==========================================
-- REMOTE PROCEDURE CALLS (RPC)
-- ==========================================

-- Securely accept a bid and transition its state
create or replace function public.accept_bid(bid_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_project_id uuid;
  v_bidder_id text;
  v_equipment_id uuid;
  v_project_owner text;
  v_project_org uuid;
  v_caller text;
  v_is_authorized boolean := false;
  v_rental_id uuid;
begin
  v_caller := requesting_user_id();
  
  -- Get bid details
  select project_id, bidder_id, equipment_id into v_project_id, v_bidder_id, v_equipment_id
  from public.bids where id = bid_id;
  
  if not found then
    return json_build_object('success', false, 'error', 'Bid not found');
  end if;

  -- Get project owner
  select user_id, organization_id into v_project_owner, v_project_org
  from public.projects where id = v_project_id;

  -- Check if caller is the project owner OR a manager/owner of the project's org
  if v_caller = v_project_owner then
    v_is_authorized := true;
  elsif v_project_org is not null then
    if exists (
      select 1 from public.organization_members 
      where organization_id = v_project_org and user_id = v_caller and role in ('owner', 'manager')
    ) then
      v_is_authorized := true;
    end if;
  end if;

  if not v_is_authorized then
    return json_build_object('success', false, 'error', 'Unauthorized to accept this bid');
  end if;

  -- 1. Update the accepted bid
  update public.bids set status = 'accepted' where id = bid_id;
  
  -- 2. Reject all other pending bids for this project
  update public.bids set status = 'rejected' where project_id = v_project_id and id != bid_id and status = 'pending';

  -- 3. Return success
  return json_build_object('success', true, 'message', 'Bid accepted successfully');
end;
$$;
