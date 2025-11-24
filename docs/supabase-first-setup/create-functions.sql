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

create or replace function registrar_historial_cambio()
returns trigger
set search_path = public
language plpgsql
as $$
declare
    campos_trackear text[];
    campo text;
    val_old jsonb;
    val_new jsonb;
    contexto_data jsonb;
begin
    -- Configuración por tabla
    CASE TG_TABLE_NAME
        WHEN 'entradas' THEN
            campos_trackear := ARRAY['cantidad', 'cantidad_usada', 'nombre_comprador', 'email_comprador', 'id_alumno'];
            contexto_data := jsonb_build_object(
                'comprador', COALESCE(NEW.nombre_comprador, OLD.nombre_comprador)
            );
        WHEN 'alumnos' THEN
            campos_trackear := ARRAY['nombre', 'grupo'];
            contexto_data := jsonb_build_object(
                'nombre', COALESCE(NEW.nombre, OLD.nombre),
                'grupo', COALESCE(NEW.grupo, OLD.grupo)
            );
        ELSE
            RETURN COALESCE(NEW, OLD);  -- No hacer nada para otras tablas
    END CASE;
    
    -- Trackear cambios en campos especificados
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        FOREACH campo IN ARRAY campos_trackear LOOP
            EXECUTE format('SELECT to_jsonb($1.%I), to_jsonb($2.%I)', campo, campo)
            INTO val_old, val_new
            USING OLD, NEW;
            
            -- Solo insertar si cambió (o si es DELETE)
            IF val_old IS DISTINCT FROM val_new OR TG_OP = 'DELETE' THEN
                INSERT INTO historial_cambios (
                    tabla, id_registro, campo, 
                    valor_anterior, valor_nuevo, contexto_registro,
                    operacion, email_usuario
                ) VALUES (
                    TG_TABLE_NAME,
                    COALESCE(NEW.id, OLD.id),
                    campo,
                    val_old,
                    val_new,
                    contexto_data,
                    TG_OP,
                    (auth.jwt() ->> 'email')::text
                );
            END IF;
        END LOOP;
    END IF;
    
    -- Para INSERT, guardar valores iniciales
    IF TG_OP = 'INSERT' THEN
        FOREACH campo IN ARRAY campos_trackear LOOP
            EXECUTE format('SELECT to_jsonb($1.%I)', campo)
            INTO val_new
            USING NEW;
            
            INSERT INTO historial_cambios (
                tabla, id_registro, campo,
                valor_anterior, valor_nuevo, contexto_registro,
                operacion, email_usuario
            ) VALUES (
                TG_TABLE_NAME,
                NEW.id,
                campo,
                NULL,
                val_new,
                contexto_data,
                'INSERT',
                 (auth.jwt() ->> 'email')::text
            );
        END LOOP;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;