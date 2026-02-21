# ??? Internal Delivery Plan (14 days)
> ?? Plan operativo diario para ejecutar el roadmap sin desorden.

Plan interno de ejecucion.
Inicio: lunes 16/02/2026
Fin: domingo 01/03/2026

Regla de oro: este plan es una division diaria del `docs/PRODUCT_ROADMAP.md`.
No se agregan features fuera de roadmap. No se omiten bullets del roadmap.

## ?? Reglas de trabajo (obligatorias)

- Se cierra un bloque por dia antes de abrir el siguiente.
- Cada dia termina con commit local y nota corta de estado.
- Ultimos 30 minutos: QA manual basico + lista de bugs para el dia siguiente.
- Mantener arquitectura del repo:
  - `routes/*` orquestan
  - `features/*/server/*` concentra logica server
  - `core/*` contratos
  - `infra/*` implementaciones
  - `ui/*` compartidos

## ? DoD diario

- [ ] Lo del dia queda funcional.
- [ ] No se rompen rutas principales (`/`, `/tasks`, `/flags`, auth).
- [ ] Commit local con mensaje claro.
- [ ] Nota diaria (hecho, pendiente, riesgo).

## ?? Metodologia diaria (50/50)

Aplicar en cada dia:

- `Implementa Codex` (boilerplate/plomeria):
  - estructura, wiring, scaffolding, refactors mecanicos, glue code.
  - dejar base funcional lista para que vos metas la logica fina.
- `Completa vos` (implementacion fina/aprendizaje):
  - validaciones clave (ej: Zod), logica central de features y decisiones finas.
  - nuevas tecnologias (ej: Zustand, React Query, DnD): las implementas vos con guia paso a paso.
- `Regla de tecnologia nueva`:
  - Codex no escribe esa logica por vos.
  - Codex frena y te guia con pasos concretos, checklist y criterio de cierre.
- `Checkpoint`:
  - responder 3 preguntas cortas para validar comprension real.

Template para cada dia:

- Implementa Codex:
- Completa vos:
  - [ ] Tarea 1
  - [ ] Tarea 2
  - [ ] Tarea 3 (opcional)
- Checkpoint:
  - [ ] Que va en `route` y que va en `features/*/server/*` hoy?
  - [ ] Cual fue el contrato/validacion clave del dia?
  - [ ] Cual fue el bug o riesgo principal y como se resolvio?

## ?? Prework ya realizado (dias previos al plan de 14 dias)

Esta seccion documenta trabajo real que ya se hizo antes del Dia 1 formal.
Sirve para tracking historico y para entender contexto tecnico/funcional.

### ?? Dia D-6 - Alineacion de base tecnica y alcance inicial

Tecnologias del dia: React Router, TypeScript, Zod, Drizzle/SQLite.

- [x] Revisar estructura del repo y consolidar convencion de arquitectura
  - [x] `routes/*` como orquestador
  - [x] `features/*/server/*` para logica de loader/action e intents
  - [x] `core/*` y `infra/*` para contratos e implementaciones
- [x] Alinear criterios para evitar deuda tecnica temprana
  - [x] separar responsabilidad por capa
  - [x] centralizar parseo de intent y mapeo de errores

### ?? Dia D-5 - Endurecimiento de actions (tasks + flags)

Tecnologias del dia: React Router actions, Zod validation, TypeScript.

- [x] Normalizar flujo de errores y validaciones en tasks
  - [x] `fieldErrors`, `formError`, `values` consistentes
  - [x] persistencia de valores en submit invalido
- [x] Alinear patron de action de tasks con flags
  - [x] helpers comunes de parse/mapeo
  - [x] rutas manteniendose como orquestadores
- [x] Ajuste defensivo en flags para `validationToActionData(error, formData?)`
  - [x] `values` queda `undefined` cuando no hay `formData`

### ?? Dia D-4 - Definicion de direccion de producto

Tecnologias del dia: product discovery, modelado funcional, documentacion.

- [x] Replantear foco del producto a `Tasks-first` con `Flags` como soporte
- [x] Definir vistas target de producto
  - [x] Execution Hub (`/`)
  - [x] Tasks list + board
  - [x] Flags
  - [x] User Panel
- [x] Definir expansion funcional para colaboracion real
  - [x] asignaciones de responsables
  - [x] permisos
  - [x] trazabilidad y notificaciones

### ?? Dia D-3 - Armado de roadmap y stack

Tecnologias del dia: planning de producto, stack strategy.

- [x] Crear roadmap principal por fases (`P0`, `P1`, `P2`, `P3`)
- [x] Integrar tecnologias objetivo del proyecto de estudio
  - [x] Zustand (uso real)
  - [x] TanStack Query (cache y mutaciones)
  - [x] shadcn/ui + Radix UI (rol claro por componente)
  - [x] Vitest, Testing Library, Playwright
  - [x] Stripe, Slack API, Gemini API, GitHub Actions
- [x] Refinar bullets del roadmap para que cada tarea sea accionable

### ?? Dia D-2 - Plan interno de entrega por dia

Tecnologias del dia: delivery planning, control de avance.

- [x] Crear `docs/INTERNAL_DELIVERY_PLAN.md` dia por dia con fechas
- [x] Alinear cada dia con bullets del roadmap
- [x] Agregar tecnologias por dia para aprendizaje dirigido
- [x] Definir metodologia de trabajo 50/50 (Codex implementa / vos completas)

### ?? Dia D-1 - Plan interno de estudio y metodologia con IA

Tecnologias del dia: learning workflow, active recall, debugging practice.

- [x] Crear `docs/INTERNAL_STUDY_PLAN.md`
- [x] Definir rutina de estudio post-coding (60-90 min)
  - [x] explicacion oral
  - [x] lectura guiada de archivos clave
  - [x] mini reescritura sin mirar
  - [x] debug intencional
  - [x] cierre diario estructurado
- [x] Definir prompt diario para reutilizar metodologia con IA
- [x] Objetivo explicitado:
  - [x] armado de plan de estudio y arquitectura consultado con IA + tu experiencia
  - [x] priorizar comprension real y consistencia tecnica

### ?? Dia D0 - Setup de ejecucion del Dia 1 (inicio tecnico en Home)

Tecnologias del dia: React Router loaders/actions, TypeScript typing, services.

- [x] Iniciar ejecucion del bloque Home (`Execution Hub`)
- [x] Refactor de `home` route para mantener patron del repo
  - [x] `home.loader.ts` y `home.action.ts` en `features/home/server`
  - [x] route como capa de orquestacion
- [x] Corregir errores iniciales detectados (`flagsSummary`, tipos de environment)

## ?? Dia 1 - Lunes 16/02/2026

Tecnologias del dia: React Router, TypeScript, Tailwind, flags service.
Fuente roadmap: [P1.1 inicio (Crear Home)](./PRODUCT_ROADMAP.md#L86), [P1.1 panel actividad](./PRODUCT_ROADMAP.md#L91), [P1.1 quick actions](./PRODUCT_ROADMAP.md#L94).

- [x] Crear Home (`/`) como `Execution Hub`
  - [x] Definir layout de dashboard (resumen, actividad, quick actions)
  - [x] Mostrar metricas clave de tasks (to do, in progress, qa, ready)
  - [x] Mostrar resumen de flags (solo estado operativo basico)
- [x] Agregar panel de actividad reciente
  - [x] Eventos base: task creada/editada/cerrada
  - [ ] Evento `reasignada` (se completa al implementar asignaciones en P1.3)
  - [x] Mostrar actor + timestamp + accion
  - [x] Ajustar copy de accion a `ha creado` / `ha actualizado` / `ha cerrado`
- [x] Agregar quick actions
  - [x] Crear task
  - [x] Ir a board
  - [x] Ir a flags

## ?? Dia 2 - Martes 17/02/2026

Tecnologias del dia: shadcn/ui (Card, Badge, Button, Separator, Switch, Tooltip), Radix Toast.
Fuente roadmap: [P1.1 kit visual Hub](./PRODUCT_ROADMAP.md#L98), [P1.1 dark mode](./PRODUCT_ROADMAP.md#L100), [P1.1 feature switches](./PRODUCT_ROADMAP.md#L105).

- [x] Aplicar kit visual del Hub con `shadcn/ui`
  - [x] `Card`, `Badge`, `Button`, `Separator`
- [x] Evolucionar quick action de `Crear task` en Hub
  - [x] Abrir formulario en `Dialog` o `Sheet` (shadcn/ui)
  - [x] Reusar action/validaciones de tasks (sin duplicar logica)
  - [x] Mantener fallback por link a `/tasks#create-task`
- [x] Agregar toggle de dark mode en Hub (UI facherita y visible)
  - [x] Mostrar switch en header del Hub
  - [x] Implementar switch con `shadcn/ui` (`Switch`)
  - [x] Persistir preferencia de tema por usuario (Zustand + storage)
  - [x] Aplicar tema sin salto visual al recargar
- [x] Agregar bloque `Feature Switches` (solo admin) en Hub
  - [x] Mostrar toggles de flags clave con estado actual
  - [x] Implementar panel con `shadcn/ui` (`Card`, `Switch`, `Tooltip`)
  - [x] Permitir prender/apagar desde Hub con feedback inmediato
  - [x] Usar `Radix Toast` para feedback de toggle exitoso/error
  - [x] Respetar permisos: solo admins pueden cambiar flags

## ?? Dia 3 - Miercoles 18/02/2026

Tecnologias del dia: flags repository/service, SQLite/Drizzle, environment config.
Fuente roadmap: [P1.1 bootstrap flags](./PRODUCT_ROADMAP.md#L111), [P1.1 behavior por environment](./PRODUCT_ROADMAP.md#L120).

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

## ?? Dia 4 - Jueves 19/02/2026

Tecnologias del dia: UX definition, board behavior rules, Zod (query params minimos), React Router loaders.
Fuente roadmap: [P1.2 direccion UX](./PRODUCT_ROADMAP.md#L134), [P1.2 comportamiento de orden](./PRODUCT_ROADMAP.md#L138), [P1.2 URL soporte de vista](./PRODUCT_ROADMAP.md#L142).

- [x] Definir direccion UX para `/tasks`
  - [x] Estilo visual elegido y consistente
  - [x] Prioridades de lectura claras en pantalla
  - [x] Copy de acciones coherente
- [x] Definir comportamiento de orden en board por columna
  - [x] Modo `manual` por defecto (orden libre con DnD vertical)
  - [x] Modo `prioridad` (`critical`, `high`, `medium`, `low`)
- [x] URL como soporte de estado de vista (minimo)
  - [x] Params: `view`, `order`
  - [x] Validacion con Zod + defaults seguros
  - [x] Persistencia de estado al navegar/recargar
- [x] Estados vacios y feedback de interaccion
  - [x] Estado vacio global
  - [x] Estado vacio por columna
  - [x] CTA clara para crear task o limpiar configuracion de vista

## ?? Dia 5 - Viernes 20/02/2026

Tecnologias del dia: DnD, shadcn/ui (Tabs/ToggleGroup/Card/Avatar/DropdownMenu), Radix AlertDialog.
Fuente roadmap: [P1.2 board base](./PRODUCT_ROADMAP.md#L147).

- [x] Vista Board tipo Jira en `/tasks`
  - [x] Columnas: `To Do`, `In Progress`, `QA`, `Ready to Go Live`
  - [x] Crear task entra en `To Do` por defecto
  - [x] Toggle `List` / `Board`
  - [x] Toggle de vista con `shadcn/ui` (`Tabs` o `ToggleGroup`)
  - [x] Card de task con prioridad, labels, responsable, metadata minima
  - [x] Card construida con `shadcn/ui` (`Card`, `Badge`, `Avatar`, `DropdownMenu`)
  - [x] Abrir detalle de task al clickear card/fila (modal/sheet estilo Jira)
  - [x] Detalle con layout simple: contenido principal + comentarios abajo + panel lateral
  - [x] Panel lateral con acciones rapidas: cambiar `status` y `priority`
  - [x] Panel lateral con accion rapida de `assignee`
  - [x] Mantener contexto al abrir detalle (filtros, vista y scroll)
  - [x] Edicion rapida desde modal de detalle (sin edicion inline en card)
  - [x] Regla de actualizacion de prioridad desde interacciones del board
    - [x] DnD entre columnas cambia `status`
    - [x] DnD vertical en modo `manual` solo cambia orden visual/manual
    - [x] `priority` no cambia por DnD (ni horizontal ni vertical)
    - [x] `priority` se edita solo desde modal de detalle
    - [x] Vista `manual`: respeta orden de usuario aunque haya `low` arriba y `critical` abajo
    - [x] Vista `prioridad`: ordena por `critical` > `high` > `medium` > `low`
  - [x] Usar `Radix AlertDialog` para acciones destructivas desde card
  - [x] Responsive real (desktop/mobile)

## ?? Dia 6 - Sabado 21/02/2026

Tecnologias del dia: DnD + TanStack Query (optimistic updates/rollback).
Fuente roadmap: [P1.2 board base (DnD/optimistic)](./PRODUCT_ROADMAP.md#L147).

- [ ] Vista Board tipo Jira en `/tasks`
  - [ ] Drag and drop entre columnas
  - [ ] Drag and drop vertical dentro de columna
  - [ ] Update optimista al mover cards (horizontal y vertical)

## ?? Dia 7 - Domingo 22/02/2026

Tecnologias del dia: Drizzle/SQLite, Zod, React forms.
Fuente roadmap: [P1.3 modelo asignacion](./PRODUCT_ROADMAP.md#L168), [P1.3 flujo asignacion](./PRODUCT_ROADMAP.md#L172).

- [ ] Modelo de asignacion
  - [x] Agregar `assigneeId` (nullable)
  - [x] Soportar `Unassigned`
  - [x] Ajustar schemas create/update
- [ ] Flujo de asignacion/reasignacion
  - [ ] Selector de responsable en create/edit
  - [ ] Reasignacion rapida desde board
  - [x] Reasignacion rapida de `assignee` desde el panel lateral del detalle de task
  - [x] Responsable visible en list y board

## ?? Dia 8 - Lunes 23/02/2026

Tecnologias del dia: auth/roles, server actions, filtros por usuario.
Fuente roadmap: [P1.3 vistas por usuario](./PRODUCT_ROADMAP.md#L176), [P1.3 permisos/reglas](./PRODUCT_ROADMAP.md#L180).

- [ ] Vistas de trabajo por usuario
  - [ ] `Asignadas a mi`
  - [ ] `Creadas por mi`
  - [ ] `Todas`
- [ ] Permisos y reglas
  - [ ] Definir quien puede editar/reasignar/cerrar
  - [ ] Validar permisos en server actions
  - [ ] Mensajes claros en acciones no permitidas

## ?? Dia 9 - Martes 24/02/2026

Tecnologias del dia: timeline UI, notifications UI, modelado de eventos.
Fuente roadmap: [P1.3 trazabilidad/notificaciones](./PRODUCT_ROADMAP.md#L184), [P1.3 enriquecer task](./PRODUCT_ROADMAP.md#L188).

- [ ] Trazabilidad y notificaciones
  - [ ] Historial de cambios por task
  - [ ] Notificaciones in-app por asignacion/reasignacion
  - [ ] Preparar hook para Slack
- [ ] Enriquecer task para valor de producto
  - [ ] `dueDate` + overdue
  - [ ] labels/tags
  - [ ] checklist/subtareas
  - [ ] comentarios
  - [ ] `@menciones` de usuarios en comentarios
  - [ ] adjuntos en comentarios (imagenes + archivos)
  - [ ] plantillas rapidas

## ?? Dia 10 - Miercoles 25/02/2026

Tecnologias del dia: shadcn/ui (Tabs/Card/Form/Input/Button), Zod forms, Zustand preferencias.
Fuente roadmap: [P1.4 user panel](./PRODUCT_ROADMAP.md#L204), [P1.4 perfil/seguridad](./PRODUCT_ROADMAP.md#L208), [P1.4 preferencias](./PRODUCT_ROADMAP.md#L212), [P1.4 plan](./PRODUCT_ROADMAP.md#L216).

- [ ] Crear vista dedicada de cuenta
  - [ ] Bloques: Perfil, Seguridad, Preferencias, Plan
  - [ ] Layout con `shadcn/ui` (`Tabs`, `Card`, `Form`, `Input`, `Button`)
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

## ?? Dia 11 - Jueves 26/02/2026

Tecnologias del dia: Radix Toast + shadcn styling, design tokens.
Fuente roadmap: [P1.5 feedback](./PRODUCT_ROADMAP.md#L229), [P1.5 base visual](./PRODUCT_ROADMAP.md#L233).

- [ ] Sistema consistente de feedback
  - [ ] Toasts success/error/warn (`Radix Toast` + estilo `shadcn`)
  - [ ] Mapeo uniforme `formError`/`fieldErrors`
  - [ ] Sin redirects silenciosos en errores
- [ ] Base visual consistente
  - [ ] Definir set base de componentes `shadcn/ui` permitidos para todo el producto
  - [ ] Paleta, tipografia, spacing, botones
  - [ ] Jerarquia clara de bloques y acciones
  - [ ] Microinteracciones y estados de carga prolijos

## ?? Dia 12 - Viernes 27/02/2026

Tecnologias del dia: TanStack Query + Zustand.
Fuente roadmap: [P2.1 TanStack Query + Zustand](./PRODUCT_ROADMAP.md#L249).

- [ ] Query keys y cache estables por usuario/filtros
- [ ] Refetch en background + invalidacion por mutaciones
- [ ] Prefetch de vistas clave
- [ ] Optimistic updates con rollback confiable
- [ ] Store global de UI/preferencias/seleccion masiva
- [ ] Cola local de acciones pendientes con reintento manual
- [ ] Sincronia URL <-> store <-> query keys

## ?? Dia 13 - Sabado 28/02/2026

Tecnologias del dia: Vitest, Testing Library, Playwright.
Fuente roadmap: [P2.2 minimo calidad tecnica](./PRODUCT_ROADMAP.md#L266).

- [ ] Lint y typecheck en limpio
- [ ] Smoke script auth + tasks + flags
- [ ] Logging consistente de errores en server actions
- [ ] Base de unit/integration tests
- [ ] E2E minimos:
  - [ ] `login -> create task -> assign -> mover board -> cerrar`
  - [ ] `create flag -> toggle`

## ?? Dia 14 - Domingo 01/03/2026

Tecnologias del dia: documentacion operativa, Stripe, Slack API, Gemini API, GitHub Actions.
Fuente roadmap: [P2.3 documentacion](./PRODUCT_ROADMAP.md#L282), [P3.1 stripe](./PRODUCT_ROADMAP.md#L296), [P3.2 slack](./PRODUCT_ROADMAP.md#L310), [P3.3 gemini](./PRODUCT_ROADMAP.md#L323), [P3.4 github actions](./PRODUCT_ROADMAP.md#L336).

- [ ] README alineado con scripts/rutas reales
- [ ] `docs/MVP.md` actualizado al estado actual
- [ ] Guia corta: debug de actions, errores y smoke local
- [ ] Modelo de planes y limites (`free`/`pro`)
- [ ] Flujo checkout de upgrade
- [ ] Webhooks (`checkout.session.completed`, `customer.subscription.*`) con idempotencia
- [ ] Persistencia de suscripcion en DB + guards por plan
- [ ] UI de estado de plan, fallos de pago, cancelaciones
- [ ] Canal de notificaciones por severidad
- [ ] Eventos clave de negocio y errores severos
- [ ] Formato estandar de mensaje (actor, recurso, accion, resultado)
- [ ] Control de ruido (throttling/filtros)
- [ ] Endpoint server para sugerencias de tasks/subtareas
- [ ] Accion UI: sugerir subtareas desde descripcion
- [ ] Validacion estricta de salida con schema
- [ ] Fallback seguro + logging de errores/latencia
- [ ] CI para PR: lint + typecheck + test + e2e smoke
- [ ] Workflow de release con build y artefactos
- [ ] Branch protection con checks obligatorios
- [ ] Documentacion de CI/CD en README

## ?? Template de nota diaria (copiar/pegar)

Dia X - Fecha

- Objetivo del dia:
- Tecnologias del dia:
- Hecho:
- Bloqueado:
- Riesgo:
- Primer tarea de manana:




