-- Run this in your Supabase SQL editor to set up the database

-- Events table
create table if not exists events (
  id text primary key,
  title text not null,
  type text not null,
  date text not null,
  time text not null,
  location text not null,
  description text,
  host_name text not null,
  created_at timestamp with time zone default now()
);

-- RSVPs table
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id text references events(id) on delete cascade,
  name text not null,
  status text not null check (status in ('going', 'maybe', 'cant')),
  created_at timestamp with time zone default now()
);

-- Allow public read/write (no auth needed for MVP)
alter table events enable row level security;
alter table rsvps enable row level security;

create policy "Anyone can read events" on events for select using (true);
create policy "Anyone can create events" on events for insert with check (true);

create policy "Anyone can read rsvps" on rsvps for select using (true);
create policy "Anyone can create rsvps" on rsvps for insert with check (true);
