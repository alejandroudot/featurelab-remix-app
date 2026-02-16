# PROXIMAS TAREAS (Pulido MVP + MVP+1)

Este documento es la lista activa de ejecucion.

## Leyenda

- `[ ]` pendiente
- `[~]` en progreso
- `[x]` listo

## Direccion del producto (alineada)

- Foco principal: `Tasks` y colaboracion entre usuarios.
- Flags: se mantienen como modulo de soporte (sin ampliar demasiado alcance funcional).
- Vistas target del producto:
  - Home: `Execution Hub` (`/`)
  - `Tasks` (List + Board)
  - `Flags`
  - `User Panel` (`/account` o `/settings`)
  - `Billing/Plan` (inicialmente dentro de User Panel)

## Base ya implementada (tracking historico)

- [x] Auth con sesiones y control por rol (`requireUser`/`requireAdmin`)
- [x] Tasks CRUD basico (list, create, update, delete) con validacion Zod
- [x] Flags admin (list, create, toggle, delete, rollout update)
- [x] Rutas como orquestadores + logica de intents en `app/features/*/server/*`
- [x] Manejo de errores de actions con `fieldErrors` / `formError` / `values`
- [x] Persistencia local con SQLite + Drizzle
- [x] Resolucion de flag integrada en flujo de tasks (`beta-tasks-ui`)

## P0 - Estabilidad y consistencia

### P0.1 Endurecer flujo de tasks

- [x] Persistir valores del formulario al fallar validacion en crear task
- [x] Agregar render de `formError` global en el formulario de crear task
- [x] Asegurar que todos los errores de actions de tasks sean visibles en UI
- [~] Validar manualmente create/update/delete con payloads invalidos
  - [x] Validacion estatica de create: `task.action.ts` devuelve `fieldErrors` y `values` en invalidacion
  - [x] Validacion estatica de create: `CreateTaskForm.tsx` renderiza error global y preserva `defaultValue`
  - [x] Validacion estatica de update/delete: `task.action.ts` usa `validationToActionData` y `jsonTaskError`
  - [x] Validacion estatica de intent invalido: `tasks/server/utils.ts` devuelve `fieldErrors.intent` y `values`
  - [ ] Validacion manual runtime en browser (casos invalidos + no silencios)

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

## P1 - Producto (Tasks-first)

### P1.1 Home como Execution Hub

Tecnologias a usar: React Router + TanStack Query + Zustand.

- [ ] Crear Home (`/`) como `Execution Hub`
  - [ ] Definir layout de dashboard (resumen, actividad, quick actions)
  - [ ] Mostrar metricas clave de tasks (to do, in progress, qa, ready)
  - [ ] Mostrar resumen de flags (solo estado operativo basico)
- [ ] Agregar panel de actividad reciente
  - [ ] Eventos minimos: task creada/editada/reasignada/cerrada
  - [ ] Mostrar actor + timestamp + accion
- [ ] Agregar quick actions
  - [ ] Crear task
  - [ ] Ir a board
  - [ ] Ir a flags
- [ ] Agregar toggle de dark mode en Hub (UI facherita y visible)
  - [ ] Mostrar switch en header del Hub
  - [ ] Persistir preferencia de tema por usuario (Zustand + storage)
  - [ ] Aplicar tema sin salto visual al recargar
- [ ] Agregar bloque `Feature Switches` (solo admin) en Hub
  - [ ] Mostrar toggles de flags clave con estado actual
  - [ ] Permitir prender/apagar desde Hub con feedback inmediato
  - [ ] Respetar permisos: solo admins pueden cambiar flags
- [ ] Bootstrap de flags iniciales para darle sentido al modulo de flags
  - [ ] `execution-hub-enabled`
  - [ ] `hub-activity-feed-enabled`
  - [ ] `tasks-board-enabled`
  - [ ] `tasks-comments-enabled`
  - [ ] `tasks-checklist-enabled`
  - [ ] `tasks-ai-suggestions-enabled`
  - [ ] `billing-enabled`
  - [ ] `slack-notifications-enabled`
- [ ] Definir comportamiento por environment para flags iniciales
  - [ ] `development`: defaults mas permissivos para probar features
  - [ ] `production`: defaults conservadores para release gradual

Criterio de cierre:

- La Home deja de ser placeholder y funciona como centro de control
- El usuario puede decidir y actuar rapido desde una sola vista
- Flags tiene uso visible y cotidiano dentro del producto

### P1.2 Tasks UX (List + Board estilo Jira)

Tecnologias a usar: Zod (query params) + React Router + DnD + Radix UI.

- [ ] Definir direccion UX para `/tasks`
  - [ ] Estilo visual elegido y consistente
  - [ ] Prioridades de lectura claras en pantalla
  - [ ] Copy de acciones coherente
- [ ] Filtros y orden via URL
  - [ ] Params: `status`, `priority`, `assignee`, `sort`
  - [ ] Validacion con Zod + defaults seguros
  - [ ] Persistencia de estado al navegar/recargar
- [ ] Estados vacios y feedback de interaccion
  - [ ] Estado vacio global
  - [ ] Estado vacio por filtro
  - [ ] CTA clara para crear task o limpiar filtros
- [ ] Vista Board tipo Jira en `/tasks`
  - [ ] Columnas: `To Do`, `In Progress`, `QA`, `Ready to Go Live`
  - [ ] Toggle `List` / `Board`
  - [ ] Drag and drop entre columnas
  - [ ] Update optimista al mover cards
  - [ ] Card de task con prioridad, labels, responsable, metadata minima
  - [ ] Edicion rapida desde card
  - [ ] Responsive real (desktop/mobile)

Criterio de cierre:

- Tasks funciona bien en modo lista y tablero
- La UX se siente de producto real, no de CRUD basico

### P1.3 Colaboracion y asignaciones (foco principal)

Tecnologias a usar: Drizzle/SQLite + React Router + Zod + Zustand + TanStack Query.

- [ ] Modelo de asignacion
  - [ ] Agregar `assigneeId` (nullable)
  - [ ] Soportar `Unassigned`
  - [ ] Ajustar schemas create/update
- [ ] Flujo de asignacion/reasignacion
  - [ ] Selector de responsable en create/edit
  - [ ] Reasignacion rapida desde board
  - [ ] Responsable visible en list y board
- [ ] Vistas de trabajo por usuario
  - [ ] `Asignadas a mi`
  - [ ] `Creadas por mi`
  - [ ] `Todas`
- [ ] Permisos y reglas
  - [ ] Definir quien puede editar/reasignar/cerrar
  - [ ] Validar permisos en server actions
  - [ ] Mensajes claros en acciones no permitidas
- [ ] Trazabilidad y notificaciones
  - [ ] Historial de cambios por task
  - [ ] Notificaciones in-app por asignacion/reasignacion
  - [ ] Preparar hook para Slack
- [ ] Enriquecer task para valor de producto
  - [ ] `dueDate` + overdue
  - [ ] labels/tags
  - [ ] checklist/subtareas
  - [ ] comentarios
  - [ ] plantillas rapidas

Criterio de cierre:

- El producto soporta trabajo colaborativo real sobre tasks
- Asignaciones, permisos e historial quedan claros para el usuario

### P1.4 User Panel (`/account` o `/settings`)

Tecnologias a usar: React Router + Zod + Radix UI + Zustand.

- [ ] Crear vista dedicada de cuenta
  - [ ] Bloques: Perfil, Seguridad, Preferencias, Plan
  - [ ] Navegacion visible desde header
- [ ] Perfil y seguridad
  - [ ] Editar nombre visible
  - [ ] Cambio de password
  - [ ] Errores y exito visibles sin silencios
- [ ] Preferencias
  - [ ] Densidad de UI, vista por defecto, preferencias de trabajo
  - [ ] Tema (light/dark/system) con sincronizacion a toggle del Hub
  - [ ] Persistencia con Zustand + storage
- [ ] Plan/Billing (pre-Stripe)
  - [ ] Mostrar plan actual y limites
  - [ ] CTA de upgrade

Criterio de cierre:

- Existe panel de usuario util y estable
- Queda preparado el acople con Stripe

### P1.5 Feedback + calidad visual

Tecnologias a usar: Radix UI + patrones de `ActionData`.

- [ ] Sistema consistente de feedback
  - [ ] Toasts success/error/warn
  - [ ] Mapeo uniforme `formError`/`fieldErrors`
  - [ ] Sin redirects silenciosos en errores
- [ ] Base visual consistente
  - [ ] Paleta, tipografia, spacing, botones
  - [ ] Jerarquia clara de bloques y acciones
  - [ ] Microinteracciones y estados de carga prolijos

Criterio de cierre:

- La UI se percibe intencional y coherente en todas las vistas principales

## P2 - Escala cliente y calidad tecnica

### P2.1 TanStack Query + Zustand (uso real y profundo)

Tecnologias a usar: TanStack Query + Zustand.

- [ ] Query keys y cache estables por usuario/filtros
- [ ] Refetch en background + invalidacion por mutaciones
- [ ] Prefetch de vistas clave
- [ ] Optimistic updates con rollback confiable
- [ ] Store global de UI/preferencias/seleccion masiva
- [ ] Cola local de acciones pendientes con reintento manual
- [ ] Sincronia URL <-> store <-> query keys

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
- [ ] `docs/MVP.md` actualizado al estado actual
- [ ] Guia corta: debug de actions, errores y smoke local

Criterio de cierre:

- La documentacion refleja el estado real del proyecto

## P3 - Integraciones externas y automatizacion

### P3.1 Stripe (billing y planes)

Tecnologias a usar: Stripe API + webhooks.

- [ ] Modelo de planes y limites (`free`/`pro`)
- [ ] Flujo checkout de upgrade
- [ ] Webhooks (`checkout.session.completed`, `customer.subscription.*`) con idempotencia
- [ ] Persistencia de suscripcion en DB + guards por plan
- [ ] UI de estado de plan, fallos de pago, cancelaciones

Criterio de cierre:

- El ciclo de suscripcion queda sincronizado y usable de punta a punta

### P3.2 Slack API (notificaciones operativas)

Tecnologias a usar: Slack API / Incoming Webhooks.

- [ ] Canal de notificaciones por severidad
- [ ] Eventos clave de negocio y errores severos
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

## Orden sugerido de ejecucion

1. Cerrar `P0.1` pendiente (QA manual de tasks).
2. Ejecutar `P1.1` a `P1.5` (producto tasks-first).
3. Ejecutar `P2.1` (TanStack Query + Zustand real).
4. Ejecutar `P2.2` y `P2.3` (calidad + docs).
5. Ejecutar `P3.1` a `P3.4` (integraciones + automatizacion).
