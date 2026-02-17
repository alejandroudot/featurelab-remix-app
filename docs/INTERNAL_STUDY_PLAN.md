# Internal Study Plan (post-coding)

Plan interno de estudio.
Objetivo: que entiendas de verdad lo que construimos cada dia, sin depender de memoria pasiva.

## Fase 0 ya realizada (antes del plan diario)

Esta fase ya se trabajo y queda registrada para no perder contexto.

- [x] Definicion de arquitectura del proyecto con criterio de capas
  - [x] separar orquestacion (`routes`) de logica (`features/*/server/*`)
  - [x] reforzar contratos (`core`) e implementaciones (`infra`)
- [x] Construccion de roadmap de producto y stack de aprendizaje
  - [x] ordenar prioridades por fases (P0/P1/P2/P3)
  - [x] incluir tecnologias objetivo a practicar
- [x] Diseno del metodo de estudio asistido por IA + experiencia propia
  - [x] esquema 70/30 (Codex implementa base, vos completas partes clave)
  - [x] checkpoints diarios para validar comprension real
  - [x] plan de repaso post-coding para evitar aprendizaje pasivo

## Prompt diario para pasarle a Codex (copiar/pegar)

Usar este prompt al arrancar o cerrar cada dia:

```text
Hoy vamos con el Dia X del INTERNAL_DELIVERY_PLAN.

Quiero trabajar en modo 70/30:
- 70% lo implementas vos (estructura, wiring, base funcional).
- 30% lo completo yo para aprender.

Necesito que me guies asi:
1) Decime primero que parte exacta del dia vas a tocar.
2) Espera mi autorizacion antes de editar.
3) Hace cambios chicos (no choclo gigante).
4) Despues de cada cambio, mostrame resumen corto + que aprendo yo.
5) Deja 2-3 tareas obligatorias para que yo complete.
6) Cerramos con checkpoint de 3 preguntas para validar comprension.

Contexto del dia:
- Objetivo:
- Bloques del roadmap:
- Dudas mias actuales:
```

## Como usar este plan

- Se ejecuta al final de cada dia de coding (idealmente el mismo dia).
- Duracion objetivo: 60-90 minutos.
- Si no llegas al bloque completo, hacé minimo:
  - resumen oral (10 min)
  - lectura guiada (20 min)
  - nota de cierre (10 min)

## Rutina diaria (60-90 min)

### Bloque 1 - Explicacion oral (10 min)

- Explicar en voz alta:
  - que hicimos hoy
  - por que lo hicimos asi
  - que problema evita en arquitectura
- Regla: si no lo podés explicar simple, no está aprendido.

### Bloque 2 - Lectura guiada (20 min)

- Elegir 3 archivos del dia:
  - 1 route (orquestacion)
  - 1 server file (`loader`/`action`/helper)
  - 1 UI file (feature/page/component)
- Marcar en cada archivo:
  - entrada
  - decision
  - salida
  - manejo de error

### Bloque 3 - Reescritura parcial (20 min)

- Sin mirar, reescribir una parte chica:
  - una validacion Zod
  - un parse de intent
  - un bloque de render condicional
  - un handler de action
- Luego comparar con la version real.

### Bloque 4 - Debug intencional (10-20 min)

- Provocar 1 error a proposito:
  - cambiar un nombre de campo
  - romper un tipo
  - mandar intent invalido
- Objetivo: aprender a detectar rapido causa y fix.

### Bloque 5 - Nota final (10 min)

- Completar la plantilla de cierre diaria (abajo).

---

## Plantilla de cierre diaria (copiar/pegar)

Dia X - Fecha

- Tema principal del dia:
- Que implementamos (resumen corto):
- Archivos que repase:
- 3 conceptos que entendí:
- 2 dudas que me quedaron:
- 1 error real que aprendí a resolver:
- Mini desafio hecho:
- Nivel de confianza (0-10):
- Que tengo que repasar mañana 15 min:

---

## Plan de repaso por dia (alineado al delivery)

## Dia 1 (Execution Hub base + refactor route/server)

- Enfocar estudio en:
  - diferencia `route` vs `features/*/server/*`
  - contrato de props del Hub
  - ciclo loader -> UI -> action
- Mini desafio:
  - agregar una metrica nueva al Hub sin romper tipos.

## Dia 2 (Dark mode + preferencias)

- Enfocar estudio en:
  - estado global vs estado local
  - persistencia de preferencias
  - aplicacion de tema en layout global
  - patron de accion rapida con `Dialog/Sheet` desde Hub (sin duplicar action)
- Mini desafio:
  - agregar opcion de tema nueva y fallback seguro.
  - convertir `Crear task` en quick action inline desde Hub con fallback de navegacion.

## Dia 3 (Bootstrap de flags)

- Enfocar estudio en:
  - concepto de feature flag por entorno
  - defaults `development` vs `production`
  - por que las flags viven fuera de UI
- Mini desafio:
  - agregar una flag nueva y consumirla en Hub.

## Dia 4 (Filtros/orden por URL)

- Enfocar estudio en:
  - query params tipados con Zod
  - defaults seguros
  - sincronia URL -> loader -> UI
- Mini desafio:
  - sumar un filtro nuevo y reflejarlo en URL.

## Dia 5 (Board base)

- Enfocar estudio en:
  - modelado de columnas/status
  - composicion de cards
  - convivencia list/board
- Mini desafio:
  - agregar badge visual por prioridad.

## Dia 6 (DnD + optimistic update)

- Enfocar estudio en:
  - update optimista
  - rollback
  - riesgos de inconsistencia
- Mini desafio:
  - simular error de update y verificar rollback.

## Dia 7 (Asignaciones)

- Enfocar estudio en:
  - cambios de modelo (`assigneeId`)
  - validacion create/update
  - render de responsable en UI
- Mini desafio:
  - soportar `Unassigned` en todo el flujo.

## Dia 8 (Permisos + vistas por usuario)

- Enfocar estudio en:
  - permisos server-side
  - vistas derivadas por usuario
  - mensajes de no autorizado
- Mini desafio:
  - bloquear una accion nueva por rol.

## Dia 9 (Trazabilidad + notificaciones)

- Enfocar estudio en:
  - eventos de dominio
  - timeline
  - notificacion in-app
- Mini desafio:
  - agregar un nuevo tipo de evento y mostrarlo.

## Dia 10 (User Panel)

- Enfocar estudio en:
  - formularios de perfil/seguridad
  - manejo de errores de validacion
  - preferencias y persistencia
- Mini desafio:
  - agregar un campo de perfil con validacion.

## Dia 11 (TanStack Query + Zustand profundo)

- Enfocar estudio en:
  - query keys
  - invalidacion
  - limites entre store y cache server
- Mini desafio:
  - forzar refetch de un bloque puntual sin recargar pantalla.

## Dia 12 (Unit + integration)

- Enfocar estudio en:
  - que testear en UI vs server helper
  - setup de tests y mocks
  - calidad minima para iterar seguro
- Mini desafio:
  - escribir 1 test nuevo sin copiar estructura previa.

## Dia 13 (E2E)

- Enfocar estudio en:
  - flujo critico de negocio de punta a punta
  - datos de prueba estables
  - evitar flaky tests
- Mini desafio:
  - agregar un assert extra de estado intermedio.

## Dia 14 (Hardening + docs)

- Enfocar estudio en:
  - cierre de calidad
  - documentar para el “yo del futuro”
  - detectar deuda antes de release
- Mini desafio:
  - escribir una guia de 10 lineas para debug de un bug real.

---

## Reglas anti-olvido (clave)

- No pasar al dia siguiente sin nota de cierre.
- No estudiar solo leyendo: siempre escribir/cambiar algo.
- Si algo no se entiende, abrir issue interno con:
  - contexto
  - lo que esperaba
  - lo que paso
  - hipotesis
  - proximo paso
