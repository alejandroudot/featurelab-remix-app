## 🧪 El producto: un **SaaS para equipos que construyen producto**

Un “mini-Linear / mini-LaunchDarkly / mini-Notion” mezclado, pero mucho más chico:

### Nombre tentativo: **FeatureLab**

Una app para equipos de producto donde pueden:

1. **Gestionar trabajo**

   * Tasks (lo que ya tenemos como `/tasks`)
   * Estados, prioridades, tags
   * Asignar a usuarios (más adelante, cuando tengamos auth)

2. **Activar features y experimentos**

   * **Feature flags** por workspace / usuario
   * A/B tests simples (ej: dos variantes de un componente o copy)

3. **Cobrar por acceso avanzado**

   * Plan free vs plan pro
   * Stripe para cobrar suscripción / upgrade

4. **Integrarse con herramientas reales**

   * Slack: notificación cuando se crea una tarea importante, cuando se activa un experimento, etc.
   * Gemini: sugerencias de descripción de tareas, generación de ideas, resúmenes.

En resumen:

> **Una app donde un equipo de producto puede crear tareas, activar flags/experimentos, cobrar a clientes y recibir notificaciones, todo en un mismo lugar.**

No es un clon de Airbnb ni de Linear, pero **toca casi todos los problemas interesantes** que querés practicar.

---

## 🎯 Por qué este producto encaja perfecto con nuestro stack

Mirá cómo se enchufa con TODO lo que definimos:

### Front / Fullstack

* **React Router fullstack**

  * Rutas: `/tasks`, `/flags`, `/experiments`, `/billing`, `/settings`.
  * Loaders/actions para todo: listar tasks, crear/editar, toggle de flags, etc.

* **Tailwind + Radix + shadcn**

  * UI moderna tipo SaaS: sidebar, toolbar, tablas, modales, toasts.

* **Zod**

  * Validación de:

    * creación/edición de tasks
    * creación de flags
    * config de experimentos
    * datos de billing

* **Zustand / Redux / React Query**

  * Zustand → estado de UI (filtros, selección, tema)
  * Redux → cosas más estructuradas (session, feature toggles)
  * React Query → integraciones externas (Stripe, Slack, AI), dashboards, etc.

---

### Backend / Datos / Infra

* **Drizzle + Postgres**

  * Tablas:

    * `users`
    * `workspaces`
    * `tasks`
    * `feature_flags`
    * `experiments`
    * `subscriptions` (nexo con Stripe)
  * Repositorios tipados que reemplazan el in-memory que tenemos ahora.

* **Supabase**

  * Auth (email/password u OAuth)
  * Como alternativa de DB en local si no querés levantar Postgres, o como “env de cloud rápido”.

* **Redis**

  * Cache de dashboards pesados (ej. métricas de uso de flags/experimentos).
  * Guardar sesiones / tokens breves.
  * Pub/sub para eventos internos (en una versión más avanzada).

---

### Integraciones

* **Stripe**

  * Plan Free vs Pro:

    * Free: X cantidad de tasks / flags
    * Pro: sin límite, features avanzadas (A/B test, Slack, AI, etc.)
  * Checkout simple: upgrade de workspace.

* **Slack API**

  * Mandar mensajes tipo:

    * “Nueva tarea creada en workspace X”
    * “Flag Y fue activado/desactivado”
    * “Nuevo experimento lanzado”

* **Gemini AI**

  * Botón en el form de task: “Sugerir descripción”
  * Resumen semanal de cambios (tasks nuevas, flags, etc.)
  * Sugerencias de experimentos a partir de tareas marcadas como “idea”.

---

### Testing, DX, SEO, Perf (metafunciones)

* **Vitest + Testing Library**

  * Tests de:

    * validación de Zod (dominio)
    * repositorios de Drizzle (infra)
    * loaders/actions (aplicación)
    * componentes de UI (forms, listados)

* **Playwright**

  * E2E:

    * login → crear task → activar flag
    * upgrade de plan → ver features habilitadas

* **GitHub Actions**

  * CI: lint + test + build para cada PR.

* **Core Web Vitals + bundle check**

  * Tenemos tablas, dashboards, UI relativamente pesada → perfecto para practicar:

    * split de bundles
    * lazy load de páginas “pesadas” (ej. experiments, analytics)
    * prefetch inteligente con React Router.

---

## 🧱 Estructura de features (como si fueran “microservicios internos”)

Pensalo así:

```text
core/
  tasks/
  flags/
  experiments/
  billing/
  auth/

infra/
  db/
  tasks/
  flags/
  experiments/
  billing/
  auth/
  stripe/
  slack/
  ai/

features/
  tasks/
  flags/
  experiments/
  billing/
  auth/

routes/
  home.tsx
  tasks.tsx
  flags.tsx
  experiments.tsx
  billing.tsx
  settings.tsx
```

Cada “bloque” (tasks, flags, experiments, billing, auth) tiene:

* dominio → tipos, schemas Zod, puertos (repositorios)
* infra → implementación con Drizzle/Stripe/Slack/etc.
* features → componentes y hooks concretos de UI
* routes → loader/action/JSX que orquestan la feature.

---

> **¿Qué vamos a hacer acá? ¿Qué producto?**

Vamos a construir un **SaaS fullstack para equipos de producto** llamado (nombre tentativo) **FeatureLab**, que les permite:

* gestionar tareas de producto,
* manejar feature flags y experimentos básicos,
* tener un plan de pago (Stripe),
* recibir notificaciones (Slack),
* usar IA (Gemini) para automatizar pequeñas cosas.

Este producto nos deja usar **todo el stack moderno** que definiste (React Router, Drizzle, Redis, Supabase, Stripe, Slack, Gemini, testing, CI, etc.), pero en un tamaño manejable.

---
