# Architecture — Cloudflax (Frontend)

Documentación de la estructura, patrones y reglas de diseño del frontend. El proyecto está configurado manualmente (no proviene del scaffold de `create-next-app`).

---

## 1. Stack Tecnológico

- **Framework**: Next.js 16 (App Router). Desarrollo con Turbopack (`next dev --turbopack`).
- **UI**: React 19.
- **Lenguaje**: TypeScript 5 (strict; prohibido `any`).
- **Estilos**: Tailwind CSS 4 (clases utilitarias exclusivamente).
- **Componentes/UI**: shadcn/ui, Radix UI, `next-themes` (tema claro/oscuro).
- **Autenticación**: NextAuth.js v5 (`next-auth`).
- **Linting**: ESLint 9 + `eslint-config-next`.
- **Imports**: Alias `@/*` apunta a la raíz del proyecto (ej. `@/features/auth/components/login-form`).

---

## 2. Arquitectura Feature-Driven

El proyecto se organiza por **dominios de negocio** (features), no solo por capas técnicas. Cada feature es autónomo y agrupa sus propios componentes, actions, hooks, servicios y tipos.

### 2.1 Estructura de Directorios

```
cloudflax/
├── app/                        ← Routing y layouts (App Router)
│   ├── api/                    ← Route handlers
│   │   └── auth/[...nextauth]/ ← NextAuth route handler
│   ├── (auth)/                 ← Grupo: login, register, forgot-password, confirm-email
│   │   └── layout.tsx
│   ├── (store)/                ← Grupo: tienda pública
│   │   └── layout.tsx
│   ├── dashboard/              ← Panel de administración
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx              ← Root layout (ThemeProvider, fonts)
│
├── features/                   ← Lógica de negocio por dominio
│   ├── auth/
│   │   ├── components/         ← login-form, register-form, etc.
│   │   └── actions/            ← login, logout, register
│   ├── dashboard/
│   │   └── components/         ← app-sidebar, nav-main, nav-user, etc.
│   ├── products/               ← (futuro) catálogo
│   ├── orders/                 ← (futuro) pedidos
│   └── cart/                   ← (futuro) carrito
│
├── components/                 ← Componentes globales
│   ├── ui/                     ← Primitivos shadcn/ui (generados por CLI)
│   └── shared/                 ← Componentes compartidos (theme-provider, etc.)
│
├── lib/                        ← Utilidades globales
│   ├── utils.ts                ← Helpers: cn(), etc.
│   └── constants.ts            ← Constantes: APP_NAME, ROUTES, etc.
│
├── hooks/                      ← Hooks globales (use-mobile, etc.)
├── types/                      ← Tipos/interfaces compartidos entre features
├── services/                   ← Clientes API globales (futuro)
│
├── auth.ts                     ← Configuración NextAuth (providers, callbacks)
└── middleware.ts               ← Protección de rutas (/dashboard)
```

### 2.2 Principios de Organización

| Principio | Descripción |
|---|---|
| **Feature-first** | Cada dominio de negocio (auth, dashboard, products...) agrupa su propio código |
| **Autonomía** | Un feature contiene todo lo necesario para funcionar: components, actions, hooks, types |
| **No imports cruzados** | Un feature nunca importa directamente de otro feature |
| **Global = compartido** | Si algo lo usan 2+ features, se mueve a `components/shared/`, `hooks/`, `types/` o `lib/` |
| **app/ delgado** | Las páginas en `app/` solo hacen routing y composición; la lógica vive en `features/` |

### 2.3 Anatomía de un Feature

```
features/<nombre>/
├── components/       ← Componentes React del feature
├── actions/          ← Server actions ("use server")
├── hooks/            ← Hooks específicos del feature
├── services/         ← Llamadas API (fetch, clients)
└── types.ts          ← Tipos e interfaces locales
```

No todas las subcarpetas son obligatorias — crea solo las que necesites.

---

## 3. Patrones y Reglas de Componentes

- **Server vs Client**:
  - **Server Components**: Opción por defecto para páginas y layouts (Rendimiento/SEO).
  - **Client Components**: Solo para interactividad (`useState`, `useEffect`) o APIs del navegador.
- **Componentización**: Diseño de componentes pequeños, atómicos, funcionales y reutilizables.
- **Datos y Fetch**: Uso de Server Components asíncronos con el caché nativo de Next.js.
- **Server Actions**: Viven dentro de `features/<nombre>/actions/` con la directiva `"use server"`.

---

## 4. Calidad, UX y Accesibilidad

- **Gestión de Estados**: Implementación obligatoria de `loading.tsx`, `error.tsx` y estados vacíos.
- **Accesibilidad**: Uso de HTML semántico y atributos `aria-*` en componentes personalizados.
- **shadcn/ui**: Los primitivos en `components/ui/` se generan con la CLI de shadcn. No modificarlos manualmente.

---

## 5. Workflow del Desarrollador

1. **Localizar**: Identificar el feature y componentes afectados (`@/features/<nombre>/...`).
2. **Planear**: Proponer cambios con análisis de pros y contras.
3. **Implementar**: Código dentro del feature correspondiente; mover a global si se comparte.
4. **Validar**: Ejecutar `npm run lint`, `npm run typecheck` y `npm run build` antes de finalizar.
