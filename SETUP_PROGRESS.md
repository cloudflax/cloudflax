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
- **429:** opcional; el cliente puede mostrar mensaje con `Retry-After` si el API lo envía (mismo patrón que forgot).

### `GET /auth/verify-email` (relacionado con CA-5)

- **Query:** `token` (string).
- **Llamada desde frontend:** `GET {BACKEND_URL}/auth/verify-email?token=…` vía `verifyEmail()` en `features/auth/services/auth.ts`; la página RSC `app/(auth)/auth/verify-email/page.tsx` muestra éxito o error (`ApiError` + `parseApiErrorBody` o fallback).

**Alineación pendiente con backend — idempotencia y re-ejecución**

| Tema | Pregunta para el API / equipo backend | Acordado (rellenar tras alinear) |
|------|---------------------------------------|----------------------------------|
| Mismo enlace abierto otra vez cuando el correo **ya** estaba verificado | ¿Respuesta `200` idempotente con mensaje coherente? ¿Otro status (`409`, `422`, …)? ¿Efectos secundarios no deseados al repetir? | |
| Token inválido vs expirado | ¿Se diferencia en HTTP o en cuerpo/mensaje? ¿Qué debe mostrar la UI en cada caso? | |

### Política del token enviado en el correo de reset

El enlace al usuario usa `token` en query en el frontend (`/auth/reset-password?token=…`); el valor lo emite y valida el backend.

| Tema | Pregunta para el API / equipo backend | Acordado (rellenar tras alinear) |
|------|---------------------------------------|----------------------------------|
| Caducidad (TTL) | ¿Cuánto tiempo es válido el token desde el envío del correo? | |
| Uso del token | ¿Un único `POST /auth/reset-password` exitoso invalida el token? ¿Reintentos con el mismo token tras error (p. ej. validación de contraseña)? | |
| Varios correos / varios tokens | ¿Un nuevo `POST /auth/forgot-password` invalida tokens anteriores del mismo usuario? | |
| Abuso y límites | ¿Hay rate limiting u otras reglas además del `429` ya contemplado en forgot? ¿Alguno específico en reset? | |

**Registro:** cuando el equipo complete las columnas *Acordado*, anotar **fecha** y, si aplica, enlace a issue/ADR; entonces se puede marcar el ítem *Seguimiento backend* de la Fase B.

---

## 6. Superficie frontend (referencia)

| Ruta / artefacto | Rol |
|------------------|-----|
| `/forgot-password` | Formulario forgot + estados |
| `/auth/verify-email` | Verificación de correo con `token` en query (RSC + `verifyEmail`) |
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
- [ ] **QA manual (entorno real):** Probar en **staging** (u otro entorno con **correo real**): **forgot → recepción del email → abrir el enlace → reset de contraseña → login.** Hasta que esta verificación esté hecha **y este checkbox marcado**, el ítem sigue abierto para el cierre de spec de la Fase A.

#### Checklist de QA manual (ejecutar en staging o equivalente)

Registrar **entorno** (URL frontend, que `BACKEND_URL` apunte al API correcto) y **email de prueba** con buzón real.

| # | Acción | Resultado esperado (trazado a REQ/CA) |
|---|--------|----------------------------------------|
| 1 | Ir a `/forgot-password`, enviar un **email registrado** (trimado). | Mensaje de éxito **neutral**; no indica si el email existe (REQ-2, CA-1). |
| 2 | Revisar correo. | Llega el mail; el enlace apunta a `{FRONTEND_URL}/auth/reset-password?token=…` (ver sección 1). |
| 3 | Abrir el enlace (idealmente ventana o perfil limpio). | Formulario de reset; token tomado de query (REQ-3). |
| 4 | Enviar contraseña nueva **8–72** caracteres y confirmación **coincidente**. | UI de éxito; camino claro a `/login` (REQ-4, REQ-5, REQ-6, CA-2, CA-4). |
| 5 | Ir a `/login` e iniciar sesión con **la nueva contraseña**. | Sesión correcta (CA-2, alineado con outcome §3). |
| 6 | *Opcional CA-1:* repetir paso 1 con email **no** registrado. | Mismo mensaje de éxito que en el paso 1. |
| 7 | *Opcional CA-3 / regresión:* abrir `/auth/reset-password` sin `token` o con token inválido/expirado. | Error comprensible y siguiente paso claro (enlace a forgot o login). |
| 8 | *Opcional CA-5:* flujo breve de `/auth/verify-email` (enlace válido) y login habitual. | Sin regresiones respecto al comportamiento previo. |

**Cierre:** si todas las filas obligatorias (1–5) pasan, anotar **fecha** y **nota breve** (p. ej. incidencias o “OK”) debajo del checklist y marcar el checkbox **QA manual** de la Fase A.

### Fase B — Calidad y consistencia (post-core)

- [x] Errores API alineados: `rateLimitUserMessage` compartido (forgot + reset), `verify-email` usa `parseApiErrorBody`; reset trata **429** y fallback con código de estado si no hay cuerpo parseable.
- [ ] **Seguimiento backend (manual):** Completar las tablas *Acordado* en la **sección 5** (`GET /auth/verify-email` y política del token de reset) con lo que defina el API / equipo backend, y registrar fecha o referencia (issue, ADR). Hasta entonces el ítem sigue abierto; la **plantilla** en la sección 5 ya está lista para rellenar.

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

- **CA-1…CA-5** en entorno de prueba: dependen del **QA manual** de la Fase A (flujo completo hasta login) y, donde corresponda, de lo **acordado con backend** (verify-email, límites del token).
- **Pipeline local del repo:** `lint` → `typecheck` → `test` → `build` sin fallos. En desarrollo habitual suele cumplirse al iterar; para el **cierre formal** de esta spec, ejecutar la secuencia completa una vez antes de marcar el cierre y, si ayuda al equipo, anotar fecha o resultado del QA junto al checklist de la sección 8.

**Resumen de pendientes ejecutables desde frontend / verificación:** lo único que este documento deja como verificación **ejecutable** antes de dar la spec por cerrada es el **QA manual** del flujo completo (y marcar el checkbox o una nota breve al validarlo). El ítem de backend es **coordinación y documentación de contrato**, no código frontend pendiente listado como implementación.
