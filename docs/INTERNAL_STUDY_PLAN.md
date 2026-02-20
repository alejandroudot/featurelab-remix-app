# Internal Study Plan (post-coding)
> Objetivo: entender de verdad lo que construimos, no solo "hacer que funcione".

Plan interno de estudio.
Objetivo: que entiendas de verdad lo que construimos cada dia, sin depender de memoria pasiva.

## Acuerdo de colaboracion (fuente de verdad)

- `Codex` hace boilerplate/plomeria:
  - estructura, wiring, scaffolding, refactors mecanicos, glue code.
- `Vos` haces implementacion fina/aprendizaje:
  - validaciones clave (ej: Zod), logica central de features, decisiones finas.
  - tecnologias nuevas (ej: Zustand, React Query, DnD): las escribis vos con guia.
- Regla de tecnologia nueva:
  - Codex no escribe esa logica por vos.
  - Codex frena y te guia con pasos concretos, checklist y criterio de cierre.
  - Vos implementas; Codex revisa y corrige.

## Prompt diario para pasarle a Codex (copiar/pegar)

Usar este prompt al arrancar o cerrar cada dia:

```text
Hoy vamos con el Dia X del INTERNAL_DELIVERY_PLAN.

Quiero trabajar con este acuerdo:
- Vos haces boilerplate/plomeria (estructura, wiring, base funcional).
- Yo hago implementacion fina y partes clave de aprendizaje.
- Si aparece una tecnologia nueva para mi (ej: Zustand/React Query/DnD), vos NO escribis ese codigo: frenas y me guias paso a paso para que lo escriba yo.

Necesito que me guies asi:
1) Decime primero que parte exacta del dia vas a tocar.
2) Espera mi autorizacion antes de editar.
3) Hace cambios chicos (no choclo gigante).
4) Despues de cada cambio, mostrame resumen corto + que aprendo yo.
5) Deja tareas obligatorias para que yo complete.
6) Cerramos con checkpoint de 3 preguntas para validar comprension.

Contexto del dia:
- Objetivo:
- Bloques del roadmap:
- Dudas mias actuales:
```

## Como usar este plan

- Se ejecuta al final de cada dia de coding (idealmente el mismo dia).
- Duracion objetivo: 60-90 min.
- Si no llegas al bloque completo, hace minimo:
  - resumen oral (10 min)
  - lectura guiada (20 min)
  - nota de cierre (10 min)

## Rutina diaria (60-90 min)

### Bloque 1 - Explicacion oral (10 min)

- Explicar en voz alta:
  - que hicimos hoy
  - por que lo hicimos asi
  - que problema evita en arquitectura
- Regla: si no lo podes explicar simple, no esta aprendido.

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

### Bloque 3 - Implementacion guiada (20 min)

- Vos escribis una pieza clave del dia, sin copy/paste.
- Codex te da pasos y checkpoints, pero no te codea la parte fina.
- Ejemplos:
  - una validacion Zod importante
  - una store nueva en Zustand
  - una query key + mutacion en React Query
  - un bloque de logica de DnD

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
- Que implemento Codex (boilerplate/plomeria):
- Que implemente yo (logica fina):
- Archivos que repase:
- Tecnologia nueva practicada hoy:
- 3 conceptos que entendi:
- 2 dudas que me quedaron:
- 1 error real que aprendi a resolver:
- Nivel de confianza (0-10):
- Que tengo que repasar manana 15 min:

---

## Reglas anti-olvido (clave)

- No pasar al dia siguiente sin nota de cierre.
- No estudiar solo leyendo: siempre escribir/cambiar algo vos.
- Si algo no se entiende, abrir issue interno con:
  - contexto
  - lo que esperaba
  - lo que paso
  - hipotesis
  - proximo paso
