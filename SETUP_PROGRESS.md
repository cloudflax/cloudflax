# SETUP_PROGRESS (SDD) — Forgot/Reset Password

Documento base (compacto) para implementación guiada por especificación.

## 1) Problema

El backend ya soporta recuperación de contraseña, pero el frontend no completa el flujo del enlace enviado por email.

## 2) Estado actual (fuente de verdad)

- Backend (`api.cloudflax`):
  - `POST /auth/forgot-password` (envía correo si aplica).
  - `POST /auth/reset-password` (token + nueva contraseña).
  - Link del email: `{FRONTEND_URL}/auth/reset-password?token=<token>`.
- Frontend (`cloudflax`):
  - Existe `/forgot-password` UI, sin integración real.
  - Existe `/auth/verify-email`.
  - No existe `/auth/reset-password`.
  - `proxy.ts` no incluye `/auth/reset-password`.

## 3) Objetivo (Outcome)

Usuario recibe email, abre link, define nueva contraseña, y puede volver a login.

## 4) Especificación funcional (SDD)

### 4.1 Requisitos

- R1: `/forgot-password` debe llamar `POST /auth/forgot-password`.
- R2: Crear `/auth/reset-password` que lea `token` de query.
- R3: Form de reset debe llamar `POST /auth/reset-password` con `{ token, password }`.
- R4: Validar en UI:
  - `token` requerido.
  - `password` min 8, max 72.
  - confirmación coincide.
- R5: Estados UX claros: `idle | loading | success | error`.
- R6: No filtrar existencia de usuario en forgot-password (mensaje genérico).

### 4.2 Contratos API (mínimos)

- `POST /auth/forgot-password`
  - req: `{ email: string }`
  - ok: `200` + mensaje genérico
  - limit: `429` + `Retry-After`
- `POST /auth/reset-password`
  - req: `{ token: string, password: string }`
  - ok: `200` + mensaje éxito
  - negocio: `422` token inválido/expirado

### 4.3 Rutas frontend

- Mantener: `/forgot-password`
- Crear: `/auth/reset-password`
- Ajustar `proxy.ts`: agregar `/auth/reset-password` a rutas auth/matcher.

## 5) Plan de implementación (checklist)

- [ ] `features/auth/types`: agregar tipos request/response de forgot/reset.
- [ ] `features/auth/services/auth.ts`: agregar `requestPasswordReset` y `resetPassword`.
- [ ] `app/(auth)/forgot-password/page.tsx`: conectar submit a API y estados.
- [ ] `app/(auth)/auth/reset-password/page.tsx`: nueva página con token + formulario.
- [ ] `proxy.ts`: incluir `/auth/reset-password`.
- [ ] QA manual: flujo completo desde link de email.

## 6) Criterios de aceptación

- CA1: Al enviar email válido/no válido en forgot, UI siempre muestra mensaje neutral.
- CA2: Link con token válido permite reset y muestra éxito.
- CA3: Link sin token o token inválido muestra error accionable.
- CA4: Usuario puede volver a `/login` al finalizar.
- CA5: Sin regresión en `/auth/verify-email`.

## 7) Riesgos y decisiones

- Riesgo: duplicar validaciones backend/frontend -> mantener reglas mínimas en UI (8-72).
- Riesgo: UX inconsistente en errores API -> normalizar con `ApiError` + mensaje fallback.
- Decisión: usar patrón existente de `verify-email` para minimizar superficie nueva.
