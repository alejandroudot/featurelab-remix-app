# ??? Internal Delivery Plan (18 days)
> ?? Plan operativo diario para ejecutar el roadmap sin desorden.

Plan interno de ejecucion.
Inicio: lunes 16/02/2026
Fin: domingo 08/03/2026

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
Fortalece hoy: lectura de arquitectura en runtime, composicion UI base, traduccion de producto a pantalla.

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
Fortalece hoy: sistema visual consistente, feedback UX inmediato, estado global ligero (tema).

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
Fortalece hoy: modelado de configuracion por entorno, defaults seguros, criterio de rollout.

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
Fortalece hoy: decisiones de UX con tradeoffs, contratos de URL/state, validacion defensiva.

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
Fortalece hoy: interacciones complejas en frontend, consistencia visual, flujo de edicion centrado en contexto.

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
  - [x] Edicion inline de titulo y descripcion dentro del modal de detalle (click para editar)
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

Tecnologias del dia: DnD + React Router actions/revalidation (sin Query en esta fase).
Fuente roadmap: [P1.2 board base (DnD/optimistic)](./PRODUCT_ROADMAP.md#L147).
Fortalece hoy: sincronizacion UI-servidor, persistencia con rollback, criterio de fuente de verdad.

- [x] Vista Board tipo Jira en `/tasks`
  - [x] Drag and drop entre columnas
  - [x] Drag and drop vertical dentro de columna
  - [x] Update inmediato en UI al mover cards (horizontal y vertical)
  - [x] Persistencia + rollback via `action` + revalidacion (sin cache duplicada)

## ?? Dia 7 - Domingo 22/02/2026

Tecnologias del dia: Drizzle/SQLite, Zod, React forms.
Fuente roadmap: [P1.3 modelo asignacion](./PRODUCT_ROADMAP.md#L168), [P1.3 flujo asignacion](./PRODUCT_ROADMAP.md#L172).
Fortalece hoy: modelado de dominio colaborativo, cambios de esquema, formularios con reglas de negocio.

- [x] Modelo de asignacion
  - [x] Agregar `assigneeId` (nullable)
  - [x] Soportar `Unassigned`
  - [x] Ajustar schemas create/update
- [x] Flujo de asignacion/reasignacion
  - [x] Sin selector en create (decision de producto)
  - [x] Selector/reasignacion de responsable desde modal de detalle (edit)
  - [x] Sin reasignacion rapida desde board (decision de producto)
  - [x] Reasignacion rapida de `assignee` desde el panel lateral del detalle de task
  - [x] Responsable visible en list y board

## ?? Dia 8 - Lunes 23/02/2026

Tecnologias del dia: auth/roles, server actions, filtros por usuario.
Fuente roadmap: [P1.3 vistas por usuario](./PRODUCT_ROADMAP.md#L176), [P1.3 permisos/reglas](./PRODUCT_ROADMAP.md#L180).
Fortalece hoy: autorizacion server-first, visibilidad por actor, reglas de permisos reales.

Regla de colaboracion acordada para este bloque:
- Las tasks son compartidas entre `creador` y `asignado`.
- Ambos ven la task en `/tasks` (list + board), incluyendo movimientos de estado/orden.
- Si el creador asigna una task, la sigue viendo y monitoreando.
- Si un usuario recibe una task asignada, tambien la ve y la puede trabajar.
- En el `Execution Hub` (`/`) se prioriza actividad/notificaciones de cambios, no listado completo de tasks.

- [x] Vistas de trabajo por usuario
  - [x] `Asignadas a mi`
  - [x] `Creadas por mi`
  - [x] `Todas`
  - [x] Visibilidad de task para creador y asignado (OR en listado)
- [x] Permisos y reglas
  - [x] Definir quien puede editar/reasignar/cerrar
  - [x] Regla acordada: creador con permisos completos
  - [x] Regla acordada: asignado puede editar/status/orden pero no reasignar
  - [x] Validar permisos en server actions
  - [x] Mensajes claros en acciones no permitidas

## ?? Dia 9 - Martes 24/02/2026

Tecnologias del dia: timeline UI, notifications UI, modelado de eventos.
Fuente roadmap: [P1.3 trazabilidad/notificaciones](./PRODUCT_ROADMAP.md#L184), [P1.3 enriquecer task](./PRODUCT_ROADMAP.md#L188).
Fortalece hoy: trazabilidad funcional, eventos de dominio, UX colaborativa avanzada (comentarios/menciones/rich text).

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
  - [x] imagenes embebidas en descripcion con editor rich text (boton + copy/paste)
  - [x] upload por API con validaciones basicas (permiso, tipo imagen, limite 10MB)
  - [x] cleanup de temporales en cancel y al editar contenido (evitar huerfanas)
  - [x] plantillas rapidas
  - [x] create task con descripcion rich text (toolbar + links + listas + imagen embebida)

## ?? Dia 10 - Miercoles 25/02/2026

Tecnologias del dia: TypeScript refactor, arquitectura por capas, limpieza de deuda tecnica, naming conventions, Tiptap (`@tiptap/react` + `starter-kit`, `image`, `link`, `placeholder`, `mention`), API route de upload y storage local para rich text.
Fuente roadmap: [P0 estabilidad/consistencia](./PRODUCT_ROADMAP.md#-p0---estabilidad-y-consistencia), [P1.2/P1.3 hardening tecnico](./PRODUCT_ROADMAP.md#-p12-tasks-ux-board-first-estilo-jiratrello).
Fortalece hoy: refactor estructural, mantenibilidad, disciplina de naming y reduccion de deuda tecnica.

- [x] Refactor general de aplicacion (cleanup day)
  - [x] Eliminar codigo muerto y flujos legacy no usados
  - [x] Unificar naming de funciones, handlers, tipos e intents
  - [x] Reordenar carpetas por responsabilidad real (page/feature/server/core/infra)
  - [x] Reducir componentes gigantes en piezas chicas y legibles
  - [x] Limpiar imports, exports y contratos obsoletos
  - [x] Dejar checklist de deuda tecnica residual (si queda algo)
- [x] Hardening de editor rich text
  - [x] Flujo estable de imagen embebida (boton + copy/paste)
  - [x] Upload de imagen embebida via API (`/api/tasks/attachments`) con validaciones de permiso, tipo y tamano
  - [x] Preview local estable y reemplazo por URL final sin parpadeos rotos
  - [x] Definir politica de lifecycle de archivos (cancelacion/cleanup) para evitar basura en storage
  - [x] Documentar limite tecnico de archivos (tipos soportados + max size)
  - [x] Sin persistencia accidental de logica legacy de adjuntos
  - [x] UX consistente en preview/guardado/cancelacion
  - [x] Mensionador estable: replace correcto del token, navegacion con teclado y cierre por click afuera

## ?? Dia 11 - Domingo 01/03/2026

Tecnologias del dia: React Router actions/loaders + shadcn/ui (Tabs/Card/Form/Input/Button) + Zod forms.
Fuente roadmap: [P1.4 user panel](./PRODUCT_ROADMAP.md#L204), [P1.4 perfil/seguridad](./PRODUCT_ROADMAP.md#L208), [P1.4 preferencias](./PRODUCT_ROADMAP.md#L212), [P1.4 plan](./PRODUCT_ROADMAP.md#L216).
Fortalece hoy: auth hardening, seguridad de credenciales, diseno de panel de usuario orientado a producto.

- [x] Crear vista dedicada de cuenta (corrida desde Dia 10)
  - [x] Bloques: Perfil, Seguridad, Preferencias, Plan
  - [x] Layout con `shadcn/ui` (`Card`, `Form`, `Input`, `Button`, `Dialog`) con patron `resumen en cards + modal`
  - [x] Navegacion visible desde header
- [x] Patron de interaccion del panel (acuerdo UX)
  - [x] `Perfil`, `Preferencias` y `Plan` se abren en modal dedicado
  - [x] `Seguridad` tambien se abre en modal dedicado (ajuste UX)
  - [x] Vista principal de `/account` queda como resumen + accion `Editar/Abrir`
  - [x] Definir orden de implementacion modal por modal (primero `Perfil`)
- [x] Perfil y seguridad
  - [x] Editar nombre visible
  - [x] Cambio de password
  - [x] Errores y exito visibles sin silencios
  - [x] Modal de `Perfil` estilo ficha (header con avatar + nombre + email)
  - [x] `Perfil` v1 persistente: `displayName` + `phone` + `about`
  - [x] `Perfil` v1 visual-only: `Work`, `Expertise`, `Location`, `Other` como placeholders claros
  - [x] `Seguridad` v1: toggle mostrar/ocultar password por campo
  - [x] `Seguridad` v1: validar `newPassword === confirmPassword` en cliente y server
  - [x] `Seguridad` v1: policy de password fuerte (unica para todo auth)
  - [x] Reusar policy de password en `register` y `change password` (sin duplicar reglas)
  - [x] Mensajeria inline clara por campo (`current`, `new`, `confirm`) + error global
- [x] Hardening de auth (register/login/account)
  - [x] Definir schema compartido de password (min length + upper + lower + number + symbol + sin espacios)
  - [x] Evitar duplicacion de regex/policy entre features de auth
  - [x] Register: agregar `confirmEmail` y validar `email === confirmEmail` (cliente + server)
  - [x] Ampliar `register` para precargar perfil (`displayName` requerido, `phone` opcional, `timezone` opcional)
  - [x] Mantener `login` con validacion minima de credenciales (sin sobrecargar UX)
  - [x] Revisar output safety: no loggear passwords y mantener validacion/sanitizacion por Zod
- [~] Auth verification foundation (email real por link)
  - [x] Crear entidad `email_verification_tokens` (`userId`, `tokenHash`, `expiresAt`, `usedAt`)
  - [x] Agregar campo `emailVerifiedAt` (nullable) en `users`
  - [x] En register: crear usuario no verificado + generar token + enviar email
  - [x] Crear endpoint/route de confirmacion por token
  - [x] Reglas: token expirado/usado invalido; token valido marca email como verificado
  - [x] Infra de email: adapter por puerto + dev sink/log local (implementado)
  - [ ] Integrar proveedor real de email (dev SMTP inbox / provider prod) -> movido a Dia 16
- [ ] Preferencias
  - [ ] Definir `density` de UI (`comfortable` | `compact`) y aplicarlo en layouts/listados principales
  - [ ] Definir `defaultTasksView` (`board` | `list`)
  - [ ] Definir `defaultTasksScope` (`all` | `assigned` | `created`)
  - [ ] Aplicar defaults en `/tasks` solo cuando la URL no trae query params
  - [ ] Tema (light/dark/system) con sincronizacion a toggle del Hub
  - [ ] Persistencia base con cookie/storage (sin sobreingenieria en Dia 11)
- [ ] Plan/Billing (pre-Stripe)
  - [ ] Mostrar plan actual (`Free`) y limites visibles de uso
  - [ ] CTA de upgrade (`coming soon`) sin checkout real en Dia 11
  - [ ] Dejar estructura lista para conectar Stripe en fase posterior

## ?? Dia 12 - Lunes 02/03/2026

Tecnologias del dia: Radix Toast + shadcn/ui + design tokens.
Fuente roadmap: [P1.5 feedback](./PRODUCT_ROADMAP.md#L229), [P1.5 base visual](./PRODUCT_ROADMAP.md#L233).
Fortalece hoy: consistencia de feedback, UX de error/estado, base visual escalable.

- [ ] Sistema consistente de feedback
  - [ ] Toasts success/error/warn (`Radix Toast` + estilo `shadcn`)
  - [ ] Mapeo uniforme `formError`/`fieldErrors`
  - [ ] Sin redirects silenciosos en errores
- [ ] Base visual consistente
  - [ ] Definir set base de componentes `shadcn/ui` permitidos para todo el producto
  - [ ] Paleta, tipografia, spacing, botones
  - [ ] Jerarquia clara de bloques y acciones
  - [ ] Microinteracciones y estados de carga prolijos

## ?? Dia 13 - Martes 03/03/2026

Tecnologias del dia: TanStack Query + Zustand (persist + estado global de UI).
Fuente roadmap: [P2.1 TanStack Query + Zustand](./PRODUCT_ROADMAP.md#L249).
Fortalece hoy: estrategia de estado (server state vs UI state), cache, invalidacion e interacciones clickeables.

- [ ] Query keys y cache estables por usuario/filtros
- [ ] Refetch en background + invalidacion por mutaciones
- [ ] Prefetch de vistas clave
- [ ] Optimistic updates con rollback confiable
- [ ] Estrategia de adopcion de TanStack Query (claridad de alcance)
  - [ ] Fase 1 (obligatoria): migrar notificaciones de header a `useQuery` sobre `/api/notifications`
  - [ ] Fase 1: definir `queryKey` por usuario y `staleTime/refetchInterval/retry`
  - [ ] Fase 1: remover `fetch` manual en efectos para ese flujo
  - [ ] Mantener `loader/action` para mutaciones de negocio (auth/tasks/flags)
  - [ ] No crear API paralela para cada action sin necesidad real
  - [ ] Regla: migrar por slice completo (no mitad `loader`, mitad `query` para el mismo flujo)
- [ ] Mapa explicito de uso (Query vs Zustand vs loader/action)
  - [ ] `Header Notifications`
    - [ ] Query: fetch/polling de `/api/notifications`
    - [ ] Zustand: `unreadCount`, `lastSeenAtByUser`, `selectedNotificationId`, `panelOpen`
    - [ ] Loader/Action: sigue como fuente server para crear eventos de notificacion
  - [ ] `Task modal desde notificacion`
    - [ ] Zustand: `selectedTaskId` + `isDetailOpen`
    - [ ] Query: no requerido para abrir modal (solo para feed/notificaciones)
    - [ ] Loader/Action: task data y permisos se resuelven en backend actual
  - [ ] `Preferencias`
    - [ ] Zustand: `density`, `defaultTasksView`, `defaultTasksScope` + persist
    - [ ] Query: no requerido (preferencias locales de UX)
    - [ ] Loader/Action: aplica defaults al entrar a `/tasks` cuando URL no tiene params
  - [ ] `Team panel` (cuando entre en P3.1)
    - [ ] Query: lecturas de miembros/invitaciones/busqueda
    - [ ] Zustand: estado UI local (filtros, modal abierto, seleccion)
    - [ ] Loader/Action: mutaciones y permisos (invitar, aceptar, rechazar, asignar)
- [ ] Criterio de expansion de Query
  - [ ] Fase 2 (opcional): feed de actividad del Hub via `useQuery`
  - [ ] Fase 2 (opcional): lecturas de tasks solo si hay ganancia clara en UX y mantenibilidad
  - [ ] Si no hay ganancia clara, se mantiene backbone `loader/action`
- [ ] Store global de UI/preferencias/seleccion masiva
- [ ] Store de preferencias reales (`density`, `defaultTasksView`, `defaultTasksScope`)
- [ ] Estado global de task seleccionada/modal abierto (sin pasa-manos de props)
- [ ] Estado de notificaciones leidas/no leidas en cliente (Zustand)
  - [ ] Store `notifications`: `items`, `lastSeenAtByUser`, `unreadCount`, `selectedNotificationId`
  - [ ] Hidratacion desde `/api/notifications` (fuente de verdad server) y merge seguro en store
  - [ ] Marcar leidas al abrir panel/click en item (persistencia local por `userId`)
  - [ ] Badge de header derivado de `unreadCount` del store (sin logica duplicada)
- [ ] Notificaciones clickeables: abrir modal de la task relacionada desde campana
  - [ ] Extender payload de notificacion con `taskId` (si aplica)
  - [ ] En click: setear `selectedTaskId` global + `isDetailOpen=true` en store de UI
  - [ ] Cerrar panel de notificaciones y abrir `Task Detail Modal` en la task correcta
  - [ ] Fallback si falta `taskId`: abrir panel de tasks/actividad sin romper flujo
- [ ] Cola local de acciones pendientes con reintento manual
- [ ] Sincronia URL <-> store <-> query keys

## ?? Dia 14 - Miercoles 04/03/2026

Tecnologias del dia: Vitest, Testing Library, Playwright.
Fuente roadmap: [P2.2 minimo calidad tecnica](./PRODUCT_ROADMAP.md#L266).
Fortalece hoy: testing por riesgo, prevencion de regresiones, calidad de release.

- [ ] Lint y typecheck en limpio
- [ ] Smoke script auth + tasks + flags
- [ ] Logging consistente de errores en server actions
- [ ] Base de unit/integration tests
- [ ] E2E minimos:
  - [ ] `login -> create task -> assign -> mover board -> cerrar`
  - [ ] `create flag -> toggle`

## ?? Dia 15 - Jueves 05/03/2026

Tecnologias del dia: documentacion operativa + Stripe base (didactico).
Fuente roadmap: [P2.3 documentacion](./PRODUCT_ROADMAP.md#L282), [P3.1 stripe](./PRODUCT_ROADMAP.md#L296).
Fortalece hoy: documentacion profesional, narrativa de producto, base de billing con impacto funcional.

- [ ] README alineado con scripts/rutas reales
- [ ] `docs/PRODUCT.md` actualizado al estado actual
- [ ] Guia corta: debug de actions, errores y smoke local
- [ ] Modelo de planes y limites (`free`/`pro`) con objetivo didactico (portfolio)
- [ ] Flujo checkout de upgrade (base)
- [ ] UI de estado de plan (`Free`/`Pro`) + CTA upgrade
- [ ] Regla narrativa explicita en docs: billing didactico, no pricing comercial real

## ?? Dia 16 - Viernes 06/03/2026

Tecnologias del dia: Stripe webhooks + Drizzle/SQLite + guards de permisos.
Fuente roadmap: [P3.1 stripe](./PRODUCT_ROADMAP.md#L296).
Fortalece hoy: integraciones externas confiables, idempotencia, permisos por capacidad de plan.

- [ ] Webhooks (`checkout.session.completed`, `customer.subscription.*`) con idempotencia
- [ ] Persistencia de suscripcion en DB + guards por plan
- [ ] Capability por plan en server (`canManageTeam` o equivalente)
- [ ] Validacion de upgrade: plan impacta permisos reales (no solo UI)
- [ ] Integrar proveedor real de email para verificacion de registro
  - [ ] Implementar adapter SMTP dev inbox (entorno local)
  - [ ] Implementar adapter provider prod (interfaz ya existente)
  - [ ] Configurar seleccion por entorno (`dev`/`prod`) sin tocar flujo de negocio

## ?? Dia 17 - Sabado 07/03/2026

Tecnologias del dia: Team domain (DB + server actions + notificaciones in-app).
Fuente roadmap: [P3.1 stripe/team](./PRODUCT_ROADMAP.md#L296), [P2.1 notificaciones](./PRODUCT_ROADMAP.md#L293).
Fortalece hoy: modelado relacional avanzado, colaboracion real por equipos, reglas de asignacion.

- [ ] Team Manager (acoplado a plan `pro`)
  - [ ] Upgrade/pago habilita capacidad `manager`
  - [ ] Manager puede crear equipo
  - [ ] Buscar usuario por email exacto e invitar a equipo
  - [ ] Invitacion por notificacion in-app (sin envio de email de invitacion)
  - [ ] Invitado acepta/rechaza (con notificacion)
  - [ ] Solo miembros `accepted` pueden ser asignados por manager
  - [ ] Panel de equipo: pendientes + aceptados
  - [ ] Card de miembro clickeable a perfil publico
- [ ] Interfaces y contratos tecnicos (decision-complete)
  - [ ] `users`: `plan` (`free|pro`), `canManageTeam` o equivalente
  - [ ] `teams` y `team_members` con estados `invited|accepted|rejected`
  - [ ] Restriccion v1: usuario con un solo equipo activo
  - [ ] Payload de notificacion incluye `taskId` opcional y `teamId` para invitaciones
- [ ] Notificaciones de team
  - [ ] Invitacion enviada -> notificacion al invitado
  - [ ] Invitacion aceptada/rechazada -> notificacion al manager
  - [ ] Payload con `teamId` y fallback de navegacion seguro
- [ ] Regla de canales
  - [ ] Email solo para verificacion de registro
  - [ ] Invitaciones de team solo por notificacion in-app

## ?? Dia 18 - Domingo 08/03/2026

Tecnologias del dia: Slack API + Gemini API + GitHub Actions.
Fuente roadmap: [P3.2 slack](./PRODUCT_ROADMAP.md#L310), [P3.3 gemini](./PRODUCT_ROADMAP.md#L323), [P3.4 github actions](./PRODUCT_ROADMAP.md#L336).
Fortalece hoy: operacion real (CI/CD), observabilidad, integraciones productivas y controles de calidad de salida.

- [ ] Canal de notificaciones por severidad
- [ ] Eventos clave de negocio y errores severos (sin mezclar reglas de Team dentro de Slack)
- [ ] Formato estandar de mensaje (actor, recurso, accion, resultado)
- [ ] Control de ruido (throttling/filtros)
- [ ] Endpoint server para sugerencias de tasks/subtareas
- [ ] Accion UI: sugerir subtareas desde descripcion
- [ ] Validacion estricta de salida con schema
- [ ] Fallback seguro + logging de errores/latencia
- [ ] Mantener Gemini separado de reglas de Team/Billing
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
