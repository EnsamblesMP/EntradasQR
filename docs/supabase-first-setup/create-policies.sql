-- Allow access to all authenticated users
create policy "Allow access to authenticated users"
  on entradas
  for all
  to authenticated
  using (true);

create policy "Allow access to authenticated users"
  on alumnos
  for all
  to authenticated
  using (true);

create policy "Allow access to authenticated users"
  on grupos
  for all
  to authenticated
  using (true);

create policy "Allow access to authenticated users"
  on funciones
  for all
  to authenticated
  using (true);

create policy "Allow access to authenticated users"
  on email_templates
  for all
  to authenticated
  using (true);
