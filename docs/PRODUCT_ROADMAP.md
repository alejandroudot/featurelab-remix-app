# ??? PROXIMAS TAREAS (Pulido MVP + MVP+1)
> ?? Lista viva de ejecucion para avanzar sin perder foco.

Este documento es la lista activa de ejecucion.

## ?? Leyenda

- `[ ]` pendiente
- `[~]` en progreso
- `[x]` listo

## ?? Direccion del producto (alineada)

- Foco principal: `Tasks` y colaboracion entre usuarios.
- Flags: se mantienen como modulo de soporte (sin ampliar demasiado alcance funcional).
- Vistas target del producto:
  - Home: `Execution Hub` (`/`)
  - `Tasks` (List + Board)
  - `Flags`
  - `User Panel` (`/account` o `/settings`)
  - `Billing/Plan` (inicialmente dentro de User Panel)
- Navegacion global (decision de UX):
  - `Header` minimal: solo account/session + notificaciones globales.
  - Navegacion funcional de producto en panel lateral izquierdo persistente.
  - `Tasks` y `Flags` salen del header y pasan al sidebar.
  - El contenido principal cambia a la derecha del sidebar (layout tipo app shell).

## ?? Criterio UI (shadcn/ui + Radix)

- `shadcn/ui`: componentes de interfaz y layout del producto (cards, table, tabs, dialog, sheet, form controls, badge, button, input, textarea, dropdown).
- `Radix UI` directo: primitives de comportamiento/accesibilidad que queremos controlar fino (toast provider, tooltip avanzado, alert dialog destructivo, popover/menu complejos).
- Regla de uso:
  - si existe componente listo en `shadcn/ui`, usar `shadcn/ui`;
  - usar `Radix` directo solo cuando necesitemos comportamiento custom o composicion avanzada.

## ? Base ya implementada (tracking historico)

- [x] Auth con sesiones y control por rol (`requireUser`/`requireAdmin`)
- [x] Tasks CRUD basico (list, create, update, delete) con validacion Zod
- [x] Flags admin (list, create, toggle, delete, rollout update)
- [x] Rutas como orquestadores + logica server en `app/server/*`
- [x] Manejo de errores de actions con `fieldErrors` / `formError` / `values`
- [x] Persistencia local con SQLite + Drizzle
- [x] Resolucion de flag integrada en flujo de tasks (`beta-tasks-ui`)

## ?? P0 - Estabilidad y consistencia

### P0.1 Endurecer flujo de tasks

- [x] Persistir valores del formulario al fallar validacion en crear task
- [x] Agregar render de `formError` global en el formulario de crear task
- [x] Asegurar que todos los errores de actions de tasks sean visibles en UI
- [x] Validar manualmente create/update/delete con payloads invalidos
  - [x] Validacion estatica de create: `server/task/action/*` devuelve `fieldErrors` y `values` en invalidacion
  - [x] Validacion estatica de create: `CreateTask.tsx` renderiza error global y preserva valores del submit invalido
  - [x] Validacion estatica de update/delete: `server/task/action/*` usa mapeo de errores consistente
  - [x] Validacion estatica de intent invalido: `server/task/utils.ts` devuelve `fieldErrors.intent` y `values`

Criterio de cierre:

- Un submit invalido nunca falla en silencio
- El usuario siempre ve error por campo o error global

### P0.2 Consistencia de patron de actions (tasks vs flags)

- [x] Alinear estructura de helper de action de tasks con el patron de flags
- [x] Extraer helpers comunes para task action (`parseIntent`, mapeo de errores)
- [x] Mantener archivos de rutas solo como orquestadores

Criterio de cierre:

- Flujo de control y contratos de error similares en ambos modulos
- Sin logica duplicada de parseo de intent en rutas

### P0.3 Alineacion de contratos de schemas y tipos

- [x] Verificar consistencia de nombres de tipos de intent entre features
- [x] Asegurar que el shape de `ActionData` sea estable
- [x] Confirmar que no queden imports/rutas viejas tras mover archivos

Criterio de cierre:

- Nombres de tipos e imports coherentes
- Sin alias de path rotos ni modulos faltantes

### P0.4 Refactor y limpieza transversal

- [x] Eliminar codigo muerto y caminos legacy no usados
- [x] Ordenar carpetas y modulos por responsabilidad real
- [x] Homogeneizar naming de funciones, handlers, tipos e intents
- [x] Reducir componentes grandes en piezas pequenas y mantenibles
- [x] Limpiar contratos obsoletos entre `core`, `features` e `infra`

Criterio de cierre:

- El codigo queda entendible sin contexto historico extra
- No quedan dependencias o tipos "zombie" en el flujo principal

## ?? P1 - Producto (Tasks-first)

### P1.1 Home como Execution Hub

Tecnologias a usar: React Router + TanStack Query + Zustand + shadcn/ui + Radix (toggle/tooltip/toast).

- [x] Crear Home (`/`) como `Execution Hub`
  - [x] Definir layout de dashboard (resumen, actividad, quick actions)
  - [x] Implementar layout base del dashboard (estructura sin kit visual final)
  - [x] Mostrar metricas clave de tasks (to do, in progress, qa, ready)
  - [x] Mostrar resumen de flags (solo estado operativo basico)
- [x] Agregar panel de actividad reciente
  - [x] Eventos base: task creada/editada/cerrada
  - [ ] Evento `reasignada` (se completa en P1.3 al incorporar `assigneeId`)
  - [x] Mostrar actor + timestamp + accion
- [x] Agregar quick actions
  - [x] Crear task
  - [x] Ir a board
  - [x] Ir a flags
  - [x] Evolucionar `Crear task` a accion inline desde Hub (modal/sheet)
  - [x] Reusar validaciones y contrato de `task.action` en la accion inline
- [x] Aplicar kit visual del Hub con `shadcn/ui`
  - [x] `Card`, `Badge`, `Button`, `Separator`
- [x] Agregar toggle de dark mode en Hub (UI facherita y visible)
  - [x] Mostrar switch en header del Hub
  - [x] Implementar switch con `shadcn/ui` (`Switch`)
  - [x] Persistir preferencia de tema por usuario (Zustand + storage)
  - [x] Aplicar tema sin salto visual al recargar
  - [x] Rebaseline UX Dia 11: el control de tema queda centralizado en `Account > Preferencias` (se removio toggle de header)
- [x] Agregar bloque `Feature Switches` (solo admin) en Hub
  - [x] Mostrar toggles de flags clave con estado actual
  - [x] Implementar panel con `shadcn/ui` (`Card`, `Switch`, `Tooltip`)
  - [x] Permitir prender/apagar desde Hub con feedback inmediato
  - [x] Usar `Radix Toast` para feedback de toggle exitoso/error
  - [x] Respetar permisos: solo admins pueden cambiar flags
- [x] Bootstrap de flags iniciales para darle sentido al modulo de flags
  - [x] `execution-hub-enabled`
  - [x] `hub-activity-feed-enabled`
  - [x] `tasks-board-enabled`
  - [x] `tasks-comments-enabled`
  - [x] `tasks-mentions-enabled`
  - [x] `tasks-attachments-enabled`
  - [x] `tasks-checklist-enabled`
  - [x] `tasks-ai-suggestions-enabled`
  - [x] `billing-enabled`
  - [x] `slack-notifications-enabled`
- [x] Definir comportamiento por environment para flags iniciales
  - [x] `development`: defaults mas permissivos para probar features
  - [x] `production`: defaults conservadores para release gradual

Criterio de cierre:

- La Home deja de ser placeholder y funciona como centro de control
- El usuario puede decidir y actuar rapido desde una sola vista
- Flags tiene uso visible y cotidiano dentro del producto

### P1.2 Tasks UX (Board-first estilo Jira/Trello)

Tecnologias a usar: Zod (query params) + React Router (loaders/actions) + DnD + shadcn/ui + Radix (dialog/tooltip).

- [x] Definir direccion UX para `/projects` (acordada antes de codear)
  - [x] Estilo visual elegido y consistente
  - [x] Prioridades de lectura claras en pantalla
  - [x] Copy de acciones coherente
- [x] Definir comportamiento de orden en board por columna
  - [x] Modo `manual` por defecto (orden libre con DnD vertical)
  - [x] Modo `prioridad` (ordenado por `critical`, `high`, `medium`, `low`)
- [x] URL como soporte de estado de vista (no foco principal)
  - [x] Params minimos: `view`, `order`
  - [x] Validacion con Zod + defaults seguros
  - [x] Persistencia de estado al navegar/recargar
- [x] Estados vacios y feedback de interaccion
  - [x] Estado vacio global
  - [x] Estado vacio por columna
  - [x] CTA clara para crear task o limpiar configuracion de vista
- [x] Vista Board tipo Jira en `/projects`
  - [x] Columnas: `To Do`, `In Progress`, `QA`, `Ready to Go Live`
  - [x] Crear task entra en `To Do` por defecto
  - [x] Toggle `List` / `Board`
  - [x] Toggle de vista con `shadcn/ui` (`Tabs` o `ToggleGroup`)
  - [x] Drag and drop entre columnas
  - [x] Drag and drop vertical dentro de columna
  - [x] Update inmediato en UI al mover cards (horizontal y vertical)
  - [x] Persistencia/rollback usando flujo actual `loader/action` (sin duplicar cache con Query en esta fase)
  - [x] Card de task con prioridad, labels, responsable, metadata minima
  - [x] Card construida con `shadcn/ui` (`Card`, `Badge`, `Avatar`, `DropdownMenu`)
  - [x] Abrir detalle de task al clickear card/fila (modal/sheet estilo Jira)
  - [x] Detalle con layout simple: contenido principal + comentarios abajo + panel lateral
  - [x] Panel lateral con acciones rapidas: cambiar `assignee`, `status` y `priority`
  - [x] Mantener contexto al abrir detalle (filtros, vista y scroll)
  - [x] Edicion rapida desde modal de detalle (sin inline edit en card)
  - [x] Edicion inline de titulo y descripcion dentro del modal de detalle (click para editar)
  - [x] Regla de actualizacion de prioridad desde interacciones del board
  - [x] Usar `Radix AlertDialog` para acciones destructivas desde card
  - [x] Responsive real (desktop/mobile)

Criterio de cierre:

- Tasks funciona bien en modo lista y tablero
- La UX se siente de producto real, no de CRUD basico

### P1.2.1 Tasks layout refresh + Projects v1

Tecnologias a usar: React Router loaders/actions + shadcn/ui (`Dialog`, `DropdownMenu`, `Input`, `Button`) + Zod.

- [x] Limpiar layout de `/projects` para dejar foco en board
  - [x] Sacar formulario inline de create task del medio de la vista
  - [x] Crear boton `Crear tarea` que abre modal/sheet de alta (patron similar a Hub)
  - [x] Mantener board como contenido principal visible arriba
- [x] Header de acciones de Tasks (lado derecho superior)
  - [x] Boton `Crear tarea` (abre modal)
  - [x] Boton `View settings` con dropdown de configuraciones de vista
  - [x] Dropdown `Scope` para cambiar alcance rapido (`Todo`, `Mis tareas`, `Asignadas a mi`, `Creadas por mi`, `Equipo activo`)
- [x] Search bar en Tasks
  - [x] Buscar por palabras clave en titulo/descripcion
  - [x] Filtrado reactivo sobre lista/board visible
- [ ] Proyectos v1 (nuevo scope funcional)
  - [x] Panel lateral izquierdo con lista de proyectos
  - [ ] Crear proyecto desde el panel lateral
  - [x] Estado vacio de proyectos: CTA `Crea tu primer proyecto` con iconografia clara
  - [x] Header del bloque `Projects` con icono visual (estilo marcador/cohete) y accion rapida
  - [x] Cada proyecto puede tener icono/imagen personalizada
  - [x] Flujo de navegacion consistente: `/` lista proyectos (overview) y el detalle abre por seleccion explicita (card/sidebar)
  - [ ] Render del icono del proyecto en sidebar y en encabezado de vista del proyecto
  - [x] Al seleccionar proyecto, Tasks muestra solo tasks de ese proyecto
  - [x] Contexto visual por proyecto en el header de Tasks
- [ ] Panel lateral con secciones desplegables (v1)
  - [ ] Seccion `Projects` desplegable con `Pinned`
  - [ ] Orden manual de proyectos por drag and drop vertical (solo arriba/abajo)
  - [ ] Seccion `Teams` desplegable (visible solo para manager)
  - [ ] `Teams` funciona como entrypoint de gestion para manager (crear equipo y navegar equipos creados)
  - [x] Seccion `Flags` desplegable (visible solo admin) como acceso de navegacion lateral
- [ ] Header editable por proyecto en vista Tasks
  - [x] Titulo de vista = nombre del proyecto activo
  - [ ] Descripcion del proyecto editable
  - [ ] Edicion inline por click en titulo y descripcion

Criterio de cierre:

- `/projects` queda visualmente limpio y centrado en board
- Alta de task se hace por modal y no rompe el layout
- Existe contexto de proyecto visible + filtro por proyecto + busqueda por keyword
- Sidebar persistente con navegacion por rol (`Projects`, `Teams`, `Flags`) y orden manual de proyectos

Post-migracion DB (pendiente corto plazo):
- [x] `projects` en DB + `tasks.project_id`
- [x] Base de `teams`, `team_members`, `project_members`
- [ ] `tasks.project_id` `NOT NULL` (cuando no queden casos legacy)
- [ ] Enforcement ACL por `project_members.role` en server actions/loaders
- [ ] Usar `pinned` + `sidebar_order` en sidebar real

### P1.3 Colaboracion y asignaciones (foco principal)

Tecnologias a usar: Drizzle/SQLite + React Router + Zod + Zustand + TanStack Query.

Regla de colaboracion:
- Las tasks se consideran compartidas entre `creador` y `asignado`.
- Ambos deben ver la task en `/projects` (vista list y board), con cambios de estado/orden reflejados para los dos.
- El creador mantiene visibilidad aunque asigne la task.
- El asignado obtiene visibilidad y contexto para ejecutarla.
- El `Execution Hub` muestra actividad/notificaciones de cambios relevantes (no listado completo de tasks).

- [x] Modelo de asignacion
  - [x] Agregar `assigneeId` (nullable)
  - [x] Soportar `Unassigned`
  - [x] Ajustar schemas create/update
- [x] Flujo de asignacion/reasignacion
  - [x] Sin selector de responsable en create (decision de producto)
  - [x] Selector/reasignacion de responsable en edit desde modal de detalle
  - [x] Sin reasignacion rapida desde board (decision de producto)
  - [x] Reasignacion rapida desde detalle de task (panel lateral)
  - [x] Responsable visible en list y board
- [x] Vistas de trabajo por usuario
  - [x] `Asignadas a mi`
  - [x] `Creadas por mi`
  - [x] `Todas`
  - [x] Visibilidad compartida: task visible para creador y asignado
- [x] Permisos y reglas
  - [x] Definir quien puede editar/reasignar/cerrar
  - [x] Creador: permisos completos sobre la task
  - [x] Asignado: puede editar/status/orden, pero no reasignar responsable
  - [x] Validar permisos en server actions
  - [x] Mensajes claros en acciones no permitidas
- [x] Trazabilidad y notificaciones
  - [x] Historial de cambios por task
  - [x] Notificaciones in-app por asignacion/reasignacion
  - [x] Preparar hook para Slack
- [x] Enriquecer task para valor de producto
  - [x] `dueDate` + overdue
  - [x] labels/tags
  - [x] checklist/subtareas
  - [x] comentarios
  - [x] `@menciones` de usuarios en comentarios y descripcion de la task
  - [x] `@menciones` tambien en create task (descripcion rich text)
  - [x] editor rich text para descripcion/comentarios (Lexical + imagen inline + menciones)
  - [x] flujo de imagen embebida: boton + copy/paste + preview estable + upload por API
  - [x] politica de archivos de rich text (cleanup, limites de tipo/tamano, permisos)
  - [x] plantillas rapidas
  - [x] create task con descripcion rich text (toolbar + links + listas + imagen embebida)

Criterio de cierre:

- El producto soporta trabajo colaborativo real sobre tasks
- Asignaciones, permisos e historial quedan claros para el usuario

### P1.4 User Panel (`/account` o `/settings`)

Tecnologias a usar: React Router + Zod + shadcn/ui + Radix (alert dialog/toast).

- [x] Crear vista dedicada de cuenta
  - [x] Bloques: Perfil, Seguridad, Preferencias, Plan
  - [x] Layout con `shadcn/ui` (`Card`, `Form`, `Input`, `Button`, `Dialog`) usando patron resumen + modal
  - [x] Navegacion visible desde header
- [~] Perfil y seguridad
  - [x] Editar nombre visible
  - [x] Cambio de password
  - [x] Errores y exito visibles sin silencios
  - [x] Register con `confirmEmail` + validacion de match en cliente y server
  - [x] Policy de password compartida entre register y change-password
  - [~] Verificacion real de email por link
    - [x] `email_verification_tokens` (`userId`, `tokenHash`, `expiresAt`, `usedAt`)
    - [x] `users.emailVerifiedAt` (nullable)
    - [x] Register crea token y envia email
    - [x] Endpoint de confirmacion por token (valido/expirado/usado)
    - [x] Infra de email base: adapter por puerto + dev sink/log local
    - [ ] Integrar proveedor real de email (dev SMTP inbox + provider prod) -> se implementa en P3.1
- [x] Preferencias
  - [x] `defaultTasksView` (`board` | `list`) y `defaultTasksScope` (`all` | `assigned` | `created`)
  - [x] Aplicar defaults en `/projects` solo cuando no hay query params
  - [x] Tema (light/dark/system) gestionado desde `Preferencias` (sin toggle en header)
  - [x] Persistencia base con cookie/storage
- [x] Plan/Billing (pre-Stripe)
  - [x] Mostrar plan actual (`Free`) y limites visibles
  - [x] CTA de upgrade (`coming soon`)
  - [x] Dejar base lista para integrar Stripe en fase siguiente

Criterio de cierre:

- Existe panel de usuario util y estable
- Queda preparado el acople con Stripe

### P1.5 Feedback + calidad visual

Tecnologias a usar: shadcn/ui + Radix + patrones de `ActionData`.

- [~] Sistema consistente de feedback
  - [ ] Toasts success/error/warn (`Radix Toast` + estilo `shadcn`)
  - [ ] Mapeo uniforme `formError`/`fieldErrors`
  - [x] Sin redirects silenciosos en `tasks/projects` via API
  - [ ] Extender misma regla a flags/auth/account
- [ ] Base visual consistente
  - [ ] Definir set base de componentes `shadcn/ui` permitidos para todo el producto
  - [ ] Paleta, tipografia, spacing, botones
  - [ ] Jerarquia clara de bloques y acciones
  - [ ] Microinteracciones y estados de carga prolijos

Criterio de cierre:

- La UI se percibe intencional y coherente en todas las vistas principales

## ?? P2 - Escala cliente y calidad tecnica

### P2.1 TanStack Query + Zustand (uso real y profundo)

Tecnologias a usar: TanStack Query + Zustand.

- [ ] Query keys y cache estables por usuario/filtros
- [ ] Refetch en background + invalidacion por mutaciones
- [ ] Prefetch de vistas clave
- [ ] Optimistic updates con rollback confiable
- [ ] Estrategia de adopcion de TanStack Query (CTO-level)
  - [x] `Query` para lecturas cliente transversales (primera fase: `/api/notifications` en header)
  - [x] Migrar mutaciones criticas a API dedicada por dominio (sin dependencia de route actions UI)
  - [ ] Evitar doble fuente de verdad por flujo (no mezclar para el mismo caso `loader` y `query` sin contrato)
  - [ ] Expandir `Query` por slices completos (no migracion parcial caotica)
  - [ ] Documentar query keys por dominio (`notifications`, `tasks`, `projects`, `flags`, `auth`, `account`) y sus reglas de invalidacion
- [ ] Mapa de uso por tecnologia (decision-complete)
  - [~] Query se usa para lecturas transversales y cache/polling de forma selectiva (`notifications`, luego `team feed/lists` donde aporte)
  - [ ] Zustand se usa para estado UI global (sin prop drilling)
    - [ ] `taskDetailModalStore`: `selectedTaskId`, `isTaskModalOpen`
    - [ ] `teamsPanelStore`: `activeTeamId`, `activeTab` (`members|invites|projects`), filtros UI locales
    - [ ] `notificationsPanelStore`: `unreadCount`, `panelOpen`, `selectedNotificationId`
  - [x] Loader/Action queda como backbone para mutaciones y permisos (`auth`, `tasks`, `flags`, `team`)
  - [x] Regla base: lecturas por `loader` por defecto; `useQuery` solo cuando hay ganancia real de UX/caching
  - [ ] Regla: no duplicar fuente de verdad del mismo flujo entre Query y loader/action
- [ ] Fase 1 Query (implementacion concreta)
  - [x] `notificationsQuery` con `refetchInterval`, estados de carga/error y cache por usuario
  - [x] Header consume `useQuery` (sin `fetch` manual en `useEffect`)
  - [x] Definir TTL/staleTime y politica de reintento para notificaciones
- [ ] Fase 2 Query (opcional, segun valor real)
  - [ ] Evaluar feed de actividad del Hub con `useQuery`
  - [ ] Solo migrar lecturas de `tasks` si mejora UX/costo de mantenimiento frente a loader actual
  - [ ] Implementar `Teams panel` con multiples listas remotas (caso de uso prioritario para Query)
    - [ ] `myTeamsQuery`
    - [ ] `teamMembersQuery(teamId)` con separados `pending` y `accepted`
    - [ ] `teamInvitationsQuery(teamId)`
    - [ ] `teamProjectsQuery(teamId)`
    - [ ] (opcional) `teamActivityQuery(teamId)`
    - [ ] Invalidacion selectiva por evento (`invite`, `accept`, `reject`, `project-create`) sin recargar toda la pantalla
    - [ ] Estados por bloque (`loading/error/success`) independientes por lista
- [ ] Store global de UI/preferencias/seleccion masiva
- [ ] Store de preferencias reales (`defaultTasksView`, `defaultTasksScope`)
- [~] Estado global de task seleccionada/modal abierto
  - [x] Migrar apertura de modal de task (hoy por props) a store global
  - [ ] Permitir abrir el mismo modal desde card, notificacion y sidebar sin acople entre componentes
- [ ] Estado de notificaciones leidas/no leidas en cliente (Zustand)
  - [ ] Store `notifications`: `items`, `lastSeenAtByUser`, `unreadCount`, `selectedNotificationId`
  - [ ] Hidratacion desde `/api/notifications` y badge de header derivado del store
  - [ ] Marcar como leida al abrir panel o click en item
- [ ] Notificaciones clickeables: abrir modal de task desde campana
  - [ ] Payload de notificacion incluye `taskId` cuando corresponde
  - [ ] Click en notificacion abre `Task Detail Modal` de esa task y cierra el panel
  - [ ] Fallback sin `taskId` a vista de actividad/projects
- [ ] Cola local de acciones pendientes con reintento manual
- [ ] Sincronia URL <-> store <-> query keys
- [~] API por accion (proxima ola para compatibilidad total con Query)
  - [x] Fase A: endpoints API para todos los dominios (`auth`, `account`, `flags`, `projects`, `tasks`)
  - [x] Fase B: reemplazar `intent` por rutas explicitas por mutacion
    - [x] Tasks: `POST /api/tasks/create|update|delete|reorder-column`
    - [x] Task comments: `POST /api/task-comments/create|update|delete`
    - [x] Projects: `POST /api/projects/create|delete`
    - [x] Flags: `POST /api/flags/create|toggle|update-state|delete`
    - [x] Auth/Account: endpoints de accion por flujo
  - [x] Fase C: migrar mutaciones de todos los dominios a `useMutation` (React Query full)

Criterio de cierre:

- Query + store se usan en codigo productivo real, no demo
- Mejoran UX y rendimiento de forma visible

### P2.2 Minimo de calidad tecnica

Tecnologias a usar: Vitest + Testing Library + Playwright.

- [ ] Lint y typecheck en limpio
- [ ] Smoke script auth + tasks + flags
- [ ] Logging consistente de errores en server actions
- [ ] Base de unit/integration tests
- [ ] E2E minimos:
  - [ ] `login -> create task -> assign -> mover board -> cerrar`
  - [ ] `create flag -> toggle`

Criterio de cierre:

- Release checklist ejecutable en menos de 10 minutos

### P2.3 Documentacion operativa

Tecnologias a usar: README + docs internos.

- [ ] README alineado con scripts/rutas reales
- [ ] `docs/PRODUCT.md` actualizado al estado actual
- [ ] Guia corta: debug de actions, errores y smoke local

Criterio de cierre:

- La documentacion refleja el estado real del proyecto

## ?? P3 - Integraciones externas y automatizacion

### P3.1 Stripe (billing didactico) + Team Manager

Tecnologias a usar: Stripe API + webhooks + dominio de equipos (DB + permisos server).

- [ ] Modelo de planes y limites (`free`/`pro`) con enfoque didactico (portfolio)
- [ ] Flujo checkout de upgrade
- [ ] Webhooks (`checkout.session.completed`, `customer.subscription.*`) con idempotencia
- [ ] Persistencia de suscripcion en DB + guards por plan
- [ ] UI de estado de plan, fallos de pago, cancelaciones
- [ ] Infra de email productiva para registro verificado
  - [ ] Adapter SMTP para desarrollo (dev inbox)
  - [ ] Adapter provider para produccion
  - [ ] Seleccion por entorno sin cambiar la logica de verificacion
- [ ] Capacidad de producto ligada al plan
  - [ ] Upgrade a `pro` habilita capacidad `manager`
  - [ ] Fuente de verdad de permisos por plan en server
- [ ] Dominio Team (v1)
  - [ ] `teams`: `id`, `ownerUserId`, `name`, timestamps
  - [ ] `team_members`: `teamId`, `userId`, `status` (`invited|accepted|rejected`), `invitedBy`, `respondedAt`
  - [ ] Restriccion v1: un usuario en un solo equipo activo
  - [ ] Soportar multi-equipo por manager (manager puede administrar mas de un equipo)
- [ ] Flujo de invitaciones de equipo
  - [ ] Manager busca por email exacto e invita
  - [ ] Invitacion se entrega por notificacion in-app (sin email de invitacion)
  - [ ] Invitado acepta/rechaza
  - [ ] Solo `accepted` entra en equipo activo
- [ ] Contexto de trabajo en Tasks: personal vs equipo
  - [ ] Usuario free puede operar en workspace personal sin crear equipo
  - [ ] Usuario free puede ser invitado a equipos (sin capacidad de administrar)
  - [ ] Al aceptar invitacion, habilitar vista de miembros/proyectos del equipo
  - [ ] Un usuario puede tener proyectos personales y proyectos de equipo en paralelo
  - [ ] El mismo usuario puede tener permisos distintos segun proyecto/contexto
- [ ] Reglas de asignacion por equipo
  - [ ] Manager solo asigna tasks a miembros `accepted` de su equipo
  - [ ] UI de assignee filtra candidatos por miembros aceptados
- [ ] Permisos por proyecto dentro del equipo (ACL v1)
  - [ ] Definir `project_members` con rol por proyecto: `viewer | member | full`
  - [ ] `viewer`: solo lectura (sin crear/editar/mover/asignar/comentar)
  - [ ] `member`: crea y opera solo sobre sus propias tasks
  - [ ] `full`: opera sobre cualquier task del proyecto (mover, editar, asignar, comentar)
  - [ ] Un mismo usuario puede tener rol distinto por proyecto
  - [ ] Validacion de permisos en server para cada action (`projectId + userId + role`)
- [ ] Filtros de tareas por equipo/miembro
  - [ ] `Todas del equipo`
  - [ ] `Mias`
  - [ ] `Por miembro` (usuario especifico del equipo)
- [ ] Panel Team Manager
  - [ ] Lista de miembros aceptados y pendientes
  - [ ] Card de miembro clickeable a perfil publico
  - [ ] Vista por equipo dentro de `Teams`: miembros `pending` y `accepted`
  - [ ] Crear equipo desde dropdown/panel `Teams`
  - [ ] Invitar miembros por email exacto desde cada equipo
- [ ] Notificaciones de equipo
  - [ ] Invitacion enviada (al invitado)
  - [ ] Invitacion aceptada/rechazada (al manager)
  - [ ] Payload con `teamId` y navegacion segura
- [ ] Regla de canales de comunicacion
  - [ ] Email solo para verificacion de registro
  - [ ] Invitaciones de equipo solo por notificaciones in-app
- [ ] Casos de aceptacion (Team/Billing)
  - [ ] Upgrade habilita capacidad manager
  - [ ] Invitacion por email exacto funciona y cambia estado correctamente
  - [ ] Usuario fuera de equipo no puede ser asignado por manager
  - [ ] Miembro accepted si puede ser asignado
  - [ ] Click en notificacion de team/task navega al destino correcto o fallback seguro

Criterio de cierre:

- El ciclo de suscripcion queda sincronizado y usable de punta a punta
- Plan impacta permisos y colaboracion real (no solo badge visual)

### P3.2 Slack API (notificaciones operativas)

Tecnologias a usar: Slack API / Incoming Webhooks.

- [ ] Canal de notificaciones por severidad
- [ ] Eventos clave de negocio y errores severos (sin logica de Team embebida en Slack)
- [ ] Formato estandar de mensaje (actor, recurso, accion, resultado)
- [ ] Control de ruido (throttling/filtros)

Criterio de cierre:

- Las notificaciones son utiles y no spam

### P3.3 Gemini AI API (asistente de productividad)

Tecnologias a usar: Gemini API + Zod.

- [ ] Endpoint server para sugerencias de tasks/subtareas
- [ ] Accion UI: sugerir subtareas desde descripcion
- [ ] Validacion estricta de salida con schema
- [ ] Fallback seguro + logging de errores/latencia
- [ ] Sin mezclar reglas de Team/Billing en prompts o contrato de IA

Criterio de cierre:

- La funcionalidad IA agrega valor sin romper flujos por respuestas invalidas

### P3.4 GitHub Actions (cierre de flujo de calidad)

Tecnologias a usar: GitHub Actions.

- [ ] CI para PR: lint + typecheck + test + e2e smoke
- [ ] Workflow de release con build y artefactos
- [ ] Branch protection con checks obligatorios
- [ ] Documentacion de CI/CD en README

Criterio de cierre:

- Cada PR/release queda validado automaticamente

### P3.5 Feature Flags como control de rollout (cierre)

Tecnologias a usar: Flags module actual + guards UI/server + rollout por entorno/rol.

- [ ] Definir politica de flag-gating para features no criticas (opt-in y rollback rapido)
- [ ] Acordar catalogo y convencion de flags (decision de equipo)
  - [ ] Naming final: `dominio.area.feature.enabled` (ej: `tasks.sidebar.projects.pinned.enabled`)
  - [ ] Ubicacion unica del catalogo en `app/core/flags/catalog/flag-catalog.ts`
  - [ ] Wire de resolucion/runtime en `app/core/flags/service/flags.resolution.ts`
  - [ ] Providers de persistencia en `app/infra/flags/*` (sin hardcodear flags en features)
  - [ ] Cada flag documenta: objetivo, fallback cuando esta `off`, owner y fecha de revision
- [ ] Agregar flags a funcionalidades opcionales de Tasks (sin romper base funcional)
  - [ ] `tasks.search.enabled`
  - [ ] `tasks.scope-filter.enabled`
  - [ ] `tasks.sidebar.projects.pinned.enabled`
  - [ ] `tasks.sidebar.projects.manual-order.enabled`
  - [ ] `tasks.sidebar.projects.icons.enabled`
  - [ ] `tasks.sidebar.teams.enabled`
  - [ ] `tasks.sidebar.flags.enabled`
- [ ] Regla de implementacion
  - [ ] Si flag `off`, la pantalla sigue operativa con fallback simple
  - [ ] Sin ramas de codigo duplicadas por feature (encapsular en componentes/guards)
  - [ ] Validar tambien en server cuando la accion dependa de feature opcional
- [ ] Administracion y observabilidad de flags
  - [ ] Exponer toggles de estas flags para admin
  - [ ] Definir defaults por entorno (`dev` permisivo, `prod` conservador)
  - [ ] Registrar cambios relevantes de flags en historial/notificaciones operativas

Criterio de cierre:

- Flags dejan de ser accesorio y pasan a ser herramienta real de rollout
- Se puede encender/apagar features opcionales sin romper UX base

## ??? Orden sugerido de ejecucion

1. Cerrar `P0.1` pendiente (QA manual de tasks).
2. Ejecutar `P1.1` a `P1.5` (producto tasks-first).
3. Ejecutar `P2.1` (TanStack Query + Zustand real).
4. Ejecutar `P2.2` y `P2.3` (calidad + docs).
5. Ejecutar `P3.1` a `P3.5` (integraciones + automatizacion + rollout controlado).

Nota de replanificacion:
- El corrimiento diario del calendario operativo se gestiona en `docs/INTERNAL_DELIVERY_PLAN.md`.
- El orden de roadmap por fases (`P0 -> P1 -> P2 -> P3`) se mantiene igual.

