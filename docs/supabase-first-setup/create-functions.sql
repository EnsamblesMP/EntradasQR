-- Create RPC to atomically increment cantidad_usada on entradas
create or replace function public.usar_entradas_rpc(p_entrada_id uuid, p_cantidad_a_usar integer)
returns table(id uuid, cantidad_usada integer)
language sql
set search_path = ''
as $$
  update public.entradas
  set cantidad_usada = coalesce(cantidad_usada, 0) + p_cantidad_a_usar
  where id = p_entrada_id
  returning id, cantidad_usada;
$$;

create or replace function public.sync_alumno_year()
returns trigger as $$
begin
  select year into new.year
  from grupos
  where id = new.grupo;
  return new;
end;
$$ language plpgsql;