# 🧠 Internal Study Plan (post-coding)
> 📚 Objetivo: entender de verdad lo que construimos, no solo "hacer que funcione".

Plan interno de estudio.
Objetivo: que entiendas de verdad lo que construimos cada dia, sin depender de memoria pasiva.

## 🗣️ Prompt diario para pasarle a Codex (copiar/pegar)

Usar este prompt al arrancar o cerrar cada dia:

```text
Hoy vamos con el Dia X del INTERNAL_DELIVERY_PLAN.

Quiero trabajar en modo 50/50:
- 50% lo implementas vos (estructura, wiring, base funcional).
- 50% lo completo yo para aprender.

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

## 🧭 Como usar este plan

- Se ejecuta al final de cada dia de coding (idealmente el mismo dia).
- Duracion objetivo: 60-90 minutos.
- Si no llegas al bloque completo, hacé minimo:
  - resumen oral (10 min)
  - lectura guiada (20 min)
  - nota de cierre (10 min)

## ⏱️ Rutina diaria (60-90 min)

### Bloque 1 - Explicacion oral (10 min) 🎙️

- Explicar en voz alta:
  - que hicimos hoy
  - por que lo hicimos asi
  - que problema evita en arquitectura
- Regla: si no lo podés explicar simple, no está aprendido.

### Bloque 2 - Lectura guiada (20 min) 🔍

- Elegir 3 archivos del dia:
  - 1 route (orquestacion)
  - 1 server file (`loader`/`action`/helper)
  - 1 UI file (feature/page/component)
- Marcar en cada archivo:
  - entrada
  - decision
  - salida
  - manejo de error

### Bloque 3 - Reescritura parcial (20 min) ✍️

- Sin mirar, reescribir una parte chica:
  - una validacion Zod
  - un parse de intent
  - un bloque de render condicional
  - un handler de action
- Luego comparar con la version real.

### Bloque 4 - Debug intencional (10-20 min) 🐞

- Provocar 1 error a proposito:
  - cambiar un nombre de campo
  - romper un tipo
  - mandar intent invalido
- Objetivo: aprender a detectar rapido causa y fix.

### Bloque 5 - Nota final (10 min) 📝

- Completar la plantilla de cierre diaria (abajo).

---

## 📌 Plantilla de cierre diaria (copiar/pegar)

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

## 🚫 Reglas anti-olvido (clave)

- No pasar al dia siguiente sin nota de cierre.
- No estudiar solo leyendo: siempre escribir/cambiar algo.
- Si algo no se entiende, abrir issue interno con:
  - contexto
  - lo que esperaba
  - lo que paso
  - hipotesis
  - proximo paso
