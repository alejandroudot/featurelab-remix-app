# PROXIMAS TAREAS (Pulido MVP + MVP+1)

Este documento es la lista activa de ejecucion.

## Leyenda

- `[ ]` pendiente
- `[~]` en progreso
- `[x]` listo

## P0 - Estabilidad y Consistencia

### 1. Endurecer flujo de tasks

- [x] Persistir valores del formulario al fallar validacion en crear task
- [x] Agregar render de `formError` global en el formulario de crear task
- [x] Asegurar que todos los errores de actions de tasks sean visibles en UI
- [ ] Validar manualmente create/update/delete con payloads invalidos
  - [ ] create inválido: `title` vacío -> muestra error de campo y preserva valores
  - [ ] create error inesperado (simulado) -> muestra `formError` global
  - [ ] update inválido: `id` vacío/manipulado -> muestra error visible (no silencio)
  - [ ] update inválido: `status` o `priority` fuera de enum (payload manipulado) -> error visible
  - [ ] delete inválido: `id` vacío/manipulado -> error visible (no silencio)
  - [ ] confirmación final: ningún submit inválido falla en silencio

Criterio de cierre:

- Un submit invalido nunca falla en silencio
- El usuario siempre ve error por campo o error global

### 2. Consistencia de patron de actions (tasks vs flags)

- [ ] Alinear estructura de helper de action de tasks con el patron de flags
- [ ] Extraer helpers comunes para task action (`parseIntent`, mapeo de errores)
- [ ] Mantener archivos de rutas solo como orquestadores

Criterio de cierre:

- Flujo de control y contratos de error similares en ambos modulos
- Sin logica duplicada de parseo de intent en rutas

### 3. Alineacion de contratos de schemas y tipos

- [ ] Verificar consistencia de nombres de tipos de intent entre features
- [ ] Asegurar que el shape de `ActionData` sea estable y documentado
- [ ] Confirmar que no queden imports/rutas viejas tras mover archivos

Criterio de cierre:

- Nombres de tipos e imports coherentes
- Sin alias de path rotos ni modulos faltantes

## P1 - Pulido de Producto (sacar sensacion de "pelado")

### 4. Mejoras UX en tasks

- [ ] Agregar filtros por estado y prioridad via params en URL
- [ ] Agregar ordenamiento (mas nuevas/mas viejas/prioridad)
- [ ] Agregar estados vacios con llamada a la accion clara
- [ ] Agregar labels de submit mas claros y consistentes

Criterio de cierre:

- La pagina de tasks soporta filtro y orden practicos
- El estado vacio guia al usuario para crear la primera task

### 5. Capa de feedback

- [ ] Agregar estrategia consistente de toasts de exito/error
- [ ] Estandarizar mapeo de responses de action a feedback en UI
- [ ] Evitar redirects silenciosos en operaciones fallidas

Criterio de cierre:

- El usuario recibe feedback explicito en todas las escrituras

### 6. Base de calidad visual

- [ ] Ajustar consistencia de espaciado/tipografia en tasks y flags
- [ ] Mejorar jerarquia de titulos y bloques de accion
- [ ] Normalizar semantica de botones (primario/secundario/destructivo)

Criterio de cierre:

- La UI se percibe intencional, no de scaffold

## P2 - Guardrails de release

### 7. Minimo de calidad tecnica

- [ ] Ejecutar lint y typecheck en limpio
- [ ] Agregar 1 script/checklist smoke para auth + tasks + flags
- [ ] Agregar estrategia de logging de errores en server actions

Criterio de cierre:

- Checklist de release local ejecutable en menos de 10 minutos

### 8. Sincronizacion de documentacion

- [ ] Mantener `README.md` alineado con rutas y scripts reales
- [ ] Actualizar checklist de `docs/MVP.md` segun estado actual
- [ ] Agregar seccion corta de "como debuggear actions" en docs

Criterio de cierre:

- La documentacion refleja codigo y arquitectura actual

## Aprendizaje aplicado (tecnologias)

### A1. Testing E2E con Playwright

- [ ] Instalar y configurar Playwright
- [ ] Crear 2 flujos E2E: `login -> create task` y `create flag -> toggle`
- [ ] Dejar comando de ejecucion documentado

Criterio de cierre:

- Existen 2 tests E2E pasando local
- Cubre happy path de las 2 features clave

### A2. Observabilidad minima en server actions

- [ ] Definir formato de log para actions (evento, intent, status, error)
- [ ] Implementar wrapper simple de logging en actions de tasks y flags
- [ ] Evitar logs ruidosos en casos exitosos

Criterio de cierre:

- Los errores de actions quedan trazables con contexto util
- Se mantiene bajo ruido en consola

### A3. URL state tipado con Zod

- [ ] Definir schema Zod para query params de tasks (filtros/orden)
- [ ] Validar params en loader y aplicar defaults seguros
- [ ] Reflejar cambios de filtros/orden en URL

Criterio de cierre:

- Los filtros sobreviven recarga y comparticion de URL
- No rompe por query params invalidos

## Orden sugerido de ejecucion

1. P0.1
2. P0.2
3. P0.3
4. P1.4
5. P1.5
6. P1.6
7. P2.7
8. P2.8
9. A1
10. A2
11. A3
