-- All tables have RLS and allow access to all authenticated users

alter table public.entradas
enable row level security;

create policy "Allow access to authenticated users"
  on entradas
  for all
  to authenticated
  using (true);

alter table public.alumnos
enable row level security;

create policy "Allow access to authenticated users"
  on alumnos
  for all
  to authenticated
  using (true);

alter table public.grupos
enable row level security;

create policy "Allow access to authenticated users"
  on grupos
  for all
  to authenticated
  using (true);

alter table public.funciones
enable row level security;

create policy "Allow access to authenticated users"
  on funciones
  for all
  to authenticated
  using (true);

alter table public.email_templates
enable row level security;

create policy "Allow access to authenticated users"
  on email_templates
  for all
  to authenticated
  using (true);

alter table public.historial_cambios
enable row level security;

create policy "Allow access to authenticated users"
  on historial_cambios
  for all
  to authenticated
  using (true);
