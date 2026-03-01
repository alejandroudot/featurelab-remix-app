## Glosario rapido

- `tradeoff` <span style="color:#0ea5e9">(elegir entre opciones con ventajas y desventajas; ganar algo implica ceder otra cosa)</span>
- `RFC/ADR` <span style="color:#0ea5e9">(documento corto para registrar una decision tecnica, su motivo y consecuencias)</span>
- `boundaries` <span style="color:#0ea5e9">(limites de responsabilidad entre capas/modulos para evitar mezcla de logica)</span>
- `server-first` <span style="color:#0ea5e9">(la regla de negocio se valida en backend, no solo en frontend)</span>
- `end-to-end (e2e)` <span style="color:#0ea5e9">(prueba/flujo completo desde UI hasta DB y de vuelta)</span>
- `DoD` <span style="color:#0ea5e9">(Definition of Done: condiciones minimas para considerar una tarea terminada)</span>
- `hardening` <span style="color:#0ea5e9">(reforzar seguridad, estabilidad y calidad de una implementacion)</span>
- `CI/CD` <span style="color:#0ea5e9">(automatizar integracion, pruebas y despliegue de codigo)</span>
- `rollback` <span style="color:#0ea5e9">(volver a una version estable cuando un deploy falla)</span>
- `payload` <span style="color:#0ea5e9">(datos que se envian en una request, respuesta o evento)</span>
- `idempotencia` <span style="color:#0ea5e9">(repetir una operacion varias veces produce el mismo resultado final)</span>
- `edge cases` <span style="color:#0ea5e9">(casos limite que no son el flujo normal)</span>
- `design system/tokens` <span style="color:#0ea5e9">(sistema visual reutilizable + variables de estilo como color/spacing/tipografia)</span>

## Checklist de autoevaluacion (semanal)

- [ ] Puedo explicar por que una validacion va en server y no solo en cliente. - **[BASE SOLIDA]** Comentario: lo defendes seguido en decisiones de flujo.
- [ ] Puedo justificar cuando usar Query y cuando Zustand. - **[SOLIDIFICAR]** Comentario: tenes criterio inicial, falta regla escrita y consistente.
- [ ] Puedo describir el modelo de datos de Team sin mirar codigo. - **[SOLIDIFICAR]** Comentario: buena base conceptual, falta implementacion final.
- [ ] Puedo trazar una notificacion desde evento hasta accion de UI. - **[SOLIDIFICAR]** Comentario: lo planteaste bien, falta cierre end-to-end <span style="color:#0ea5e9">(flujo completo de punta a punta)</span>.
- [ ] Puedo defender un tradeoff <span style="color:#0ea5e9">(equilibrio entre opciones con pros y contras)</span> tecnico con impacto en producto. - **[BASE SOLIDA]** Comentario: punto muy fuerte tuyo.
- [ ] Puedo explicar boundaries de la arquitectura <span style="color:#0ea5e9">(limites claros de responsabilidad entre capas)</span> (routes, features/server, core, infra, ui) y por que existen. - **[BASE SOLIDA]** Comentario: lo venis aplicando en refactors.
- [ ] Puedo identificar cuando un componente esta sobrecargado y dividirlo sin romper responsabilidades. - **[BASE SOLIDA]** Comentario: lo hiciste varias veces en detail/page.
- [ ] Puedo escribir y mantener contratos de dominio claros (types/schemas) entre capas. - **[SOLIDIFICAR]** Comentario: buen avance, falta estandar fijo.
- [ ] Puedo modelar una feature nueva en DB con restricciones y estados sin generar ambiguedades. - **[SOLIDIFICAR]** Comentario: buena direccion, falta mas profundidad en constraints.
- [ ] Puedo justificar indices/consultas basicas para evitar cuellos de botella evidentes. - **[PENDIENTE FUERTE]** Comentario: todavia no fue foco tecnico.
- [ ] Puedo implementar control de permisos server-first <span style="color:#0ea5e9">(la regla vive y se valida primero en backend)</span> (no confiar en UI). - **[SOLIDIFICAR]** Comentario: criterio correcto, falta completar Team permissions.
- [ ] Puedo detectar riesgos OWASP comunes (XSS, CSRF, injection, auth bypass) y aplicar mitigaciones. - **[PENDIENTE FUERTE]** Comentario: hay conciencia, falta ejecucion sistematica.
- [ ] Puedo disenar flujos de token seguros (expiracion, uso unico, hashing, invalidacion). - **[SOLIDIFICAR]** Comentario: ya definido en roadmap, falta implementarlo completo.
- [ ] Puedo definir casos de prueba minimos por feature (happy path + edge cases <span style="color:#0ea5e9">(casos limite o raros)</span> + permisos). - **[SOLIDIFICAR]** Comentario: los casos los detectas, falta automatizarlos.
- [ ] Puedo distinguir cuando usar unit, integration o e2e segun riesgo/costo. - **[PENDIENTE FUERTE]** Comentario: falta framework de testing por riesgo.
- [ ] Puedo leer un error de produccion y armar hipotesis de causa raiz con evidencia. - **[SOLIDIFICAR]** Comentario: buen debugging practico, falta observabilidad formal.
- [ ] Puedo definir logs utiles (no ruido) para auth, notificaciones, team y billing. - **[PENDIENTE FUERTE]** Comentario: no esta estandarizado todavia.
- [ ] Puedo describir un plan de rollback <span style="color:#0ea5e9">(volver rapido a una version estable)</span> seguro para cambios de alto riesgo. - **[PENDIENTE FUERTE]** Comentario: falta playbook operativo.
- [ ] Puedo explicar impacto tecnico de una decision en costo/tiempo/mantenibilidad. - **[BASE SOLIDA]** Comentario: lo venis haciendo en roadmap y alcance.
- [ ] Puedo priorizar backlog por impacto de negocio y riesgo tecnico. - **[BASE SOLIDA]** Comentario: otro punto muy fuerte.
- [ ] Puedo traducir requerimientos ambiguos en tareas implementables con criterios de aceptacion. - **[BASE SOLIDA]** Comentario: lo aplicaste en casi todos los cambios.
- [ ] Puedo escribir un RFC/ADR <span style="color:#0ea5e9">(documento corto de decision tecnica y su justificacion)</span> corto con contexto, decision, tradeoffs <span style="color:#0ea5e9">(equilibrio entre opciones con pros y contras)</span> y consecuencias. - **[SOLIDIFICAR]** Comentario: buena base en docs, falta constancia.
- [ ] Puedo usar IA para acelerar tareas repetitivas sin delegar decisiones criticas. - **[BASE SOLIDA]** Comentario: lo haces bien.
- [ ] Puedo validar output de IA con pruebas, types y lectura critica de seguridad. - **[BASE SOLIDA]** Comentario: detectas rapido errores y regresiones.
- [ ] Puedo mantener naming consistente y detectar deuda de naming antes de mergear. - **[BASE SOLIDA]** Comentario: lo exigis todo el tiempo.
- [ ] Puedo eliminar dead code sin romper contratos publicos del proyecto. - **[SOLIDIFICAR]** Comentario: avanzaste mucho, falta auditoria completa final.
- [ ] Puedo preparar una demo de la feature mostrando valor funcional y decisiones tecnicas. - **[SOLIDIFICAR]** Comentario: falta empaquetado final para portfolio.
- [ ] Puedo explicar este proyecto como portfolio: problema, arquitectura, decisiones y resultados. - **[SOLIDIFICAR]** Comentario: ya tenes material, falta version final corta.

## Checklist de madurez profesional (objetivo "perfil pro")

- [ ] Tomo decisiones tecnicas con criterio de producto, no solo por preferencia personal. - **[BASE SOLIDA]** Comentario: muy presente en todo el trabajo.
- [ ] Mantengo velocidad de entrega sin comprometer calidad minima. - **[SOLIDIFICAR]** Comentario: buen ritmo, a veces hay regresiones por cambios grandes.
- [ ] Identifico sobre-ingenieria temprano y simplifico con argumentos tecnicos. - **[BASE SOLIDA]** Comentario: lo aplicas seguido.
- [ ] Comunico riesgos de forma concreta y propongo mitigaciones accionables. - **[SOLIDIFICAR]** Comentario: buen nivel, falta formalizar checklist de riesgo.
- [ ] Puedo liderar una implementacion por etapas (MVP -> hardening <span style="color:#0ea5e9">(endurecer calidad/seguridad de una feature)</span> -> escalado). - **[SOLIDIFICAR]** Comentario: vas bien, falta cerrar fases con criteria fijos.
- [ ] Puedo revisar PRs detectando bugs reales, regresiones y deuda tecnica. - **[SOLIDIFICAR]** Comentario: muy buen ojo de bugs, falta proceso repetible.
- [ ] Puedo estimar trabajo con rangos realistas y supuestos explicitos. - **[SOLIDIFICAR]** Comentario: mejorando con ajustes de dias/horas.
- [ ] Puedo dejar el codigo mejor de como lo encontre (legibilidad, naming, estructura). - **[BASE SOLIDA]** Comentario: fortaleza clara.
- [ ] Puedo convertir feedback de UX en cambios tecnicos sostenibles. - **[BASE SOLIDA]** Comentario: lo hiciste continuamente.
- [ ] Puedo documentar decisiones para que otro dev continue sin friccion. - **[SOLIDIFICAR]** Comentario: docs buenos, falta cerrar version final consistente.

## Checklist de candidato ideal (perfil fullstack producto)

### Frontend engineering

- [ ] Puedo construir interfaces accesibles y responsivas sin depender de una libreria especifica. - **[SOLIDIFICAR]** Comentario: responsive bien, accesibilidad formal pendiente.
- [ ] Puedo implementar componentes reutilizables con API clara y buen desacople. - **[BASE SOLIDA]** Comentario: buen trabajo de separacion.
- [ ] Puedo convertir un diseno de Figma en UI real respetando spacing, tipografia y estados. - **[SOLIDIFICAR]** Comentario: buen criterio visual, falta practica directa con handoff.
- [ ] Puedo optimizar render/performance (memoizacion util, splitting, evitar renders innecesarios). - **[SOLIDIFICAR]** Comentario: detectas problemas, falta medicion sistematica.
- [ ] Puedo detectar y corregir problemas de UX (feedback, loading, empty states, errores). - **[BASE SOLIDA]** Comentario: muy fuerte.
- [ ] Puedo elegir estrategicamente gestion de estado local/global/server-state. - **[SOLIDIFICAR]** Comentario: criterio bueno, falta convension final escrita.
- [ ] Puedo trabajar con routing, formularios complejos y validaciones robustas. - **[BASE SOLIDA]** Comentario: ya demostrado.
- [ ] Puedo mantener consistencia visual con design system/tokens <span style="color:#0ea5e9">(sistema visual reutilizable y variables de estilo)</span>. - **[SOLIDIFICAR]** Comentario: en progreso, falta cerrar base visual global.

### Backend engineering

- [ ] Puedo disenar APIs claras (REST/RPC) con contratos versionables. - **[SOLIDIFICAR]** Comentario: bien encaminado, versionado aun no formal.
- [ ] Puedo aplicar validacion y normalizacion de datos en server. - **[BASE SOLIDA]** Comentario: se viene aplicando.
- [ ] Puedo modelar reglas de negocio sin mezclar infraestructura. - **[BASE SOLIDA]** Comentario: alineado a tu arquitectura.
- [ ] Puedo implementar auth y permisos finos con enfoque server-first <span style="color:#0ea5e9">(la regla vive y se valida primero en backend)</span>. - **[SOLIDIFICAR]** Comentario: falta cerrar verify + team permissions.
- [ ] Puedo manejar operaciones asincronas y flujos event-driven basicos. - **[PENDIENTE FUERTE]** Comentario: casi no trabajado.
- [ ] Puedo disenar idempotencia <span style="color:#0ea5e9">(repetir una accion sin cambiar el resultado final)</span> y manejo de errores para endpoints criticos. - **[SOLIDIFICAR]** Comentario: parcialmente aplicado.
- [ ] Puedo definir politicas de consistencia de datos (transacciones, compensaciones simples). - **[PENDIENTE FUERTE]** Comentario: falta practica directa.

### Data y persistencia

- [ ] Puedo modelar entidades, relaciones y estados de dominio sin ambiguedad. - **[SOLIDIFICAR]** Comentario: buena base conceptual.
- [ ] Puedo decidir cuando usar SQL vs NoSQL segun el problema. - **[SOLIDIFICAR]** Comentario: base teorica, falta casos comparativos.
- [ ] Puedo escribir consultas eficientes y detectar necesidad de indices. - **[PENDIENTE FUERTE]** Comentario: gap actual.
- [ ] Puedo planificar migraciones de esquema con bajo riesgo. - **[SOLIDIFICAR]** Comentario: en progreso.
- [ ] Puedo auditar impacto de cambios de DB en rendimiento y funcionalidad. - **[PENDIENTE FUERTE]** Comentario: falta metodologia de medicion.

### Arquitectura y escalabilidad

- [ ] Puedo explicar arquitectura del sistema en 5 minutos con boundaries claros. - **[BASE SOLIDA]** Comentario: ya lo podes hacer.
- [ ] Puedo distinguir patron util vs sobre-ingenieria para el contexto. - **[BASE SOLIDA]** Comentario: muy bien.
- [ ] Puedo evolucionar modulos sin romper contratos existentes. - **[SOLIDIFICAR]** Comentario: mejorando, aun hay roturas ocasionales.
- [ ] Puedo proponer soluciones escalables por etapas (v1 simple -> v2 robusta). - **[SOLIDIFICAR]** Comentario: buena direccion en roadmap.
- [ ] Puedo evaluar tradeoffs <span style="color:#0ea5e9">(equilibrio entre opciones con pros y contras)</span> de complejidad, costo y time-to-market. - **[BASE SOLIDA]** Comentario: fortaleza clara.

### Calidad y testing

- [ ] Puedo definir estrategia de testing por riesgo (unit/integration/e2e). - **[PENDIENTE FUERTE]** Comentario: principal gap.
- [ ] Puedo escribir tests que validen comportamiento, no solo implementacion. - **[PENDIENTE FUERTE]** Comentario: falta adopcion sistematica.
- [ ] Puedo cubrir edge-cases <span style="color:#0ea5e9">(casos limite o raros)</span> criticos de auth, permisos y dominio. - **[SOLIDIFICAR]** Comentario: los detectas, falta automatizacion.
- [ ] Puedo prevenir regresiones con suite minima confiable. - **[PENDIENTE FUERTE]** Comentario: aun manual.
- [ ] Puedo usar linters/checks estaticos para sostener calidad. - **[SOLIDIFICAR]** Comentario: ya los usas, falta cobertura completa.

### Seguridad y confiabilidad

- [ ] Puedo aplicar OWASP Top 10 en decisiones concretas del codigo. - **[PENDIENTE FUERTE]** Comentario: falta bajarlo a implementacion.
- [ ] Puedo implementar manejo seguro de secretos y variables sensibles. - **[SOLIDIFICAR]** Comentario: base correcta, falta hardening <span style="color:#0ea5e9">(endurecer calidad/seguridad de una feature)</span>.
- [ ] Puedo disenar logs utiles para auditoria y debugging. - **[PENDIENTE FUERTE]** Comentario: no estandarizado.
- [ ] Puedo definir medidas anti abuso basicas (rate-limit, lockouts, validaciones). - **[PENDIENTE FUERTE]** Comentario: pendiente total.
- [ ] Puedo responder a incidentes con pasos claros (detectar, mitigar, corregir, prevenir). - **[PENDIENTE FUERTE]** Comentario: falta playbook.

### DevOps y operacion

- [ ] Puedo configurar CI/CD <span style="color:#0ea5e9">(integracion y despliegue continuo automatizado)</span> basico con gates de calidad. - **[PENDIENTE FUERTE]** Comentario: pendiente.
- [ ] Puedo desplegar con rollback <span style="color:#0ea5e9">(volver rapido a una version estable)</span> seguro. - **[PENDIENTE FUERTE]** Comentario: pendiente.
- [ ] Puedo trabajar en Linux con soltura (procesos, logs, servicios, permisos). - **[SOLIDIFICAR]** Comentario: base operativa buena.
- [ ] Puedo diagnosticar problemas en produccion con evidencia (logs, metricas, trazas). - **[SOLIDIFICAR]** Comentario: falta instrumentacion.
- [ ] Puedo estimar impacto de costo operativo de decisiones tecnicas. - **[PENDIENTE FUERTE]** Comentario: aun no trabajado.

### Colaboracion y producto

- [ ] Puedo trabajar con diseno y producto traduciendo feedback en cambios implementables. - **[BASE SOLIDA]** Comentario: lo haces muy bien.
- [ ] Puedo priorizar backlog por impacto, riesgo y dependencia. - **[BASE SOLIDA]** Comentario: fortaleza alta.
- [ ] Puedo comunicar progreso/bloqueos de forma ejecutiva y tecnica. - **[BASE SOLIDA]** Comentario: muy bien.
- [ ] Puedo hacer code reviews que mejoren calidad y velocidad del equipo. - **[SOLIDIFICAR]** Comentario: buen criterio, falta marco formal.
- [ ] Puedo documentar para onboarding y transferencia de conocimiento. - **[SOLIDIFICAR]** Comentario: buen avance, falta cierre final limpio.

### Ejecucion profesional

- [ ] Puedo descomponer features grandes en iteraciones mergeables. - **[SOLIDIFICAR]** Comentario: en progreso, a veces cambios muy anchos.
- [ ] Puedo estimar con supuestos explicitos y ajustar con evidencia real. - **[SOLIDIFICAR]** Comentario: mejorando.
- [ ] Puedo cerrar tareas con DoD <span style="color:#0ea5e9">(Definition of Done: criterio para dar una tarea por cerrada)</span> completo (funciona, testeado, documentado, limpio). - **[SOLIDIFICAR]** Comentario: falta reforzar testing/ops.
- [ ] Puedo sostener ritmo alto sin sacrificar mantenibilidad. - **[SOLIDIFICAR]** Comentario: vas bien, hay que cuidar regresiones.
- [ ] Puedo liderar tecnicamente una iniciativa de punta a punta. - **[SOLIDIFICAR]** Comentario: ya cerca, te faltan cierres operativos/testing.

## Matriz de prioridad para volverte mas empleable

- `Prioridad alta (core)`: arquitectura, auth/permisos, APIs, modelado de datos, testing, comunicacion tecnica.
- `Prioridad media (aceleradores)`: performance frontend, observabilidad, CI/CD <span style="color:#0ea5e9">(integracion y despliegue continuo automatizado)</span>, debugging productivo.
- `Prioridad estrategica (diferenciador)`: criterio de producto + uso de IA con control de calidad.

## Evidencias concretas para entrevistas/portfolio

- [ ] Caso real de feature end-to-end <span style="color:#0ea5e9">(flujo completo de punta a punta)</span> (problema, solucion, tradeoffs <span style="color:#0ea5e9">(equilibrio entre opciones con pros y contras)</span>, resultado). - **[SOLIDIFICAR]** Comentario: material ya existe, falta empaquetado.
- [ ] Caso real de bug dificil (diagnostico, fix, prevencion). - **[BASE SOLIDA]** Comentario: ya tenes varios casos reales.
- [ ] Caso real de refactor (deuda detectada, plan, impacto en legibilidad/mantenibilidad). - **[BASE SOLIDA]** Comentario: lo tenes muy bien cubierto.
- [ ] Caso real de seguridad aplicada (riesgo, mitigacion, validacion). - **[PENDIENTE FUERTE]** Comentario: cerrar verify email y controles.
- [ ] Caso real de colaboracion con producto/diseno (decision y outcome). - **[SOLIDIFICAR]** Comentario: lo haces en practica, falta documentarlo como caso.



## Cruce con roadmap (hecho vs pendiente)

### Lo que ya mejoraste fuerte (Dias D-6 a D10)

- Arquitectura y boundaries <span style="color:#0ea5e9">(limites claros por capa)</span>:
  - Hecho en: `D-6`, `D-5`, `D0`, `D10` (refactor por capas, rutas orquestadoras, limpieza de naming).
  - Impacto en checklist: fortalece `boundaries`, `reglas en capa correcta`, `mantenibilidad`.
- UX de producto y criterio de tradeoffs:
  - Hecho en: `D4` a `D9` (definicion de UX, board behavior, permisos, colaboracion real).
  - Impacto: fortalece `priorizacion`, `tradeoffs`, `traduccion negocio -> solucion`.
- Formularios, validaciones y errores consistentes:
  - Hecho en: `D-5`, `D2`, `D9`, `D10`.
  - Impacto: fortalece `validacion server-first`, `feedback`, `contratos de action data`.
- Dominio tasks colaborativo:
  - Hecho en: `D7`, `D8`, `D9`.
  - Impacto: fortalece `modelado de dominio`, `permisos`, `notificaciones`, `historial`.
- Refactor y calidad estructural:
  - Hecho en: `D10`.
  - Impacto: fortalece `detectar sobrecarga`, `extraer componentes`, `naming`, `dead code cleanup`.

### Lo que se mejora en lo que queda (D11 a D18)

- Seguridad aplicada (gap principal):
  - Se trabaja en: `D11` (confirm email, policy password, hardening auth), `D17` (permisos Team), `D18` (logging y controles).
  - Checklist objetivo: OWASP basico, token seguro, permisos finos, no confiar en UI.
- Testing automatizado:
  - Se trabaja en: `D14` (unit/integration/e2e smoke), `D18` (CI/CD checks).
  - Checklist objetivo: pasar de validacion manual a suite minima confiable.
- Query/Zustand con criterio formal:
  - Se trabaja en: `D13` (adopcion por slices, notifications header, stores UI globales).
  - Checklist objetivo: justificar `Query vs Zustand` sin mezcla de fuentes de verdad.
- Operacion real (DevOps/rollback/observabilidad):
  - Se trabaja en: `D14`, `D18`.
  - Checklist objetivo: CI/CD, rollback <span style="color:#0ea5e9">(volver rapido a version estable)</span>, logs utiles.
- Data model de negocio avanzado (Team + Billing):
  - Se trabaja en: `D15`, `D16`, `D17`.
  - Checklist objetivo: modelado relacional con estados, permisos por capacidad, reglas de asignacion.

### Mapa rapido por area (donde aprendes cada una)

- Frontend UX + componentes:
  - Ya trabajado: `D2`, `D4`, `D5`, `D9`, `D10`.
  - Por reforzar: `D12` (base visual y feedback consistente).
- Backend y reglas de negocio:
  - Ya trabajado: `D5`, `D7`, `D8`, `D9`, `D10`.
  - Por reforzar: `D11`, `D16`, `D17`.
- Seguridad:
  - Ya trabajado: base parcial en auth actual.
  - Por reforzar fuerte: `D11` + `D17`.
- Testing/calidad:
  - Ya trabajado: QA manual recurrente.
  - Por reforzar fuerte: `D14` + `D18`.
- Operacion/entrega:
  - Ya trabajado: disciplina de refactor y cleanup.
  - Por reforzar fuerte: `D18` (CI/CD + branch protection + release checks).

### Lectura ejecutiva (donde estas parado hoy)

- Fortaleza actual: arquitectura, criterio de producto, UX, refactor, comunicacion tecnica.
- Medio (hay base, falta consistencia): modelado de datos avanzado, query/store strategy formal, demos portfolio empaquetadas.
- Gap principal: testing automatizado, seguridad aplicada de punta a punta, operacion real (CI/CD/rollback/observabilidad).
