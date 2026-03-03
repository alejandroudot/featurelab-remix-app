# FeatureLab

Plataforma fullstack para planificar, ejecutar y monitorear trabajo de producto.
Enfoque principal: `Tasks` colaborativas + `Feature Flags` para lanzar con control.

Nota: el modulo de billing/planes de este proyecto es didactico.
Se implementa para aprender integracion de pagos, roles y limites de producto,
no como modelo comercial real.

## 🏗️ Arquitectura

Se usa un enfoque pragmatico de:
- base de Hexagonal / Clean Architecture;
- arquitectura por capas;
- organizacion por feature;
- puertos/adaptadores en dominio-infra.
- principios SOLID aplicados de forma practica.

No se busca pureza academica extrema: se aplica Hexagonal/Clean de forma pragmatica,
priorizando claridad operativa y velocidad de iteracion para un proyecto de estudio real.

## 🔎 Quick View

- `Tasks-first`: trabajo diario y colaborativo como eje del producto.
- `Workspace`: home operativa con proyectos y tareas.
- `Feature Flags`: control de release por entorno, toggles admin y rollout.
- `User Panel`: perfil, seguridad y plan (v1 actual).
- Escalabilidad progresiva: estado cliente avanzado, integraciones y CI/CD.

Patron general del repo:

- `features/*` (UI de feature): interfaz especifica de dominio (`tasks`, `flags`, etc.), con paginas, formularios, listas/boards y componentes no compartidos.
- `ui/*`: componentes base reutilizables (primitivos/patrones de interfaz).
- `routes/*`: orquestacion HTTP request/response.
- `server/*`: logica de negocio server-side (loaders/actions reutilizables).
- `core/*`: contratos de dominio (schemas, ports, tipos).
- `infra/*`: persistencia e integraciones externas.

Regla operativa actual:
- rutas de pantalla con `loader` fino;
- mutaciones por endpoints `/api/*` por accion;
- logica de negocio concentrada en `app/server/*`.

## 📌 Estado

- `✅ Implementado`: disponible hoy en el repo.
- `🟡 Planeado`: definido en roadmap, todavia no implementado completo.

## ✅ Funcionalidades

- ✅ Autenticacion con sesiones y control por rol (`user`, `admin`).
- ✅ Gestion de tasks base:
  - create/update/delete
  - vista lista + board base
  - detalle en modal con edicion rapida (`status`, `priority`, `assignee`)
  - orden de vista (`manual`/`priority`) y estado persistido en URL (`view`, `order`)
  - acciones destructivas con confirmacion (`AlertDialog`)
  - responsable visible en list y board
- ✅ Gestion de tasks evolucionada:
  - drag and drop horizontal (cambio de estado) y vertical (reorden manual)
  - vistas por alcance de trabajo (`Todas`, `Asignadas`, `Creadas`)
  - permisos de creador/asignado validados en server
  - comentarios, checklist, labels y due date/overdue
  - historial de cambios y notificaciones in-app (header)
  - editor rich text (Lexical) en descripcion/comentarios/create
  - menciones `@usuario` + imagen embebida (boton y copy/paste) + cleanup de temporales
- ✅ Gestion de feature flags:
  - create/toggle/delete/update rollout
  - panel de administracion en `/flags` (admin)
- ✅ Home (`Workspace`) centrada en proyectos y tareas.
- ✅ Estado global de UI en uso:
  - Zustand en `project/task` (filtros de vista, modal de task, estado de workspace)
  - persistencia local para notificaciones vistas por usuario

### 🟡 Lo que sigue (Roadmap)

- Teams + Manager:
  - creacion y administracion de equipos
  - invitaciones in-app por email exacto (aceptar/rechazar)
  - miembros `accepted` como base para asignaciones
- Permisos por proyecto (ACL v1):
  - roles `viewer | member | full` por proyecto
  - validacion server-side en actions/loaders
- Billing didactico (Stripe):
  - upgrade de plan y capacidades ligadas al plan (`free` -> `pro/manager`)
  - webhooks + persistencia de suscripcion
- Escala cliente:
  - migracion de mutaciones/lecturas a React Query full por dominio
  - invalidaciones selectivas y estado global de UI sin prop drilling
- Integraciones externas:
  - Slack (notificaciones operativas)
  - Gemini (asistencia para tasks)
- Calidad tecnica:
  - base de tests unit/integration/e2e
  - CI/CD con GitHub Actions y checks obligatorios

## 🧭 Vistas del producto (target)

- `/` `Workspace` (Projects + Tasks)
- `/flags` `Feature Flags`
- `/account` o `/settings` `User Panel`
- Billing dentro de User Panel (inicialmente)
- Auth en `app/routes/auth/*`

Decisiones clave:

- Validacion centralizada con Zod.
- Contrato de error consistente en actions (`fieldErrors`, `formError`, `values`).
- Separacion clara entre dominio, infraestructura y UI.
- Feature flags integradas al flujo de producto.
- Enfoque hexagonal/clean (simple): `core` define contratos y `infra` implementa.
- SOLID pragmatico: SRP por capa/feature, DIP con puertos en `core` e implementaciones en `infra`.

## 🧰 Stack

- En uso hoy:
  - React Router v7 (framework mode)
  - React 19 + TypeScript
  - Drizzle ORM + better-sqlite3
  - Zod validation
  - Zustand (estado global de UI en workspace)
  - Lexical (rich text editor)
  - Tailwind CSS v4
  - shadcn/ui (componentes de producto por defecto)
  - Radix UI primitives (comportamiento custom/accesible)
- Planeado / adopcion progresiva:
  - TanStack Query (cache, invalidacion, optimistic updates)
  - Vitest + Testing Library (unit/integration)
  - Playwright (E2E)
  - Stripe API + webhooks
  - Slack API / Incoming Webhooks
  - Gemini API
  - GitHub Actions (CI/CD)

## 🎨 Criterio UI (shadcn/ui + Radix)

- Usar `shadcn/ui` como opcion por defecto para interfaz y layout.
- Usar `Radix` directo para comportamiento avanzado/composicion custom.
- Mantener consistencia visual entre Workspace, Tasks, Flags y User Panel.

## 🚀 Run Locally

Requirements:

- Node.js 20+
- npm

Install and run:

```bash
npm install
npm run dev
```

App runs at:

- http://localhost:5173

## 🛠️ Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run format
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## 🗂️ Estructura del proyecto

```text
app/
  core/        # Dominio: tipos, schemas, puertos
  infra/       # Repositorios, db adapters, servicios externos
  server/      # Logica de negocio server-side
  features/    # UI + actions por feature
  routes/      # entrypoints HTTP (loader/action)
  ui/          # componentes compartidos
docs/          # estrategia de producto, roadmap, arquitectura
```

## 📚 Documentacion

- Roadmap principal: `docs/PRODUCT_ROADMAP.md`
- Vision de producto: `docs/PRODUCT.md`
- Arquitectura: `docs/ARQUITECTURE.md`
- Stack y decisiones tecnicas: `docs/stack.md`
