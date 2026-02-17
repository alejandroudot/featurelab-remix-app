# FeatureLab: Documento de Producto

## 1. Que es este proyecto

FeatureLab es un proyecto de estudio fullstack para practicar construccion de producto con una arquitectura ordenada.
No se penso para venta ni para lanzamiento comercial.

Objetivo del proyecto:
- aprender a disenar y mantener un producto con modulos reales;
- practicar decisiones de arquitectura y calidad tecnica;
- integrar funcionalidades de negocio (tasks, flags, cuenta, billing, integraciones) en una base coherente.

## 2. Problema que modela

El proyecto modela un equipo de producto que necesita:
- organizar tareas de trabajo;
- controlar despliegues con feature flags;
- operar todo desde un hub central;
- gestionar cuenta, preferencias y plan.

## 3. Alcance funcional del proyecto (version objetivo)

### 3.1 Home (`/`) - Execution Hub
- resumen operativo de tasks;
- actividad reciente;
- quick actions a vistas clave;
- quick action de `Crear task` con evolucion a flujo inline (modal/sheet);
- bloque de feature switches para admins;
- toggle de tema (light/dark) y preferencias sincronizadas.

### 3.2 Tasks (`/tasks`)
- CRUD de tasks;
- estados de flujo: `todo`, `in-progress`, `qa`, `ready-to-go-live`, `done`;
- prioridades, labels, fechas y filtros por URL;
- asignacion y reasignacion de responsables;
- vista lista + vista board estilo kanban;
- drag and drop con actualizacion optimista;
- historial de cambios y base de colaboracion.

### 3.3 Flags (`/flags`)
- CRUD de feature flags;
- toggle ON/OFF;
- rollout por porcentaje;
- separacion por environment (`development` y `production`);
- uso operativo desde el Hub para validar valor real del modulo.

### 3.4 User Panel (`/account` o `/settings`)
- perfil y seguridad;
- preferencias de interfaz y trabajo;
- gestion de tema y defaults de vistas;
- estado de plan y base para billing.

## 4. Integraciones objetivo del proyecto

- Stripe: planes, checkout, webhooks y limites por suscripcion.
- Slack API: notificaciones operativas y eventos relevantes.
- Gemini API: sugerencias asistidas para tareas/subtareas.
- GitHub Actions: CI/CD con lint, typecheck, tests y smoke e2e.

## 5. Criterios de calidad buscados

- arquitectura consistente por capas y features;
- errores visibles en UI (sin fallos silenciosos);
- contratos tipados y validacion de entrada/salida;
- trazabilidad de cambios en flujos importantes;
- base de tests (unit, integration, e2e smoke).

## 6. Alcance de aprendizaje (por que existe)

Este proyecto existe para practicar, de forma aplicada:
- React Router fullstack + TypeScript;
- modelado de dominio con validaciones;
- estado cliente con Zustand y data fetching con TanStack Query;
- diseno de UI de producto con shadcn/ui y primitives de Radix;
- integraciones externas y automatizacion de calidad.

## 7. Documentos relacionados

- roadmap de implementacion: `docs/PRODUCT_ROADMAP.md`
- stack tecnico: `docs/STACK.md`
- plan interno de entrega: `docs/INTERNAL_DELIVERY_PLAN.md`
- plan interno de estudio: `docs/INTERNAL_STUDY_PLAN.md`

## 8. Regla de mantenimiento

Este archivo documenta el producto que se busca construir en este repo de estudio.
Si cambia el alcance funcional o el foco de aprendizaje, se actualiza aca primero.
