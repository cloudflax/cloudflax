# SDD: Reducir llamadas innecesarias a `GET /users/me` en el dashboard

Documento de **Spec-Driven Development**: define el *qué* y los criterios de *hecho* antes de implementar. La implementación debe cumplir este spec (ajustar el spec si el contexto cambia).

---

## 1. Contexto

Hoy, cada navegación dentro del dashboard dispara de nuevo la resolución del layout (RSC) y la función `getAuthenticatedUserState()` (`features/auth/services/session.ts`), que llama al backend `GET /users/me`. Eso genera tráfico y latencia sin un beneficio claro en cada click del menú.

---

## 2. Objetivo

- Reducir la frecuencia de `GET /users/me` en navegación rutinaria del dashboard.
- Forzar datos actualizados cuando el negocio o la seguridad lo requieren (no depender solo de la suerte).

## 3. No objetivos

- Eliminar por completo la validación frente al backend donde haga falta detectar sesión inválida.
- Cache agresivo de permisos o datos sensibles sin estrategia de invalidación explícita.
- Fijar un “máximo N peticiones por minuto” como política principal (preferir TTL + invalidación).

---

## 4. Requisitos funcionales

| ID | Requisito |
|----|-----------|
| R1 | Tras una carga exitosa de perfil, las lecturas posteriores en un intervalo acotado **no** deben llamar al backend si el dato sigue considerado válido (política de frescura configurable; valor inicial sugerido: **≤ 60 s**). |
| R2 | Cualquier evento de **invalidación** debe provocar que la siguiente lectura vuelva a ir al backend (o equivalente definido en implementación). Eventos mínimos: `401` / sesión inválida, **logout**, **éxito de actualización de perfil** (`PATCH` u operación equivalente). |
| R3 | La UI del shell del dashboard (menú, usuario) debe seguir mostrando datos coherentes: no flicker grave ni estado “vacío” intermitente sin criterio definido en UX. |
| R4 | Comportamiento en errores: si el backend falla tras invalidación, el spec de errores existente del proyecto aplica; no silenciar `401` / usuario eliminado. |

---

## 5. Criterios de aceptación (verificables)

- **A1:** Con sesión válida, N navegaciones consecutivas entre rutas bajo `/dashboard` en menos del TTL **no** producen N llamadas `GET /users/me` (definir N en prueba; ej. ≥ 5 en &lt; 60 s ⇒ 1 llamada al backend en ese tramo, salvo invalidación).
- **A2:** Tras simular o ejecutar actualización de perfil exitosa, la siguiente visualización del shell refleja el cambio (o fuerza refetch según decisión de diseño documentada en sub-§ 6.1).
- **A3:** Tras `401` o flujo de logout documentado, no queda perfil “cacheado” mostrándose como autenticado.

---

## 6. Decisiones de implementación (rellenar antes de codificar)

El spec **no** impone una sola técnica. La opción elegida se documenta aquí y debe enlazar con R1–R4.

### 6.1 Estrategia elegida

- [x] Caché en capa servidor (p. ej. Next `unstable_cache` / `fetch` con revalidación).
- [ ] Caché en cliente (p. ej. Context + TTL): solo coherente si el shell **deja de depender** de un `GET /users/me` en cada petición del layout RSC; implica repartir claramente qué resuelve servidor vs cliente.
- [ ] Datos mínimos en sesión (claims) para el shell + `GET /users/me` solo donde haga falta.
- [ ] Otra: _______________

**TTL acordado:** 60 s (`AUTH_USER_ME_CACHE.revalidateSeconds` en `lib/constants.ts`).

**Invalidación explícita (disparadores):** `revalidateTag` vía `invalidateAuthenticatedUserProfileCache(accessToken)` en `features/auth/services/session.ts` — llamado desde `logout` (`features/auth/actions/auth.ts`); también tras `401` / usuario no encontrado en la respuesta de `/users/me`, y tras fallo de reintento con token refrescado. Las futuras server actions de actualización de perfil (`PATCH` / equivalente) deben llamar a `invalidateAuthenticatedUserProfileCache` con el token de la sesión en el mismo handler.

---

## 7. Referencias en código

- `getAuthenticatedUserState`: `features/auth/services/session.ts`
- Layout dashboard: `app/dashboard/layout.tsx`
- Usos adicionales: `app/dashboard/page.tsx`, `app/dashboard/account/page.tsx`

---

## 8. Estado del spec

| Campo | Valor |
|-------|--------|
| Estado | Aprobado (§ 6.1 cerrado; implementación en curso) |
| Autor / fecha | — |

Tras aprobar § 6.1, pasar estado a **Aprobado** y abrir tareas de implementación enlazadas a A1–A3.
