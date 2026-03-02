# Study Note - Day 11 Account: Preferences + Plan closure

## Context

- Objetivo: cerrar Dia 11 de `/account` con funcionalidades reales en `Preferencias` y `Plan`.
- Scope ejecutado:
  - Preferencias persistidas.
  - Plan Free visible con limites y CTA de upgrade.
  - Tema centralizado en `Account > Preferencias`.

## Decisions

- Se eligio `cookie` como persistencia base de preferencias de usuario.
- Se aplica prioridad de estado en tasks: `URL params > preferencias persistidas > defaults`.
- Se removio el toggle de tema del header para evitar dos puntos de verdad de UX.
- `Plan` queda en modo pre-billing: informacion real de estado + limite + CTA, sin checkout.

## What was implemented

- `PreferencesSection` con:
  - `theme` (`system | light | dark`)
  - `density` (`comfortable | compact`)
  - defaults de tasks (`view`, `order`, `scope`)
- `PlanSection` con:
  - plan actual `Free`
  - limites del plan
  - CTA `Upgrade (Coming soon)`
- Loader de tasks consume preferencias cuando la URL no trae filtros.

## Why this shape is correct now

- Evita sobreingenieria (sin store global innecesario para este flujo).
- Mantiene coherencia de producto: un solo lugar para preferencias.
- Deja base lista para P3.1 (billing real + capacidad manager).

## Learning checkpoint

- Diferenciar `estado de UI local` vs `preferencia persistida`.
- Definir fuente de verdad por flujo para evitar bugs de sincronizacion.
- Cerrar primero contrato funcional antes de migrar a Query/Zustand profundo.
