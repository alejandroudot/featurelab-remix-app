# FeatureLab

Plataforma fullstack para planificar, ejecutar y monitorear trabajo de producto.
Enfoque principal: `Tasks` colaborativas + `Feature Flags` para lanzar con control.

## ✨ Quick View

- 🎯 `Tasks-first`: trabajo diario y colaborativo como eje del producto.
- 🧭 `Execution Hub`: home operativa con metricas, actividad y quick actions.
- 🚦 `Feature Flags`: control de release por entorno, toggles admin y rollout.
- 👤 `User Panel`: perfil, seguridad, preferencias y plan.
- 📈 Escalabilidad progresiva: estado cliente avanzado, integraciones y CI/CD.

## 🏷️ Estado

- `✅ Implementado`: disponible hoy en el repo.
- `🟡 Planeado`: definido en roadmap, todavia no implementado completo.

## 🧩 Funcionalidades

- ✅ Autenticacion con sesiones y control por rol (`user`, `admin`).
- ✅ Gestion de tasks base:
  - create/update/delete
  - vista lista actual
- ✅ Gestion de feature flags:
  - create/toggle/delete/update rollout
  - panel de `Feature Switches` en Execution Hub (admin)
- ✅ Home (`Execution Hub`) con metricas, actividad y quick actions.
- 🟡 Gestion de tasks evolucionada:
  - vista board-first estilo Jira/Trello
  - columnas fijas: `To Do`, `In Progress`, `QA`, `Ready to Go Live`
  - orden por columna: `manual` (default) o `prioridad`
  - drag and drop horizontal (cambio de estado) y vertical (reorden/prioridad)
  - asignaciones, comentarios, checklist, labels, due dates
  - historial de cambios y notificaciones in-app
- 🟡 Preferencias de usuario:
  - densidad, vista por defecto, tema (`light`/`dark`/`system`)
  - persistencia local con estado global
- 🟡 Integraciones:
  - Stripe (billing)
  - Slack (notificaciones)
  - Gemini (asistencia para tasks)

## 🗺️ Vistas del producto (target)

- `/` `Execution Hub`
- `/tasks` `Tasks` (List + Board)
- `/flags` `Feature Flags`
- `/account` o `/settings` `User Panel`
- Billing dentro de User Panel (inicialmente)
- Auth en `app/routes/auth/*`

## 🏗️ Arquitectura

Se usa un enfoque pragmatico de:
- base de Hexagonal / Clean Architecture;
- arquitectura por capas;
- organizacion por feature;
- puertos/adaptadores en dominio-infra.

No se busca pureza academica extrema: se aplica Hexagonal/Clean de forma pragmatica,
priorizando claridad operativa y velocidad de iteracion para un proyecto de estudio real.

Patron general del repo:

- `features/*` (UI de feature): interfaz especifica de dominio (`tasks`, `flags`, etc.), con paginas, formularios, listas/boards y componentes no compartidos.
- `ui/*`: componentes base reutilizables (primitivos/patrones de interfaz).
- `routes/*`: orquestacion HTTP request/response.
- `features/*/server/*`: intents, validacion y manejo de errores de action.
- `core/*`: contratos de dominio (schemas, ports, tipos).
- `infra/*`: persistencia e integraciones externas.

Decisiones clave:

- Validacion centralizada con Zod.
- Contrato de error consistente en actions (`fieldErrors`, `formError`, `values`).
- Separacion clara entre dominio, infraestructura y UI.
- Feature flags integradas al flujo de producto.
- Enfoque hexagonal/clean (simple): `core` define contratos y `infra` implementa.

## 🧰 Stack

- ✅ En uso hoy:
  - React Router v7 (framework mode)
  - React 19 + TypeScript
  - Drizzle ORM + better-sqlite3
  - Zod validation
  - Tailwind CSS v4
  - shadcn/ui (componentes de producto por defecto)
  - Radix UI primitives (comportamiento custom/accesible)
- 🟡 Planeado / adopcion progresiva:
  - TanStack Query (cache, invalidacion, optimistic updates)
  - Zustand (estado global de UI y preferencias)
  - Drag and drop para Tasks Board
  - Vitest + Testing Library (unit/integration)
  - Playwright (E2E)
  - Stripe API + webhooks
  - Slack API / Incoming Webhooks
  - Gemini API
  - GitHub Actions (CI/CD)

## 🎨 Criterio UI (shadcn/ui + Radix)

- Usar `shadcn/ui` como opcion por defecto para interfaz y layout.
- Usar `Radix` directo para comportamiento avanzado/composicion custom.
- Mantener consistencia visual entre Hub, Tasks, Flags y User Panel.

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

## 📜 Useful Scripts

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

## 📁 Estructura del proyecto

```text
app/
  core/        # Dominio: tipos, schemas, puertos
  infra/       # Repositorios, db adapters, servicios externos
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
