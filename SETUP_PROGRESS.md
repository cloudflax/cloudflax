# Spec — Recuperación de contraseña (forgot / reset)

Documento bajo **Spec-Driven Development (SDD)**: la especificación guía la implementación; el código debe poder trazarse a un requisito o criterio de aceptación.

**Cómo usar este doc**

1. **Congelar el contrato**: API y reglas de negocio acordados antes de tocar UI.
2. **Implementar contra la spec**: cada tarea del plan enlaza con un `REQ` o `CA`.
3. **Cerrar con verificación**: criterios de aceptación + `lint` → `typecheck` → `test` → `build` (ver `AGENTS.md`).
4. **Versionar por fase**: al terminar una fase del plan (§8), un **solo commit** que cubra solo esa fase; mensajes en inglés, [Conventional Commits](https://www.conventionalcommits.org/) (detalle en §7).

---

## 1. Contexto

| Ámbito | Nota |
|--------|------|
| Backend | `POST /auth/forgot-password`, `POST /auth/reset-password`. Enlace del email: `{FRONTEND_URL}/auth/reset-password?token=…` |
| Frontend | App Next.js; rutas públicas de auth listadas en `proxy.ts` (`ROUTES` en `lib/constants.ts`) |
| Patrones | Cliente llama API vía `features/auth/services/auth.ts`; errores con `ApiError` y `parseApiErrorBody` |

---

## 2. Problema

Garantizar que un usuario con enlace de correo pueda **restablecer la contraseña** sin fricción, sin filtrar si el email existe en “olvidé mi contraseña”, y con mensajes de error **accionables** en reset.

---

## 3. Outcome (éxito medible)

Tras recibir el correo, el usuario abre el enlace, establece una contraseña válida, ve confirmación clara y puede **volver a iniciar sesión** en `/login`.

---

## 4. Especificación funcional

| ID | Requisito |
|----|-----------|
| **REQ-1** | La pantalla `/forgot-password` envía `POST /auth/forgot-password` con `{ email }` trimado. |
| **REQ-2** | Tras un envío exitoso, la UI muestra **siempre** el mismo mensaje neutro (no revelar si el email está registrado). |
| **REQ-3** | Existe `/auth/reset-password` que lee `token` de query. Sin token válido en contexto de uso: estado de error accionable. |
| **REQ-4** | El formulario de reset llama `POST /auth/reset-password` con `{ token, password }`. |
| **REQ-5** | Validación mínima en cliente: `password` longitud 8–72; confirmación coincide con `password`. |
| **REQ-6** | Estados UX explícitos: *idle → loading → success* o *error* (forgot y reset). |
| **REQ-7** | Respuesta HTTP **429** en forgot: mensaje al usuario usando `Retry-After` cuando exista. |
| **REQ-8** | `proxy.ts`: ruta `/auth/reset-password` incluida en lista auth y en `matcher`, alineado con `ROUTES`. |

---

## 5. Contratos API (mínimos)

### `POST /auth/forgot-password`

- **Body:** `{ "email": string }`
- **200:** respuesta genérica compatible con mensaje neutral en UI.
- **429:** opcional `Retry-After` (header), tratado en cliente.

### `POST /auth/reset-password`

- **Body:** `{ "token": string, "password": string }`
- **200:** éxito; UI muestra confirmación y enlace a login.
- **422 (u otro acordado):** token inválido o expirado → mensaje claro; sin datos sensibles.

---

## 6. Superficie frontend (referencia)

| Ruta / artefacto | Rol |
|------------------|-----|
| `/forgot-password` | Formulario forgot + estados |
| `/auth/reset-password` | Token en query + formulario reset |
| `features/auth/types.ts` | Tipos forgot / reset |
| `features/auth/services/auth.ts` | `requestPasswordReset`, `resetPassword` |
| `proxy.ts` | Matcher y redirecciones auth/dashboard |

---

## 7. Commits por fase (Git)

**Regla:** un commit cuando **todos** los ítems de una fase están hechos (no mezclar Fase A y B en el mismo commit). Si solo actualizas esta spec, puede ser un commit aparte `docs(spec): …`.

| Momento | Qué incluye el commit | Mensaje sugerido (inglés) |
|--------|------------------------|---------------------------|
| Cierre **Fase A** (código) | Tipos, servicios, páginas forgot/reset, `proxy.ts` | `feat(auth): add forgot and reset password flow` |
| Cierre **Fase A** (solo QA + doc) | Notas breves en este archivo o checklist marcado tras prueba en staging | `docs(auth): complete password reset spec QA` o `chore(auth): verify forgot-reset flow in staging` |
| Cierre **Fase B** | Ajustes de errores / alineación con backend | `refactor(auth): align reset password error handling` (o `fix` si corrige bug visible) |

Antes de pushear código de una fase, ejecuta al menos lo que toque el cambio (`lint` → `typecheck`; `test` / `build` si afecta comportamiento crítico). Convención del repo: `docs/communication.md` § Commits.

---

## 8. Plan de trabajo

### Fase A — Implementación core

- [x] Tipos request/response forgot + reset en `features/auth/types`.
- [x] Servicio: `requestPasswordReset` y `resetPassword` en `features/auth/services/auth.ts`.
- [x] `/forgot-password`: submit integrado, mensaje neutral, manejo de `429`.
- [x] `/auth/reset-password`: página + formulario + validación 8–72 y confirmación.
- [x] `proxy.ts`: `ROUTES.resetPassword` y entrada en `matcher`.
- [ ] **QA manual:** flujo desde email real (staging): forgot → correo → reset → login.

### Fase B — Calidad y consistencia (post-core)

- [x] Errores API alineados: `rateLimitUserMessage` compartido (forgot + reset), `verify-email` usa `parseApiErrorBody`; reset trata **429** y fallback con código de estado si no hay cuerpo parseable.
- [ ] **Seguimiento backend (manual):** idempotencia de `GET` verify-email y límites de uso del token de reset — documentar en contrato de API; no bloquea el cierre funcional del frontend.

---

## 9. Criterios de aceptación

| ID | Criterio |
|----|----------|
| **CA-1** | Forgot: mismo mensaje de éxito para email existente o inexistente (REQ-2). |
| **CA-2** | Reset con token válido: contraseña actualizada y UI de éxito + acceso a `/login`. |
| **CA-3** | Sin token o token inválido/expirado: error comprensible y siguiente paso claro (p. ej. volver a forgot o login). |
| **CA-4** | Enlaces y copy permiten volver a `/login` al terminar el flujo. |
| **CA-5** | Sin regresión en `/auth/verify-email` ni en el login tras los cambios. |

---

## 10. Riesgos y decisiones

| Tipo | Descripción |
|------|-------------|
| **Riesgo** | Duplicar reglas con el backend → mantener solo validación **mínima** en UI (8–72 + confirmación). |
| **Riesgo** | Errores API heterogéneos → centralizar parsing y mensaje fallback. |
| **Decisión** | Reutilizar patrones de otras pantallas auth (feedback, shell, `ApiError`) para mantener UX homogénea. |

---

## 11. Definición de hecho (DoD)

- Criterios **CA-1…CA-5** verificados en entorno de prueba.
- Pipeline local del repo: `lint` → `typecheck` → `test` → `build` sin fallos.
