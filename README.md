# Negocio Nicole

Base profesional para una tienda e-commerce con `Next.js 16`, `TypeScript`, `Tailwind CSS`, `Supabase`, `Flow` y `Resend`.

Esta primera entrega deja lista la base real del proyecto:

- Arquitectura pública y administrativa separada.
- Login administrativo solo con contraseña.
- Sesión segura con cookie `HTTP-only` firmada.
- Modelo de datos completo en Supabase.
- Políticas `RLS` y buckets de Storage.
- Lectura real de configuración, categorías y productos desde Supabase.
- Estados vacíos profesionales cuando aún no existen datos.

## Stack

- `Next.js 16` con `App Router`
- `TypeScript`
- `Tailwind CSS v4`
- `@supabase/supabase-js`
- `@supabase/ssr`
- `Zod`
- `React Hook Form`

## Estructura

```txt
src/
  app/
    (store)/
    admin/
  components/
    admin/
    shared/
    store/
    ui/
  lib/
    auth/
    flow/
    resend/
    security/
    supabase/
    validation/
  services/
  types/
emails/
supabase/
  functions/
  migrations/
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
cp .env.example .env.local
```

Variables obligatorias para esta etapa:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_SESSION_SECRET`

## Supabase

### 1. Crear proyecto

1. Crea un proyecto en Supabase.
2. Copia la URL del proyecto y las keys `anon` y `service_role`.
3. Completa `.env.local`.

### 2. Ejecutar migraciones

Aplica, en este orden:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_and_storage.sql`

Puedes ejecutarlas desde el editor SQL de Supabase o usando Supabase CLI.

### 3. Crear administrador

1. En `Authentication > Users`, crea un usuario con el correo definido en `ADMIN_EMAIL`.
2. Define la contraseña que usarás para ingresar al panel.
3. Obtén el `uuid` del usuario creado.
4. Inserta el rol:

```sql
insert into public.admin_roles (user_id, role, is_active)
values ('TU-USER-ID', 'admin', true)
on conflict (user_id) do update
set role = excluded.role,
    is_active = excluded.is_active;
```

El frontend nunca muestra el correo del administrador; solo solicita la contraseña y el servidor autentica con `ADMIN_EMAIL`.

## Desarrollo local

Instala dependencias y levanta el proyecto:

```bash
npm install
npm run dev
```

Rutas importantes:

- `/`
- `/productos`
- `/productos/[slug]`
- `/categorias/[slug]`
- `/admin/login`
- `/admin`

## Seguridad implementada en esta etapa

- Variables sensibles solo en servidor.
- Login admin usando `Supabase Auth`.
- Cookie admin firmada y `HTTP-only`.
- Rate limiting base para login.
- `proxy.ts` protegiendo `/admin`.
- Verificación adicional del rol admin en servidor.
- `RLS` para tablas sensibles.
- Policies de Storage para imágenes.
- Headers de seguridad en `next.config.ts`.

## Estado actual

Ya está hecho:

- Layout público y admin separados.
- Home pública conectada a Supabase cuando existe configuración.
- Lectura real de productos y categorías activas.
- Estados vacíos sin datos simulados.
- Panel admin con acceso protegido.
- Migraciones completas de dominio.

Pendiente para siguientes etapas:

- CRUD visual de productos y categorías.
- Upload de imágenes a Supabase Storage.
- Carrito persistente.
- Checkout multi-step.
- Validación de RUT.
- Despacho dinámico.
- Integración real con Flow.
- Correos con Resend.
- Dashboard con métricas reales.

## Comandos útiles

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Notas

- No se agregan datos ficticios a la base.
- Si no existen productos o categorías activas, la UI muestra estados vacíos profesionales.
- La integración de Flow y Resend ya tiene carpetas y separación de capas listas para implementarse en la siguiente etapa.
