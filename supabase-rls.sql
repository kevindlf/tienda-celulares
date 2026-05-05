-- ============================================================
-- SUPABASE ROW LEVEL SECURITY — TechPhone Store
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================
-- CONTEXTO: El backend usa Spring Boot con JDBC conectado como
-- el rol "postgres" (superuser). RLS aquí protege contra acceso
-- directo a la API REST de Supabase (PostgREST) con la anon key,
-- bloqueando que alguien lea o escriba la BD sin pasar por el backend.
-- ============================================================

-- 1. ACTIVAR RLS EN TODAS LAS TABLAS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_tienda ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. POLÍTICAS PARA EL ROL "postgres" (backend Spring Boot)
-- El backend se conecta como postgres → acceso total
-- ============================================================

-- usuarios
CREATE POLICY "backend_full_usuarios" ON usuarios
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- productos
CREATE POLICY "backend_full_productos" ON productos
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- ordenes
CREATE POLICY "backend_full_ordenes" ON ordenes
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- orden_items
CREATE POLICY "backend_full_orden_items" ON orden_items
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- configuracion_tienda
CREATE POLICY "backend_full_configuracion" ON configuracion_tienda
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- ============================================================
-- 3. POLÍTICAS PARA EL ROL "anon" (API pública de Supabase)
-- Bloquear todo acceso directo a la API REST sin pasar por el backend
-- ============================================================

-- productos: solo lectura de productos activos (catálogo público)
CREATE POLICY "anon_read_productos_activos" ON productos
  FOR SELECT TO anon USING (activo = true);

-- configuracion_tienda: solo lectura
CREATE POLICY "anon_read_configuracion" ON configuracion_tienda
  FOR SELECT TO anon USING (true);

-- usuarios: SIN ACCESO (ningún rol anónimo puede ver usuarios)
-- (no se crea política → RLS bloquea por defecto)

-- ordenes: SIN ACCESO directo
-- (no se crea política → RLS bloquea por defecto)

-- orden_items: SIN ACCESO directo
-- (no se crea política → RLS bloquea por defecto)

-- ============================================================
-- 4. VERIFICACIÓN — correr después de aplicar las políticas
-- ============================================================
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Verificar que rowsecurity = true en todas las tablas

SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
-- Verificar que las políticas existen
