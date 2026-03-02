# Auth - Email Verification (modo de uso)

## Estado actual

Implementado:
- generacion de token en register;
- almacenamiento hasheado en `email_verification_tokens`;
- expiracion y single-use del token;
- route de confirmacion `/auth/verify-email?token=...`;
- bloqueo de login si `emailVerifiedAt` es `null`.

Pendiente:
- adapter SMTP/dev inbox y provider productivo (planificado para fase de integraciones).

## Flujo funcional

1. Usuario se registra en `/auth/register`.
2. Se crea usuario con `emailVerifiedAt = null`.
3. Se genera token de verificacion (TTL 24h).
4. Se envia link de verificacion via `EmailService`.
5. Usuario abre `/auth/verify-email?token=...`.
6. Si el token es valido, se marca `users.emailVerifiedAt`.
7. Recien ahi puede iniciar sesion.

## Modos de envio (definicion objetivo)

### 1) Local por defecto (`log/dev sink`)

- Uso: desarrollo diario rapido.
- Comportamiento: el link se loggea en consola (`[email][verification-link]`).
- Ventaja: cero dependencia externa.

### 2) Local opcional (`smtp-dev inbox`)

- Uso: QA manual de email en entorno local.
- Comportamiento: envio SMTP a inbox local (MailHog/Mailpit).
- Ventaja: experiencia cercana a produccion sin proveedor externo.

### 3) Produccion (`provider real`)

- Uso: entorno deployado.
- Comportamiento: envio real por proveedor transaccional (ej: Resend/SendGrid/SMTP provider).
- Requisito: credenciales y dominio configurados.

## Prueba manual minima

1. `npm run db:push`
2. Registrar usuario.
3. Tomar `verifyUrl` desde logs del server.
4. Abrir link de verificacion.
5. Confirmar que login funciona luego de verificar.
6. Reusar el mismo token: debe fallar (ya usado).

