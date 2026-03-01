# Study Note - Day 11 Account: Modal pattern + Profile placeholders

## Context

- Goal: cerrar la base del panel `/account` con UX consistente y estructura mantenible.
- Scope de este bloque:
  - cards resumen 2x2 en account.
  - 4 secciones abiertas en modal (`Perfil`, `Preferencias`, `Seguridad`, `Plan`).
  - `Perfil` con campos v1 persistentes y el resto como placeholders claros.

## Decision

- Se adopta un patron unico:
  - resumen en cards.
  - edicion en modal.
  - secciones reutilizables con `asCard={false}` dentro del modal.
- Se mantiene persistencia real solo para:
  - `displayName`
  - `phone`
  - `about`
- Se agregan campos de perfil extendido como placeholders `"Proximamente"` para definir UX sin comprometer modelo de datos todavia.

## Profile layout definido

- `Work`:
  - Organization
  - Department
  - Started working on
  - Manager
  - Work phone
- `Expertise`:
  - Applications
  - Languages
  - Programming languages
  - Skills
  - Certifications
- `Location`:
  - Country
  - City
  - Address
- `Other`:
  - Driver license
  - Additional details

## Why this is correct now

- Evita meter tablas nuevas sin cerrar primero el flujo de cuenta.
- Alinea UX con lo que queremos para Portfolio (ficha tipo Jira, iterativa).
- Deja claro que falta persistir datos extendidos en un paso posterior.

## What was reinforced

- Separacion entre:
  - UI contract actual.
  - persistencia v1.
  - scope futuro.
- Refactor por vertical (layout + seccion + server action), no por archivo aislado.

## Next step (Day 11)

- Hardening auth:
  - `confirmEmail` cliente/server.
  - policy de password unica entre register y cambio de password.
  - luego verificacion de email por link con token y expiracion.
