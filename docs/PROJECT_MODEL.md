# Project Model (Draft aligned to roadmap)

## Context

Estado actual (2026-03-02):
- `projects` ya vive en DB.
- `tasks.project_id` ya existe y se usa para filtrar tareas por proyecto.
- `task_project_map` local ya fue removido.
- `teams`, `team_members` y `project_members` ya existen como base de schema.

Todavia faltan piezas de enforcement para P1.3/P3.1 (ACL activa y constraints finales).

## Goal

Definir un modelo unico para que:
- `Project` sea entidad real en DB.
- `Task` pertenezca a un `Project` por FK.
- El modelo soporte luego contexto personal + team y permisos por proyecto sin reescribir todo.

## Proposed domain split

- `core/project`: tipos y puertos de `Project` y membresias de proyecto.
- `core/task`: tipos y puertos de `Task` (siempre referenciando `projectId`).
- `infra/project`: repositorio/adapters de persistencia de proyecto.
- `infra/task`: repositorio/adapters de persistencia de task.

## Proposed DB model

### `projects`

- `id` text PK
- `name` text not null
- `description` text null
- `icon` text null (emoji o key de icono)
- `image_url` text null
- `owner_user_id` text not null FK `users.id`
- `team_id` text null FK `teams.id` (null = proyecto personal)
- `status` text enum `active | archived` default `active`
- `created_at` timestamp ms not null
- `updated_at` timestamp ms not null

Notas:
- `owner_user_id` siempre existe (incluso en proyectos de equipo).
- `team_id` prepara el terreno para P3.1 sin bloquear P1.

### `project_members`

- `project_id` text not null FK `projects.id` (cascade delete)
- `user_id` text not null FK `users.id` (cascade delete)
- `role` text enum `viewer | member | full` not null
- `sidebar_order` integer not null default `0`
- `pinned` boolean not null default `false`
- `created_at` timestamp ms not null
- PK compuesta: (`project_id`, `user_id`)

Notas:
- Para proyecto personal, el owner tambien tiene fila en `project_members` con `role = full`.
- `sidebar_order` y `pinned` viven por usuario (evita acoplar orden global para todos).

### cambios en `tasks`

Agregar:
- `project_id` text not null FK `projects.id`

Regla:
- Toda task pertenece a un proyecto.

## Implementado hoy (safe, sin romper)

- [x] `projects` en DB + repository unico.
- [x] `tasks.project_id` agregado y usado en UI/loader.
- [x] `teams`, `team_members`, `project_members` creados.
- [x] `projects.team_id` nullable.
- [x] `projects.description`, `projects.icon`, `projects.status` agregados.
- [x] `project_members.sidebar_order` y `project_members.pinned` agregados.
- [x] Backfill de owner en `project_members` (si no existe fila owner).

## Core types (target)

```ts
export type ProjectStatus = 'active' | 'archived';

export type Project = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  ownerUserId: string;
  teamId: string | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectMemberRole = 'viewer' | 'member' | 'full';

export type ProjectMember = {
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  sidebarOrder: number;
  pinned: boolean;
  createdAt: Date;
};
```

## Port shape (target)

Agrupado (igual criterio que `taskPort`):
- `ProjectPort.project`
  - `listForUser(userId)`
  - `getByIdForUser({ projectId, userId })`
  - `create(...)`
  - `update(...)`
  - `remove({ projectId, actorUserId })`
- `ProjectPort.member`
  - `listByProject(projectId)`
  - `upsertRole(...)`
  - `setPinned(...)`
  - `reorderSidebar(...)`

## Migration strategy (safe incremental)

1. Crear tablas `projects` y `project_members`.
2. Agregar `tasks.project_id` nullable temporal.
3. Backfill inicial:
   - crear proyecto personal default por usuario con tasks existentes.
   - asignar `tasks.project_id` a ese proyecto.
   - crear fila owner en `project_members`.
4. Hacer `tasks.project_id` not null.
5. Remover uso de `task_project_map` local.

## Pendiente para mas adelante

- [ ] Hacer `tasks.project_id` `NOT NULL` cuando no haya casos legacy.
- [ ] Activar ACL server-side real via `project_members.role` (`viewer | member | full`).
- [ ] Usar `sidebar_order` + `pinned` en sidebar (UX y persistencia real).
- [ ] Completar operaciones de membresia de proyecto (`invite`, `role update`, `remove member`).

## Acceptance to move forward

- Lecturas de tasks en server siempre filtran por `project_id`.
- Sidebar de proyectos se alimenta desde DB/port, no localStorage.
- Crear/borrar proyecto limpia/actualiza tasks por FK y permisos.
- Estructura lista para P3.1 `project_members` ACL.
