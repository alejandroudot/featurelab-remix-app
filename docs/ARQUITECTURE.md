# 🏗️ Arquitectura del Sistema – FeatureLab

Este documento define la arquitectura técnica, la organización del código y la estrategia de datos de **FeatureLab**.

## 🧩 Stack Tecnológico

Elegimos un stack moderno enfocado en **tipado estático**, **performance** y **experiencia de desarrollador (DX)**.

### Core & Fullstack

- **Framework:** React Router v7 (modo fullstack).
- **Lenguaje:** TypeScript (estricto).
- **Estilos:** TailwindCSS + Shadcn/ui (componentes accesibles).
- **Validación:** Zod (para esquemas de dominio y API).
- **Estado UI:** React Hooks / URL state (priorizamos la URL como fuente de verdad).

### Datos & Infraestructura

- **ORM:** Drizzle ORM.
- **Base de Datos (Local):** SQLite (archivo `local.db` para desarrollo rápido).
- **Base de Datos (Cloud):** PostgreSQL (via Supabase).
- **Autenticación:**
  - _Fase 1 (MVP):_ Manual (Cookies + Bcrypt).
  - _Fase 2:_ Supabase Auth / OAuth.

---

## 🏛️ Filosofía: Hexagonal + Clean Architecture

La arquitectura sigue un enfoque híbrido de **Hexagonal (Ports & Adapters)** y **Clean Architecture**.

### 🎯 Objetivo de este diseño

1.  **Aislamiento:** El dominio (reglas de negocio) no debe saber que existe una base de datos, ni que usamos React, ni que corremos en Vercel.
2.  **Testabilidad:** Poder testear la lógica de negocio sin levantar un servidor ni una DB real.
3.  **Evolución a Microservicios:** El diseño por features (`tasks`, `flags`, `auth`) con sus propios puertos y adaptadores permite que, **si en el futuro la escala lo requiere**, se pueda extraer un módulo entero (ej: `app/core/billing`) y convertirlo en un microservicio separado sin tener que reescribir la lógica interna.

### 🔄 Reglas de Dependencia (Mental Model)

> **Dominio en el centro → Infraestructura alrededor → Rutas como borde HTTP → UI encima de todo.**

1.  `app/core` **(Dominio)**: No depende de NADIE. Solo de librerías puras (ej: Zod).
2.  `app/infra` **(Infraestructura)**: Depende de `core` (implementa sus interfaces). No depende de `ui` ni `features`.
3.  `app/features` **(UI de Negocio)**: Depende de `core` (usa tipos) y compone componentes de `ui`.
4.  `app/ui` **(Design System)**: No sabe NADA del negocio. Es pura UI visual agnóstica.
5.  `app/routes` **(Controladores)**: Es el "pegamento". Conecta el pedido HTTP con el repositorio (`infra`) y devuelve la vista (`features`).

---

## 📂 Estructura de Capas Lógicas

Desglosamos la aplicación en 4 capas claras:

### 1. Dominio (`app/core`)

- **Responsabilidad:** Reglas de negocio puras, tipos, esquemas validación y definición de contratos (interfaces).
- **Contenido:** `Task` type, `TaskRepository` interface, `FeatureFlag` logic.
- **Contexto:** Aquí vive la "verdad" del negocio.

### 2. Infraestructura (`app/infra`)

- **Responsabilidad:** Implementación concreta de los contratos del dominio. Hablar con el "mundo exterior" (DBs, APIs).
- **Contenido:** `DrizzleTaskRepository`, `StripeService`, `SupabaseClient`.
- **Contexto:** Aquí es donde ensuciamos las manos con SQL o fetch calls.

### 3. UI Genérica (`app/ui`)

- **Responsabilidad:** Design System. Componentes visuales reutilizables y consistentes.
- **Contenido:** `Button`, `Card`, `Modal`, `Input`.
- **Contexto:** Si copiamos esta carpeta a otro proyecto, debería funcionar igual. No contiene lógica de "Tareas" o "Usuarios".

### 4. UI de Feature & Rutas (`app/features` y `app/routes`)

- **Features (`app/features`):** Componentes "inteligentes" que conocen el dominio.
  - Ej: `TaskList` (sabe iterar tareas), `FlagToggle` (sabe llamar una action).
- **Rutas (`app/routes`):** Controladores Fullstack.
  - Reciben Request -> Llaman Repositorio -> Retornan JSON/HTML.

---

## 📂 Estructura de Carpetas

```text
featurelab/
├── app/
│   ├── core/                       # 🧠 DOMINIO (Reglas de negocio puras)
│   │   ├── auth/                   # Tipos y reglas de Auth
│   │   ├── tasks/                  # Tipos y reglas de Tareas
│   │   ├── flags/                  # Tipos y reglas de Feature Flags
│   │   └── common/                 # Utilidades compartidas (IDs, Results)
│   │
│   ├── infra/                      # 🔌 INFRAESTRUCTURA (Implementaciones)
│   │   ├── db/                     # Configuración Drizzle (Schema, Migrations)
│   │   ├── auth/                   # AuthRepository (DB implementation)
│   │   ├── tasks/                  # TaskRepository (SQLite/Postgres)
│   │   └── flags/                  # FlagRepository
│   │   # v0.2+ (futuro):
│   │   ├── redis/                  # Cache, sesiones, pub/sub
│   │   ├── stripe/                 # Integración Stripe (billing)
│   │   ├── slack/                  # Integración Slack (notificaciones)
│   │   └── ai/                     # Integración AI (Gemini)
│   │
│   ├── ui/                         # 🎨 DESIGN SYSTEM (Componentes visuales)
│   │   ├── primitives/             # Átomos (Button, Input, Badge)
│   │   ├── surfaces/               # Contenedores (Card, Modal, Panel)
│   │   ├── feedback/               # Toasts, Alerts
│   │   ├── overlay/                # Overlays (Modal, Drawer)
│   │   └── form/                   # Formularios (Form, Field, Input)
│   │
│   ├── features/                   # 🧩 UI DE NEGOCIO (Widgets completos)
│   │   ├── layout/                 # Layout general: sidebar, navbar, theme toggle
│   │   ├── auth/                   # Components: LoginForm
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │       └── useAuth.ts
│   │   ├── tasks/                  # Components: TaskList, TaskForm
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │       └── useTasks.ts
│   │   └── flags/                  # Components: FlagToggle, FlagList
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │       └── useFlags.ts
│   │
│   └── routes/                     # 🚦 RUTAS (Controladores Fullstack)
│       ├── _index.tsx              # Home / Dashboard
│       ├── tasks.tsx               # Página de Tareas
│       ├── flags.tsx               # Página de Flags
│       ├── auth.login.tsx          # Login
│       ├── auth.register.tsx       # Register
│       ├── profile.tsx             # Perfil Usuario
│       └── api/                    # (v0.2+) API Endpoints
│           ├── health.tsx
│           ├── tasks.tsx
│           └── webhooks.stripe.tsx
│
├── docs/                           # 📚 Documentación
├── public/                         # Assets estáticos
└── [config files]                  # tsconfig, vite.config, tailwind, etc.
```

---

## UI Decision (FeatureLab / React Router Fullstack)
- We use Radix UI primitives directly (no shadcn/ui).
- Tailwind v4 for styling.
- UI components live in `app/ui/*` as wrappers around Radix.
- CVA + clsx + tailwind-merge for variants and class composition.
- Shadcn/ui is NOT used in this repo.

## 💾 Modelo de Datos (Esquema Conceptual)

Este esquema se implementa con **Drizzle ORM**.

### 1. Users (`users`)

- `id`: UUID
- `email`: string (unique)
- `password_hash`: string
- `created_at`: timestamp

### 2. Tasks (`tasks`)

- `id`: UUID
- `user_id`: FK -> users.id
- `title`: string
- `status`: enum (`todo`, `in_progress`, `done`)
- `priority`: enum (`low`, `medium`, `high`)

### 3. Feature Flags (`feature_flags`)

- `id`: UUID
- `user_id`: FK -> users.id
- `key`: string (ej: "new-dashboard")
- `is_enabled`: boolean
- `environment`: enum (`dev`, `prod`)

> **Lógica de Flags:**
> Un flag es único por combinación de `user_id` + `key` + `environment`.
> Esto permite que un usuario tenga la feature `dark-mode` activada en `dev` para probarla, pero desactivada en `prod`.
> El repositorio debe permitir consultar `getFlag(user, key, env)`.

---

---

## 🌐 Roadmap v0.2 – Internacionalización (i18n)

En una versión posterior (v0.2), se plantea añadir soporte multi-idioma:

- Soporte para `en` / `es` en la UI (textos principales).
- Implementación de `app/i18n` con:
  - diccionarios de mensajes,
  - `I18nProvider`,
  - hook `useI18n`.
- Selección de idioma por:
  - query param (`?lang=en|es`),
  - y/o toggle en la interfaz.
- Ajuste dinámico de `<html lang={locale}>` para accesibilidad y SEO.

Esto permite presentar el proyecto en inglés (CV / LinkedIn / portfolio) manteniendo soporte completo para español.

---

## 📌 Rutas API (v0.2+)

- v0.1: solo rutas página (UI + loader/action).
- v0.2+: agregar 1–2 rutas tipo API-only en `app/routes/api/*`:
  - `/api/health` (healthcheck JSON).
  - `/api/webhooks/stripe` (ejemplo de integración externa).
  - (opcional) `/api/flags/:key` para exponer feature flags a otros clientes.

---

## 🌍 Estrategia de datos y entornos tipo "prod → prepro → local"

### 🗄️ Bases de datos

- **Prod**: Supabase Postgres (datos reales).
- **Prepro/Staging**: copia anonimizada de prod
  - Job (cron/CI) que:
    - hace dump de la DB de prod,
    - anonimiza datos sensibles (emails, nombres, etc.),
    - restaura el dump en la base de prepro/staging.

- **Local**:
  - Opción A: React Router dev apuntando a la DB de prepro/staging (como en la empresa anterior).
  - Opción B: SQLite local (`featurelab.db`) + seeds (`npm run seed`) para datos de prueba rápidos y seguros.

### ☁️ App en la nube (Vercel)

- **Production**:
  - Deploy de la rama `main`.
  - URL tipo: `https://featurelab.vercel.app`.
  - Env vars apuntan a la DB de **prod**:
    - `DB_PROVIDER=supabase`
    - `SUPABASE_DB_URL=postgres://...prod...`

- **Prepro / Staging**:
  - Deploys de:
    - una rama fija `staging`, **o**
    - preview deployments de ramas de feature/release.

  - URLs tipo: `https://featurelab-git-staging-....vercel.app`.
  - Env vars apuntan a la DB de **prepro/staging**:
    - `DB_PROVIDER=supabase`
    - `SUPABASE_DB_URL=postgres://...staging...`

- **Local (development)**:
  - `npm run dev` en la máquina local.
  - Env vars pueden apuntar a:
    - `DB_PROVIDER=sqlite` (SQLite local para desarrollo rápido), **o**
    - `DB_PROVIDER=supabase` + `SUPABASE_DB_URL=postgres://...dev/prepro...` para trabajar contra una DB remota similar a prod.
