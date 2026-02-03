# Supabase Setup for StudyLo

## Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Pick an organization, name (e.g. `studylo`), database password, and region.
4. Wait for the project to be ready.

## Step 2: Get your API keys

1. In the project dashboard, go to **Settings** → **API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Environment variables

Create `.env.local` in the project root (same folder as `package.json`) with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace with your actual Project URL and anon key.  
Do not commit `.env.local`; it’s already in `.gitignore`.

## Step 4: Enable Email auth (optional: Magic Link, etc.)

1. In the dashboard, go to **Authentication** → **Providers**.
2. **Email** is enabled by default (sign up with email + password).
3. Optionally enable **Email OTP** (magic link) or other providers (Google, GitHub, etc.).

## Step 5: Configure auth redirect URLs (for OAuth / email redirects)

1. In the Supabase dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to `http://localhost:3000` (or your production URL).
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - Add your production URL when you deploy (e.g. `https://yourdomain.com/auth/callback`).
4. Save. Without this, email confirmation and OAuth redirects will fail.

## Step 6: Database tables for app data (required for dashboard / my study sets)

Use **Table Editor** or **SQL Editor** to create tables. Run the full block below.

```sql
-- Profiles (display name, study stats – all start at 0)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  quizzes_done int not null default 0,
  day_streak int not null default 0,
  last_streak_date date,  -- last calendar day we counted for streak (UTC)
  updated_at timestamptz default now()
);

-- Study sets (user-created; card_count used for “flashcards” stat)
create table public.study_sets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  subject text,
  card_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.study_sets enable row level security;

create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can manage own study sets"
  on public.study_sets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

Run this in the SQL Editor. The dashboard and My Study Sets pages use these tables; stats start at 0 and update as users create study sets and (later) complete quizzes.

**If you already have a `profiles` table**, add the streak date column:

```sql
alter table public.profiles add column if not exists last_streak_date date;
```

## Summary

- **Auth**: Email/password sign up & login, with optional OAuth/magic link.
- **Data**: Use `createClient()` from `lib/supabase/client` (client) or `lib/supabase/server` (server) to query Supabase. RLS keeps data scoped per user.

For more details, see [Supabase Auth](https://supabase.com/docs/guides/auth) and [Supabase with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs).
