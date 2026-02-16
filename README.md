# FeatureLab

FeatureLab es una plataforma fullstack para planificar, ejecutar y monitorear trabajo de producto.
El foco principal es `Tasks` con colaboración entre usuarios, usando `Feature Flags` como capa de control para activar o desactivar funcionalidades de forma gradual.

## Propuesta del producto

- `Tasks-first`: el núcleo es la gestión de trabajo diario y colaborativo.
- `Execution Hub`: home operativa con métricas, actividad reciente y acciones rápidas.
- `Feature Flags`: control de release por entorno, toggles admin y rollout progresivo.
- `User Panel`: perfil, seguridad, preferencias y plan.
- `Escalabilidad progresiva`: estado cliente avanzado, integraciones externas y CI/CD.

## Funcionalidades principales (target final)

- Autenticación con sesiones y control por rol (`user`, `admin`).
- Gestión de tareas end-to-end:
  - create/update/delete
  - vista lista y vista board estilo Jira
  - filtros y orden persistidos en URL
  - colaboración: asignaciones, comentarios, checklist, labels, due dates
  - historial de cambios y notificaciones in-app
- Gestión de feature flags:
  - create/toggle/delete/update rollout
  - uso directo dentro de flujos de producto
  - panel de `Feature Switches` en Execution Hub para admins
- Preferencias de usuario:
  - densidad, vista por defecto, tema (`light`/`dark`/`system`)
  - persistencia local con estado global
- Integraciones de producto:
  - Stripe para planes/billing
  - Slack para notificaciones operativas
  - Gemini para asistencia en generación/refinamiento de tasks

## Vistas del producto (target)

- `/` `Execution Hub`
- `/tasks` `Tasks` (List + Board)
- `/flags` `Feature Flags`
- `/account` o `/settings` `User Panel`
- Billing dentro de User Panel (con posibilidad de separarse más adelante)
- rutas de auth bajo `app/routes/auth/*`

## Arquitectura

Patrón general:

- `features/*` (UI de feature): aquí vive la interfaz específica del dominio (por ejemplo `tasks` y `flags`), incluyendo páginas, formularios, listas/boards y componentes que no se reutilizan fuera de esa feature.
- `ui/*`: componentes base reutilizables (primitivos/patrones compartidos de interfaz)
- `routes` orquestan request/response
- `features/*/server/*` resuelven intents, validación y errores de action
- `core/*` define contratos de dominio (schemas, ports, tipos)
- `infra/*` implementa persistencia e integraciones externas

Decisiones clave:

- Validación centralizada con Zod.
- Contrato de error consistente en actions (`fieldErrors`, `formError`, `values`).
- Separación clara entre dominio, infraestructura y UI.
- Feature flags integradas al flujo de producto, no solo como módulo aislado.
- Enfoque hexagonal / clean architecture (simple): `core` define puertos/contratos y `infra` provee implementaciones, para desacoplar lógica de negocio de frameworks y proveedores.

## Stack

- React Router v7 (framework mode)
- React 19 + TypeScript
- Drizzle ORM + better-sqlite3
- Zod validation
- Tailwind CSS v4
- shadcn/ui (componentes de producto por defecto)
- Radix UI primitives (comportamiento custom/accesible)
- TanStack Query (cache, invalidación, optimistic updates)
- Zustand (estado global de UI y preferencias)
- Drag and drop para Tasks Board
- Vitest + Testing Library (unit/integration)
- Playwright (E2E)
- Stripe API + webhooks
- Slack API / Incoming Webhooks
- Gemini API
- GitHub Actions (CI/CD)

## Criterio UI (shadcn/ui + Radix)

- Usar `shadcn/ui` como primera opción para construir interfaz y layout.
- Usar `Radix` directo cuando se necesite comportamiento avanzado o composición custom.
- Mantener consistencia visual entre Hub, Tasks, Flags y User Panel.

## Run Locally

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

## Useful Scripts

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

## Estructura del proyecto

```text
app/
  core/        # Dominio: tipos, schemas, puertos
  infra/       # Repositorios, db adapters, servicios externos
  features/    # UI + actions por feature
  routes/      # entrypoints HTTP (loader/action)
  ui/          # componentes compartidos
docs/          # estrategia de producto, roadmap, arquitectura
```

## Documentación de producto

- Roadmap principal: `docs/PRODUCT_ROADMAP.md`
- Visión de producto: `docs/PRODUCT.md`
- Arquitectura: `docs/ARQUITECTURE.md`
- Stack y decisiones técnicas: `docs/STACK.md`

