## 🧩 Core Frontend / Fullstack

### React

* **Docs:** [https://react.dev](https://react.dev)
* **Qué es:** Librería para construir UIs basadas en componentes.
* **Cómo la usamos:**

  * Componentes de UI, estados locales, hooks (`useState`, `useEffect`, etc.).
  * Renderizado de toda la app en el cliente.
  * Base sobre la que se monta React Router (rutas) y la lógica fullstack.

---

### React Router (fullstack, loaders/actions)

* **Docs:** [https://reactrouter.com](https://reactrouter.com) ([reactrouter.com][1])
* **Data APIs (loaders/actions):**

  * Loaders: [https://reactrouter.com/start/framework/data-loading](https://reactrouter.com/start/framework/data-loading) ([reactrouter.com][2])
  * Actions: [https://reactrouter.com/start/framework/actions](https://reactrouter.com/start/framework/actions) ([reactrouter.com][3])
* **Qué es:** Router para React que ahora incluye modo “framework fullstack”: rutas en archivos, loaders (GET), actions (POST/PUT/DELETE), SSR, etc.
* **Cómo la usamos:**

  * Rutas tipo `/`, `/tasks`, `/settings` con archivos en `app/routes`.
  * `loader` para traer datos del server y pasarlos al componente con `useLoaderData`.
  * `action` para procesar formularios (`<Form method="post">`) y mutar datos.
  * Base de nuestra parte “fullstack” sin tener que armar SSR a mano.

---

### TypeScript

* **Docs:** [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)
* **Qué es:** Superset tipado de JavaScript.
* **Cómo la usamos:**

  * Todo el proyecto en `.ts` / `.tsx` con `strict: true`.
  * Tipos para loaders/actions (`Route.LoaderArgs`, etc.).
  * Modelos de dominio (`Task`, `User`, etc.) que luego se alinean con Drizzle.

---

## 🎨 UI / Diseño

### Tailwind CSS (v4)

* **Docs generales:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs) ([tailwindcss.com][4])
* **Qué es:** Framework CSS utility-first, clases como `flex`, `pt-4`, `bg-slate-900` que combinás en el JSX.
* **Cómo la usamos:**

  * Layout base, tipografía, espaciados, colores, dark theme.
  * Construir UI rápida para pages como `/tasks`, `/dashboard`, etc.
  * Integrado con Vite mediante `@tailwindcss/vite` y `@import "tailwindcss";`.

---

### Radix UI

* **Docs:** [https://www.radix-ui.com/docs](https://www.radix-ui.com/docs)
* **Qué es:** Primitivas de UI accesibles (menus, dialogs, popovers, etc.) sin estilos.
* **Cómo la usamos:**

  * Componentes base accesibles envueltos con Tailwind/shadcn.
  * Modal de “Nueva tarea”, dropdown de usuario, etc.

---

### shadcn/ui

* **Docs:** [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs) ([ui.shadcn.com][5])
* **Qué es:** Colección de componentes prearmados (buttons, cards, dialogs, tables) usando Radix + Tailwind.
* **Cómo la usamos:**

  * Componentes de alto nivel: botones, alerts, toasts, sidebar, etc.
  * Establecer un design system consistente sin diseñar todo de cero.

---

## ✅ Validación, estado y datos en el front

### Zod

* **Docs:** [https://zod.dev](https://zod.dev)
* **Qué es:** Librería de validación y parsing de datos con tipos inferidos.
* **Cómo la usamos:**

  * Validar `FormData` en las `action` del router.
  * Definir esquemas de dominio (`taskSchema`, `userSchema`) una sola vez.
  * Compartir tipos entre backend (loaders/actions) y frontend (componentes).

---

### Zustand

* **Docs:** [https://zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs)
* **Qué es:** State manager minimalista para estado global (tipo `useState` pero centralizado).
* **Cómo la usamos:**

  * Estado de UI: tema light/dark, panel abierto, filtros, etc.
  * Ejemplos pequeños de state global antes de meter Redux Toolkit.

---

### Redux Toolkit

* **Docs:** [https://redux-toolkit.js.org](https://redux-toolkit.js.org)
* **Qué es:** Forma moderna de usar Redux sin el boilerplate viejo.
* **Cómo la usamos:**

  * Estado más “enterprise”: user session, features grandes.
  * Comparar con Zustand: cuándo vale la pena un store más estructurado.

---

### TanStack Query (React Query)

* **Docs:** [https://tanstack.com/query/v5/docs/react/overview](https://tanstack.com/query/v5/docs/react/overview) ([TanStack][6])
* **Qué es:** Librería para manejar “server state”: fetch, cache, revalidación, mutations. ([TanStack][7])
* **Cómo la usamos:**

  * Fetch de APIs secundarias (por ej. estadísticas, tablas, integraciones externas).
  * Cachear respuestas, reintentos, estados de loading/error sin reinventar la rueda.
  * Comparación conceptual con loaders/actions del router.

---

## 🗄️ Backend / Datos

### Drizzle ORM

* **Docs:** [https://orm.drizzle.team/docs/get-started](https://orm.drizzle.team/docs/get-started) ([orm.drizzle.team][8])
* **Qué es:** ORM TypeScript para SQL (PostgreSQL, etc.) muy tipado y liviano.
* **Cómo la usamos:**

  * Definir esquemas de tablas (`tasks`, `users`) en TS.
  * Hacer queries tipadas (`db.select().from(tasks)`) desde loaders/actions.
  * Reemplazar el “array in-memory” de Día 2 por una base real Postgres.

---

### PostgreSQL

* **Docs (Drizzle + Postgres):** [https://orm.drizzle.team/docs/get-started-postgresql](https://orm.drizzle.team/docs/get-started-postgresql) ([orm.drizzle.team][9])
* **Qué es:** Base de datos relacional principal (la “DB real” del proyecto).
* **Cómo la usamos:**

  * Persistir tareas, usuarios, sesiones, feature flags, etc.
  * Drizzle se encarga de hablar tipado con Postgres.

---

### Supabase

* **Docs:** [https://supabase.com/docs](https://supabase.com/docs) ([Supabase][10])
* **Qué es:** Plataforma sobre Postgres (DB + Auth + Storage + APIs).
* **Cómo la usamos:**

  * Auth (registro/login con email/password, OAuth).
  * Como backend rápido si no queremos levantar Postgres local.
  * Posible integración con Drizzle como ORM.

---

### Redis

* **Docs:** [https://redis.io/docs/](https://redis.io/docs/)
* **Qué es:** Almacén en memoria clave/valor, muy rápido.
* **Cómo la usamos:**

  * Cache de queries pesadas (ej. dashboard).
  * Guardar sesiones o tokens de forma rápida.
  * Pub/sub simple para notificaciones internas.

---

## 💳 Integraciones externas

### Stripe

* **Docs:** [https://docs.stripe.com](https://docs.stripe.com)
* **Qué es:** Plataforma de pagos (tarjetas, suscripciones, etc.).
* **Cómo la usamos:**

  * Checkout de prueba (donaciones, upgrade ficticio de cuenta).
  * Webhooks básicos para simular lógica de facturación.

---

### Slack API

* **Docs:** [https://api.slack.com](https://api.slack.com)
* **Qué es:** API para mandar mensajes a canales, crear bots, etc.
* **Cómo la usamos:**

  * Notificaciones cuando pasa algo en la app (ej. “nueva tarea creada”).
  * Simular alertas de sistema/producto.

---

### Gemini AI API

* **Docs:** [https://ai.google.dev](https://ai.google.dev)
* **Qué es:** API de modelos de IA (texto, visión, etc).
* **Cómo la usamos:**

  * Sugerencias automáticas (ej. descripción de tarea, resúmenes).
  * Una feature “AI assistant” dentro de la app.

---

## 🧪 Testing

### Vitest

* **Docs:** [https://vitest.dev](https://vitest.dev)
* **Qué es:** Test runner moderno compatible con Vite, similar a Jest.
* **Cómo la usamos:**

  * Unit tests de funciones de dominio.
  * Tests de loaders/actions (sin levantar toda la app).

---

### Testing Library (React)

* **Docs:** [https://testing-library.com/docs/react-testing-library/intro](https://testing-library.com/docs/react-testing-library/intro)
* **Qué es:** Librería para testear componentes desde la perspectiva del usuario (no del implementation detail).
* **Cómo la usamos:**

  * Tests de formularios, interacción, accesibilidad básica.
  * Acompañar Vitest en la capa de UI.

---

### Playwright

* **Docs:** [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
* **Qué es:** Framework de testing E2E (navegador real).
* **Cómo la usamos:**

  * Flujo completo: login → crear tarea → ver tarea.
  * Smoke tests para evitar romper la app con refactors.

---

## 🧹 DX / Calidad / CI

### ESLint

* **Docs:** [https://eslint.org/docs/latest](https://eslint.org/docs/latest)
* **Qué es:** Linter para encontrar errores/patrones problemáticos en el código.
* **Cómo la usamos:**

  * Config TS + React + a11y.
  * `npm run lint` en local y en GitHub Actions.

---

### Prettier

* **Docs:** [https://prettier.io/docs/en/](https://prettier.io/docs/en/)
* **Qué es:** Formateador de código de opinión fuerte (estilo consistente).
* **Cómo la usamos:**

  * `npm run format` → aplica estilo uniforme.
  * Integrado con ESLint vía `eslint-plugin-prettier`.

---

### Husky

* **Docs:** [https://typicode.github.io/husky](https://typicode.github.io/husky)
* **Qué es:** Manejo de git hooks desde Node.
* **Cómo la usamos:**

  * Hook `pre-commit` para correr `lint-staged`.
  * Evitar commitear código roto.

---

### lint-staged

* **Docs:** [https://github.com/okonet/lint-staged](https://github.com/okonet/lint-staged)
* **Qué es:** Herramienta para correr linters/formatters solo en archivos staged.
* **Cómo la usamos:**

  * `lint-staged` + Husky -> lint + format solo de lo que vas a commitear.

---

### GitHub Actions

* **Docs:** [https://docs.github.com/actions](https://docs.github.com/actions)
* **Qué es:** Plataforma de CI/CD integrada a GitHub.
* **Cómo la usamos:**

  * Workflow que corre `npm run lint`, `npm run test`, `npm run build` en cada push/PR.
  * Más adelante: deploy automático a algún hosting.

---

[1]: https://reactrouter.com/?utm_source=chatgpt.com "React Router Official Documentation"
[2]: https://reactrouter.com/start/framework/data-loading?utm_source=chatgpt.com "Data Loading"
[3]: https://reactrouter.com/start/framework/actions?utm_source=chatgpt.com "Actions"
[4]: https://tailwindcss.com/?utm_source=chatgpt.com "Tailwind CSS - Rapidly build modern websites without ever ..."
[5]: https://ui.shadcn.com/docs/tailwind-v4?utm_source=chatgpt.com "Tailwind v4 - Shadcn UI"
[6]: https://tanstack.com/query/v5/docs/react/overview?utm_source=chatgpt.com "Overview | TanStack Query React Docs"
[7]: https://tanstack.com/query?utm_source=chatgpt.com "TanStack Query"
[8]: https://orm.drizzle.team/docs/get-started?utm_source=chatgpt.com "Drizzle ORM - Get started"
[9]: https://orm.drizzle.team/docs/get-started-postgresql?utm_source=chatgpt.com "PostgreSQL - Drizzle ORM"
[10]: https://supabase.com/docs/guides/database/drizzle?utm_source=chatgpt.com "Drizzle | Supabase Docs"
