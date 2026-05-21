-- Perfil do bebê vinculado ao usuário
create table public.baby_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  birth_day integer not null,
  birth_month integer not null,
  birth_year integer not null,
  created_at timestamptz default now()
);

-- Registros de sono
create table public.sleep_records (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  start_time text not null,
  end_time text not null,
  duration integer not null,
  created_at timestamptz default now()
);

-- Registros de alimentação
create table public.feeding_records (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  time text not null,
  type text not null,
  amount text not null,
  created_at timestamptz default now()
);

-- Registros de crescimento
create table public.growth_records (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  weight double precision,
  height double precision,
  created_at timestamptz default now()
);

-- Vacinas aplicadas
create table public.vacinas_aplicadas (
  user_id uuid references auth.users(id) on delete cascade not null,
  vacina_id text not null,
  primary key (user_id, vacina_id)
);

-- RLS: cada usuário acessa só os próprios dados
alter table public.baby_profile      enable row level security;
alter table public.sleep_records     enable row level security;
alter table public.feeding_records   enable row level security;
alter table public.growth_records    enable row level security;
alter table public.vacinas_aplicadas enable row level security;

create policy "own data" on public.baby_profile      for all using (auth.uid() = user_id);
create policy "own data" on public.sleep_records     for all using (auth.uid() = user_id);
create policy "own data" on public.feeding_records   for all using (auth.uid() = user_id);
create policy "own data" on public.growth_records    for all using (auth.uid() = user_id);
create policy "own data" on public.vacinas_aplicadas for all using (auth.uid() = user_id);
