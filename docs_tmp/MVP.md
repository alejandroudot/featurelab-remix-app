## 1️⃣ Objetivo del MVP

**FeatureLab v0.1**

> Un workspace simple donde un usuario:
>
> * se autentica
> * crea y organiza tasks
> * define feature flags
> * enciende/apaga flags
> * ve qué flags están activos por entorno (ej: `development` / `production`)

Stripe, Slack, Gemini vienen **después**. El MVP es:

* **Tasks** + **Feature Flags** + **Auth básica**
* Persistido con **Drizzle ORM**:

  * **SQLite** en local (desarrollo)
  * **Supabase/Postgres** en cloud (Vercel)
* UI prolija (Tailwind + shadcn)
* Más adelante: tests (dominio, loaders/actions y algún E2E)

---

## 2️⃣ Features del MVP (v0.1)

### 2.1. Auth (básico)

* Registro de usuario (email + password)
* Login / Logout
* Sesión (cookie o mecanismo que provea React Router fullstack)
* `currentUser` disponible en loaders/actions para rutas privadas

🔜 Más adelante:

* Workspaces y roles → no en la v0.1, lo dejamos para v0.2
* Opcional: migrar/complementar con **Supabase Auth** en lugar de auth manual

---

### 2.2. Tasks

Para cada usuario:

* Listar tasks propias
* Crear task con:

  * `title` (obligatorio)
  * `description` (opcional)
  * `status` (`todo`, `in-progress`, `done`)
  * `priority` (`low`, `medium`, `high`)
* Editar `status` y `priority` desde la UI (dropdown / botones)
* Filtrar por `status` (tabs o select)

Ya tenemos `/tasks` in-memory:
→ lo vamos a pasar a **Drizzle + DB real** y a esta estructura de dominio/infra más clara:

* Local: SQLite
* Cloud: Supabase/Postgres

---

### 2.3. Feature Flags

Por usuario (o más adelante por workspace):

* Listar todos los flags
* Crear flag con:

  * `key` (ej: `new-onboarding`, `dark-theme`)
  * `description`
  * `enabled` (boolean)
  * `environment` (`development`, `production`)
* Toggle `enabled` desde la UI
* Mostrar un componente de ejemplo que use un flag:

  * ej: si `dark-theme` está active → UI entra en modo dark

---

### 2.4. UX y base de producto

* Sidebar o navbar con:

  * `Home`
  * `Tasks`
  * `Feature Flags`
  * `Profile / Logout`
* Layout base con Tailwind + algún componente de shadcn (botón, input, card).
* Estado “loading/submitting” en forms (como ya hicimos en `/tasks`), usando `useNavigation`.
* Manejo de errores con el `ErrorBoundary` que ya tenés en `root.tsx`.

---

## 3️⃣ Pantallas / Rutas del MVP

### Rutas públicas

* `/login`

  * Form de email/password
  * Link a `/register`

* `/register`

  * Form de email/password/password confirm
  * Al registrarse → login automático → redirige a `/tasks` o `/`

### Rutas privadas (requieren sesión)

* `/` (home dashboard simple)

  * Bienvenida, quizás un resumen:

    * “Tienes X tasks abiertas”
    * “Tienes Y flags activos”

* `/tasks`

  * Listado de tasks + formulario para crear
  * Filtros por status
  * Posibilidad de cambiar status/priority rápido

* `/flags`

  * Listado de feature flags
  * Form para crear nuevo flag
  * Toggle de `enabled`
  * Pill de entorno (`dev` / `prod`)

* `/profile` (muy simple)

  * email del usuario
  * botón “Logout”

> Seguridad básica:
> loaders/actions de rutas privadas chequean si hay usuario; si no, redirect a `/login`.

---

## 4️⃣ Modelo de datos mínimo (DB v0.1)

Con Drizzle, MVP con 3 tablas.
En local usarán **SQLite**; en cloud, **Supabase/Postgres** con el mismo schema.

### `users`

* `id` (uuid)
* `email` (unique)
* `password_hash` (string)
* `created_at`
* `updated_at`

### `tasks`

* `id` (uuid)
* `user_id` (fk a `users.id`)
* `title`
* `description` (nullable)
* `status` (`todo` | `in-progress` | `done`)
* `priority` (`low` | `medium` | `high`)
* `created_at`
* `updated_at`

### `feature_flags`

* `id` (uuid)
* `user_id` (fk a `users.id`) – en v0.2 puede pasar a `workspace_id`
* `key` (unique por usuario)
* `description` (nullable)
* `environment` (`development` | `production`)
* `enabled` (boolean)
* `created_at`
* `updated_at`

No hace falta hacer más tablas ahora.
Stripe, Slack, AI → todo eso viene después con más tablas y relaciones.

---

## 5️⃣ Entornos y bases de datos

### 5.1. Local Development

* App:

  * React Router fullstack corriendo en WSL (`npm run dev`)
* DB:

  * **SQLite** – archivo local (ej: `featurelab.db`) usando Drizzle ORM
* Uso:

  * desarrollo diario
  * iteración rápida
  * sin depender de servicios externos

### 5.2. Cloud / Preview (Staging)

* App:

  * deploy en **Vercel** (rama `dev` o PRs)
* DB:

  * **Supabase** – proyecto `featurelab-dev` (PostgreSQL gestionado)
* Uso:

  * compartir entorno con otras personas
  * probar la app desde cualquier lugar

### 5.3. Production

* App:

  * deploy en **Vercel** (rama `main`)
* DB:

  * **Supabase** – proyecto `featurelab-prod` (PostgreSQL)
* Uso:

  * versión estable para portfolio / entrevistas

---

## 6️⃣ Fases de persistencia de datos

Para que quede claro qué hicimos y en qué orden (y que no parezca que una cosa “borra” la otra):

### ✅ Fase 1 – Drizzle + SQLite (local)

* Schema en `app/infra/db/schema.ts`
* Cliente SQLite en `app/infra/db/client.sqlite.ts`
* `TaskRepository` usando SQLite:

  * `app/infra/tasks/task.repository.sqlite.ts`
* `FeatureFlagRepository` usando SQLite:

  * `app/infra/flags/flag.repository.sqlite.ts`
* Rutas (`/tasks`, `/flags`) usan esta implementación en local.

### ⏭️ Fase 2 – Drizzle + Supabase/Postgres (cloud)

* Cliente Postgres/Supabase en `app/infra/db/client.supabase.ts`

* `TaskRepository` / `FeatureFlagRepository` versión Postgres:

  * `app/infra/tasks/task.repository.supabase.ts`
  * `app/infra/flags/flag.repository.supabase.ts`

* Selector de repositorio por env var:

  ```ts
  // app/infra/tasks/task.repository.ts
  import { sqliteTaskRepository } from './task.repository.sqlite';
  import { supabaseTaskRepository } from './task.repository.supabase';

  const DB_PROVIDER = process.env.DB_PROVIDER ?? 'sqlite';

  export const taskRepository =
    DB_PROVIDER === 'supabase' ? supabaseTaskRepository : sqliteTaskRepository;
  ```

* Local: `.env` → `DB_PROVIDER=sqlite`

* Cloud (Vercel + Supabase): env var → `DB_PROVIDER=supabase`

### ⏭️ Fase 3 – Supabase Auth (v0.2+)

* Delegar login/register/sesión a **Supabase Auth**.
* Comparar:

  * Auth manual (`users` + `password_hash` + cookies/sesiones)
  * vs Supabase Auth (JWT, RLS, etc.)

---

## 7️⃣ Cómo se mapea a nuestra arquitectura (concreto)

Para el MVP v0.1 vamos a tocar al menos estos módulos:

### 7.1. Dominio (`app/core`)

* `app/core/auth/`

  * `auth.types.ts` → `User`, `UserId`
  * `auth.schema.ts` → `loginSchema`, `registerSchema`
  * (luego) `auth.port.ts` → `AuthService` interface

* `app/core/tasks/`

  * `task.types.ts` → `Task`, `TaskStatus`, `TaskPriority`
  * `task.schema.ts` → `taskCreateSchema`, `taskUpdateSchema`
  * `task.port.ts` → `TaskRepository` (como ya vimos)

* `app/core/flags/`

  * `flag.types.ts` → `FeatureFlag`, `Environment`
  * `flag.schema.ts` → `flagCreateSchema`, `flagUpdateSchema`
  * `flag.port.ts` → `FeatureFlagRepository`

---

### 7.2. Infra (`app/infra`)

* `app/infra/db/`

  * `schema.ts` → tablas `users`, `tasks`, `feature_flags`
  * `client.sqlite.ts` → conexión Drizzle + SQLite (local)
  * `client.supabase.ts` → conexión Drizzle + Supabase/Postgres (cloud)

* `app/infra/auth/`

  * `auth.repository.drizzle.ts` → acceso a `users`
  * helpers para hashing de password, etc.

* `app/infra/tasks/`

  * `task.repository.sqlite.ts` → implementación de `TaskRepository` con SQLite
  * `task.repository.supabase.ts` → implementación con Supabase/Postgres
  * `task.repository.ts` → exporta el repo según `DB_PROVIDER`

* `app/infra/flags/`

  * `flag.repository.sqlite.ts` → implementación de `FeatureFlagRepository` con SQLite
  * `flag.repository.supabase.ts` → implementación con Supabase/Postgres
  * `flag.repository.ts` → exporta el repo según `DB_PROVIDER`

*(El viejo `InMemoryTaskRepository` lo podemos dejar solo para tests/local puntuales si queremos.)*

---

### 7.3. Features (UI) (`app/features`)

* `app/features/auth/`

  * `components/LoginForm.tsx`
  * `components/RegisterForm.tsx`

* `app/features/tasks/`

  * `components/TaskForm.tsx`
  * `components/TaskList.tsx`
  * `components/TaskFilters.tsx`

* `app/features/flags/`

  * `components/FlagForm.tsx`
  * `components/FlagList.tsx`

---

### 7.4. Rutas (`app/routes`)

* `app/routes/_auth.login.tsx` → `/login`
* `app/routes/_auth.register.tsx` → `/register`
* `app/routes/tasks.tsx` → `/tasks` (ahora usando `TaskRepository` con Drizzle)
* `app/routes/flags.tsx` → `/flags`
* `app/routes/profile.tsx` → `/profile`
* `app/routes/_index.tsx` o `home.tsx` → `/`

*(Los nombres exactos los amoldamos a cómo React Router genera los `+types`, pero la idea es esa.)*

---

## 8️⃣ Próximo paso (muy concreto)

Ahora que el MVP está claro y el tema DB/entornos está decidido, el siguiente movimiento lógico es:

👉 **Pasar `/tasks` de in-memory a Drizzle + SQLite**, manteniendo la estructura de dominio/infra que empezamos.

Eso implica:

1. Crear `app/infra/db/schema.ts` con tablas `users` y `tasks` (primero `tasks` sola; `users` la enchufamos después).
2. Crear `app/infra/db/client.sqlite.ts` para la conexión local.
3. Armar `task.repository.sqlite.ts` que implementa `TaskRepository`.
4. Cambiar `inMemoryTaskRepository` por el de Drizzle en el loader/action de `/tasks`.

Y más adelante, repetir el patrón para Supabase/Postgres (Fase 2).
