# Setup Progress — Cloudflax (Frontend)

Seguimiento del avance en la implementación de auth (register/login), plantillas y dashboard.

---

## Resumen del alcance

- **Auth**: Register y Login con estructura de plantillas compartida.
- **Dashboard**: Área privada con su propia plantilla (layout).
- **Progreso**: Tareas planificadas con estado [ ] pendiente / [x] hecho.

---

## 1. Estructura de plantillas (templates)

### 1.1 Grupo de rutas Auth (`app/(auth)/`)

- [x] Crear `app/(auth)/layout.tsx` — Layout común para login y register (centrado, sin nav principal, fondo consistente).
- [x] Definir interfaz/tipo para el layout de auth (título, subtítulo opcional, children).
- [x] Opcional: componente `AuthTemplate` en `components/auth/` que reciba título y children para reutilizar la misma “card” o contenedor.

### 1.2 Páginas Auth

- [x] `app/(auth)/login/page.tsx` — Página de login usando el layout/template de auth.
- [x] `app/(auth)/register/page.tsx` — Página de registro usando el mismo layout/template de auth.
- [x] Añadir `loading.tsx` en `app/(auth)/` para estado de carga (skeleton o spinner).
- [x] Enlaces entre login ↔ register (“¿No tienes cuenta? Regístrate” / “¿Ya tienes cuenta? Inicia sesión”).

### 1.3 Grupo de rutas Dashboard (`app/(dashboard)/`)

- [x] Crear `app/(dashboard)/layout.tsx` — Layout del dashboard (sidebar/header, área de contenido).
- [x] Definir estructura del template del dashboard (slot para contenido principal).
- [x] `app/(dashboard)/dashboard/page.tsx` — Página principal del dashboard usando el template.
- [x] `app/(dashboard)/loading.tsx` — Estado de carga del dashboard.
- [x] `app/(dashboard)/error.tsx` — Error boundary para el área dashboard (requerido por ARCHITECTURE).

---

## 2. Implementación de Register

- [x] Formulario de registro (email, contraseña, confirmar contraseña, nombre si aplica).
- [x] Componente Client para el form (`components/auth/RegisterForm.tsx` o similar).
- [x] Validación básica en cliente (campos requeridos, coincidencia de contraseñas).
- [x] Mensajes de error accesibles (aria-live o rol alert).
- [x] Integración con API/backend de register (mock en `/api/auth/register`; sustituir por backend real).
- [x] Redirección tras registro exitoso (p. ej. a login o dashboard según criterio de producto).

---

## 3. Implementación de Login (ya planificado en plantillas)

- [x] Formulario de login (email, contraseña).
- [x] Componente Client para el form (`components/auth/LoginForm.tsx`).
- [x] Validación básica y manejo de errores.
- [x] Integración con API/backend de login (mock en `/api/auth/login`).
- [x] Redirección tras login (dashboard o returnUrl).

---

## 4. Rutas y navegación

- [x] En la home (`app/page.tsx`), enlaces a `/login` y `/register` (y opcionalmente a `/dashboard` para pruebas).
- [x] Protección de rutas: middleware redirige no autenticados desde `/dashboard` a `/login?returnUrl=...`.

---

## 5. Componentes compartidos

- [x] `components/auth/AuthTemplate.tsx` — Contenedor común para login/register (opcional si se hace todo en layout).
- [x] Componentes atómicos reutilizables: `Input`, `Button`, `Label` en `components/ui/`.

---

## 6. Validación final (según AGENTS.md)

- [x] `npm run lint` sin errores.
- [x] `npm run build` correcto.
- [x] Revisión de a11y en formularios (labels, aria-*, mensajes de error).

---

## Orden sugerido de ejecución

1. Estructura de plantillas: layout auth + layout dashboard + páginas placeholder.
2. AuthTemplate y páginas login/register con formularios (UI primero, sin backend).
3. Implementación de register (flujo completo cuando exista API).
4. Implementación de login (flujo completo cuando exista API).
5. Enlaces en home y, si aplica, protección de rutas (middleware).

---

## Consideraciones para la ruta de trabajo

Cosas a tener en cuenta para no dejarlas para después o para alinear decisiones.

### Decisión de sesión y estado de auth

- **Cómo saber si el usuario está logueado**: cookie (httpOnly), JWT en cookie/localStorage, o sesión en backend con cookie de sesión. Esto define cómo el middleware o los Server Components comprobarán la auth.
- **Dónde vivir la lógica**: según ARCHITECTURE, los servicios de API y lógica de dominio van en `lib/`. Conviene crear desde el inicio algo como `lib/auth/` (o `lib/api/auth.ts`) para: tipos (`User`, `Session`), función para obtener sesión (ej. `getSession()`), y llamadas a register/login. Así el middleware y los formularios reutilizan lo mismo.

### Protección de rutas y UX

- **Return URL**: si un usuario no autenticado entra a `/dashboard` y se redirige a `/login`, guardar `returnUrl` (ej. query `?returnUrl=/dashboard`) y redirigir ahí tras login evita dejarle en la home sin contexto.
- **Auth en layout**: el layout de `(dashboard)` puede comprobar sesión en el servidor y redirigir a `/login` si no hay sesión, en lugar de (o además de) middleware, para evitar flash de contenido privado.

### Validación y formularios

- **Una sola fuente de verdad**: usar una lib de validación (ej. Zod) y, si hace falta, react-hook-form permite reutilizar los mismos esquemas en cliente y (más adelante) en backend, y mejora accesibilidad de errores por campo. No está en el proyecto aún; se puede añadir cuando se implementen los forms.
- **Estado de envío**: en submit hay que mostrar loading (botón deshabilitado o spinner) y manejar error de red/timeout de forma explícita (mensaje claro + a11y).

### Calidad y arquitectura (alineado con AGENTS.md / ARCHITECTURE.md)

- **Error boundary en dashboard**: ARCHITECTURE exige `error.tsx` para gestión de errores. Mejor tratar `app/(dashboard)/error.tsx` como **obligatorio** en esta ruta, no opcional.
- **Metadata**: definir `metadata` (title, description) en cada página de auth y dashboard (ej. "Registro | Cloudflax") mejora pestaña y SEO aunque no se indexen.

### Seguridad (recordatorio)

- Formularios de login/register por **POST**; no enviar contraseñas por query params.
- En producción, auth solo por **HTTPS**.
- No loguear contraseñas ni tokens en consola.

### Futuro opcional

- **i18n**: si más adelante hay varios idiomas, tener textos de auth/dashboard en un módulo de strings o por props facilita el cambio.
- **Tests**: tests unitarios o e2e en formularios de login/register y en protección de rutas dan confianza en refactors; se pueden planificar en una fase posterior.

---

## Notas

- Backend/API de auth: por definir (endpoints, sesión, JWT/cookies).
- Diseño: usar tokens de Tailwind 4 y sistema de diseño del proyecto.
- Los nombres de archivo y rutas pueden ajustarse (ej. `sign-in`/`sign-up` en lugar de `login`/`register`).
