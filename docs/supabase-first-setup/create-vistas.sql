CREATE OR REPLACE VIEW public.vista_entradas
WITH (security_invoker = on) AS
select
  e.id as id,
  e.nombre_comprador as nombre_comprador,
  e.email_comprador as email_comprador,
  e.cantidad as compradas,
  e.cantidad_usada as usadas,
  e.created_at as creada,
  a.id as id_alumno,
  a.nombre as nombre_alumno,
  g.id as id_grupo,
  g.nombre_corto as nombre_grupo,
  f.nombre_funcion as funcion,
  g.year as anio,
  f.orden as orden_funcion,
  g.orden as orden_grupo
from
  entradas e
join
  alumnos a on e.id_alumno = a.id
join
  grupos g on a.grupo = g.id
left outer join
  funciones f on g.year = f.year and g.nombre_funcion = f.nombre_funcion;

CREATE OR REPLACE VIEW public.vista_alumnos
WITH (security_invoker = on) AS
select
  a.id as id_alumno,
  a.nombre as nombre_alumno,
  a.created_at as creado,
  g.id as id_grupo,
  g.nombre_corto as nombre_grupo,
  g.year as anio,
  g.nombre_funcion as funcion
from
  alumnos a
join
  grupos g on a.grupo = g.id;
