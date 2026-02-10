# 🎯 MVP v0.1 – Alcance Funcional

Este documento define el alcance estricto de la primera versión (**v0.1**) de FeatureLab.

> Para ver la visión de largo plazo, revisa [PRODUCT.md](./PRODUCT.md).
> Para ver detalles de implementación técnica, revisa [ARQUITECTURE.md](./ARQUITECTURE.md).

---

## 🏁 Objetivo del MVP

Construir una base funcional sólida que permita gestionar tareas personales y feature flags básicos, validando nuestra arquitectura "Fullstack Remix/RR7 + Drizzle".

## ✅ Alcance Incluido

### 1. Autenticación Básica

- [x] Registro de usuario con Email y Password.
- [x] Login (creación de sesión).
- [x] Logout (destrucción de sesión).
- [x] Protección de rutas privadas (middleware/loaders).

### 2. Gestión de Tareas (Personal)

- [x] **Listar:** Ver mis tareas pendientes.
- [x] **Crear:** Título (requerido), Descripción, Prioridad.
- [x] **Editar:** Cambiar estado (Todo -> Done) y prioridad.
- [x] **Filtrar:** Ver solo tareas "En progreso" o "Completadas".

### 3. Feature Flags (Básico)

- [x] **Listar:** Ver mis flags.
- [x] **Crear:** Definir `key` (ej: `beta-ui`) y descripción.
- [x] **Toggle:** Activar/Desactivar flag rápidamente.
- [x] **Entorno:** Distinción visual simple entre flags `dev` y `prod`.

### 4. UI/UX Esencial

- [x] Layout principal (Sidebar + Header + Contenido).
- [x] Diseño responsivo básico.
- [x] Feedback de usuario (Toasts de éxito/error).

---

## 🚫 Fuera de Alcance (v0.1)

Estas funcionalidades quedan explícitamente **posponidas** para la v0.2 o posterior:

- ❌ **Equipo/Workspaces:** Todo es personal por ahora.
- ❌ **Pagos (Stripe):** No hay tiers ni cobros.
- ❌ **Auth Social:** Solo email/password por ahora.
- ❌ **Integraciones:** Nada de Slack ni Email notifications.
- ❌ **API Pública:** No expondremos endpoints REST todavía.
- ❌ **Tests E2E:** Setup inicial de Vitest si, pero cobertura completa no.

---

## 📋 Checklist de Entrega

- [ ] DB Schema (`users`, `tasks`, `flags`) definido en Drizzle.
- [ ] Repositorios SQLite implementados.
- [ ] UI Components (`Button`, `Input`, `Card`) creados.
- [ ] Rutas principales funcionando en `localhost`.
