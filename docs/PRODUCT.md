# FeatureLab - Documento de Producto

## 1. Contexto del proyecto

FeatureLab es un proyecto de estudio fullstack.  
No esta pensado para venta ni lanzamiento comercial.

Objetivo:
- practicar construccion de producto end-to-end;
- mantener una arquitectura ordenada por capas y features;
- aprender stack moderno con casos reales (no solo demos).

## 2. Problema que modela

Simula un equipo de producto que necesita:
- planificar y ejecutar trabajo con tasks;
- habilitar y deshabilitar funcionalidades con feature flags;
- operar desde un hub central;
- sumar cuenta, plan e integraciones externas en etapas posteriores.

## 3. Vision del producto (Tasks-first)

El foco principal es `Tasks` y colaboracion.  
`Flags` es un modulo de soporte operativo para controlar rollout de funcionalidades.

Vistas objetivo:
- Home (`/`) como `Execution Hub`;
- Tasks (`/tasks`) en modo lista y board;
- Flags (`/flags`) para administracion;
- User Panel (`/account` o `/settings`);
- Billing/Plan (inicialmente dentro de User Panel).

## 4. Alcance funcional objetivo

### 4.1 Home (`/`) - Execution Hub
- resumen de estado de tasks;
- actividad reciente;
- quick actions;
- accion inline para crear task (dialog/sheet);
- bloque admin de `Feature Switches`;
- toggle de tema;
- feedback de acciones via toast.

### 4.2 Tasks (`/tasks`)
- CRUD base;
- evolucion a UX de producto: filtros URL, estados vacios y feedback claro;
- board tipo Jira (`To Do`, `In Progress`, `QA`, `Ready to Go Live`);
- drag and drop + actualizacion optimista;
- asignaciones, permisos y trazabilidad;
- enriquecimiento funcional: due date, tags, checklist, comentarios.

### 4.3 Flags (`/flags`)
- gestion de flags de producto;
- control por environment (`development` y `production`) desde una misma entidad;
- toggle y rollout por porcentaje por entorno;
- panel operativo en Home para admins;
- bootstrap de flags base para dar sentido real al modulo.

### 4.4 User Panel (`/account` o `/settings`)
- perfil y seguridad;
- preferencias de interfaz;
- sincronizacion de tema y defaults de uso;
- base para plan/billing.

## 5. Integraciones objetivo (etapas posteriores)

- Stripe (planes, checkout, webhooks, limites);
- Slack API (notificaciones operativas);
- Gemini API (sugerencias de tareas/subtareas);
- GitHub Actions (CI/CD con checks de calidad).

## 6. Calidad y criterios de cierre

El producto se considera bien encaminado cuando:
- no hay errores silenciosos en flows criticos;
- contratos de datos son estables y tipados;
- rutas quedan como orquestadores y logica en `features/*/server/*`;
- UX principal se percibe de producto real, no CRUD basico;
- existe base de testing (unit, integration, e2e smoke).

## 7. Estado y fuente de verdad

- Fuente de verdad de plan y detalle de ejecucion: `docs/PRODUCT_ROADMAP.md`.
- Este documento resume vision y alcance.
- Si hay conflicto entre ambos, prevalece `docs/PRODUCT_ROADMAP.md`.

## 8. Documentos relacionados

- `docs/PRODUCT_ROADMAP.md`
- `docs/ARQUITECTURE.md`
- `docs/STACK.md`
- `docs/INTERNAL_DELIVERY_PLAN.md`
- `docs/INTERNAL_STUDY_PLAN.md`
