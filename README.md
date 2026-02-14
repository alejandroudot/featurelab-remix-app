# FeatureLab

FeatureLab is a fullstack app built with React Router v7 + TypeScript + Drizzle.
Current scope focuses on personal task management and product feature flags.

## Current Status

- Auth with session-based access control (`requireUser`, `requireAdmin`)
- Tasks: list, create, update, delete
- Feature Flags: list, create, toggle, delete, rollout update
- SQLite repository active in local environment
- Feature flag resolution integrated into tasks route (`beta-tasks-ui`)

## Stack

- React Router v7 (framework mode)
- React 19 + TypeScript
- Drizzle ORM + better-sqlite3
- Zod validation
- Tailwind CSS v4

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

## Main Routes

- `/` home/dashboard
- `/tasks` personal tasks
- `/flags` feature flags admin page
- auth routes under `app/routes` (login/register/logout flow)

## Project Structure

```text
app/
  core/        # Domain types, schemas, ports
  infra/       # Repository implementations, db adapters
  features/    # Feature-level UI + server actions
  routes/      # HTTP entrypoints (loader/action)
  ui/          # Reusable UI primitives
docs/          # Product, MVP, architecture docs
```

## Notes

- Routes should stay thin: orchestrate only.
- Feature server actions should own intent parsing + validation.
- Keep schema definitions in `app/core/*/*.schema.ts`.

## Next Work

The active implementation plan is tracked in:

- `docs/NEXT_TASKS.md`
