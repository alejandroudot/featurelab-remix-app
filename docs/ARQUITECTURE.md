# Arquitectura - FeatureLab

Este documento describe la arquitectura tecnica del proyecto y como se organiza el codigo.

## 1. Principios

- `routes/*` orquestan request/response.
- `features/*/server/*` concentran logica de loader/action e intents.
- `core/*` define dominio, tipos, esquemas y puertos.
- `infra/*` implementa persistencia e integraciones.
- `ui/*` contiene componentes compartidos y layout.

Objetivo:
- mantener separacion de responsabilidades;
- evitar deuda tecnica temprana;
- facilitar testing y evolucion por feature.

## 2. Estilo arquitectonico

Se usa un enfoque pragmatico de:
- base de Hexagonal / Clean Architecture;
- arquitectura por capas;
- organizacion por feature;
- puertos/adaptadores en dominio-infra.

No se busca pureza academica extrema: se aplica Hexagonal/Clean de forma pragmatica,
priorizando claridad operativa y velocidad de iteracion para un proyecto de estudio real.

## 3. Estructura del proyecto

```text
app/
  routes/                    # borde HTTP (orquestacion)
  features/                  # UI de feature + server logic por feature
    <feature>/
      server/
  core/                      # dominio (tipos, schemas, puertos, servicios)
  infra/                     # adapters (sqlite, auth, flags, tasks, theme cookies, etc.)
  ui/                        # design system, primitives y layout compartido
```

## 4. Responsabilidades por capa

### 4.1 `core/*`

- contratos del dominio (`*.types.ts`, `*.port.ts`);
- reglas y servicios de negocio (`*.service.ts`);
- validaciones (`*.schema.ts`).

No debe depender de `features/*` ni `routes/*`.

### 4.2 `infra/*`

- implementaciones de puertos del dominio;
- acceso a DB (Drizzle + SQLite);
- utilidades de entorno y cookies (ej: tema).

No define reglas de UI ni manejo de vistas.

### 4.3 `features/*`

- componentes de pantalla por modulo (`tasks`, `flags`, `home`, `auth`);
- logica server de la feature en `features/*/server/*`;
- mapeo de errores de action y parseo de intents.

### 4.4 `routes/*`

- entrada HTTP;
- autenticacion/autorizacion;
- llamada a helpers de feature/server;
- respuesta final (data o redirect/json).

## 5. Modelo de datos (estado actual de diseño)

### Tasks

- entidad principal de trabajo;
- estado, prioridad y metadata operativa;
- evolucion planificada a asignaciones, trazabilidad y board colaborativo.

### Flags

- una flag por `key` de producto;
- estado por environment dentro de la misma entidad:
  - `development`
  - `production`
- soporte de tipo:
  - `boolean`
  - `percentage` (rollout por entorno)

Esto permite combinaciones como:
- dev on / prod off,
- dev off / prod on,
- ambos on,
- ambos off.

## 6. Patrones de actions y errores

Se estandariza en features:
- parseo de `intent` por schema;
- validacion de payload con Zod;
- respuesta de errores consistente:
  - `fieldErrors`
  - `formError`
  - `values`

Objetivo:
- cero fallos silenciosos;
- preservar inputs en errores de validacion;
- simplificar manejo en componentes de formulario.

## 7. UI y sistema de componentes

- Base visual con Tailwind v4.
- Componentes productivos con `shadcn/ui`.
- Primitives de comportamiento con Radix cuando hace falta control fino.
- Componentes compartidos en `app/ui/primitives` y `app/ui/layout`.
- UI especifica de feature dentro de cada modulo en `app/features/*`.

## 8. Estado cliente y datos remotos

Direccion definida por roadmap:
- Zustand para estado global de UI/preferencias;
- TanStack Query para cache, invalidacion y optimistic updates.

Nota:
- no todo estado debe ir a store global;
- URL y server siguen siendo fuentes importantes de verdad.

## 9. Integraciones y calidad (etapas posteriores)

Planificadas en roadmap:
- Stripe;
- Slack API;
- Gemini API;
- GitHub Actions (CI/CD).

Calidad tecnica objetivo:
- lint + typecheck limpios;
- pruebas unit/integration;
- smoke e2e.

## 10. Regla de mantenimiento

- Fuente de verdad de alcance y orden de implementacion: `docs/PRODUCT_ROADMAP.md`.
- Este documento describe el "como" tecnico.
- Si hay desalineacion, se corrige primero el roadmap y luego esta arquitectura.
