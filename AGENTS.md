## Agents — Cloudflax (Frontend)

Este documento establece las directrices operativas que deben seguir los agentes de Cursor para garantizar la consistencia arquitectónica, la calidad del código y la velocidad de entrega.

**Contexto**: El proyecto no proviene del scaffold de `create-next-app`; está configurado manualmente (Next.js, Tailwind, ESLint, etc.). Respeta la estructura y dependencias actuales.

## Stack tecnológico

- **Framework**: Next.js 16 (`next`) — App Router, dev con Turbopack (`next dev --turbopack`)
- **UI**: React 19 (`react`, `react-dom`)
- **Lenguaje**: TypeScript 5 (strict)
- **Estilos**: Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/postcss`)
- **Componentes/UI**: shadcn/ui, Radix UI, `next-themes` para tema
- **Autenticación**: NextAuth.js v5 (`next-auth`)
- **Linting**: ESLint 9 + `eslint-config-next`
- **Alias**: `@/*` → raíz del proyecto (imports tipo `@/features/auth/...`, `@/components/ui/...`)

## Comandos

- `npm run dev` — desarrollo con Turbopack
- `npm run build` — build de producción
- `npm run start` — servir build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript sin emitir
- `npm run format` — Prettier en `**/*.{ts,tsx}`

## Arquitectura Feature-Driven

El proyecto usa una organización **por dominio de negocio**. Cada feature agrupa todo lo suyo; solo lo compartido vive en carpetas globales.

### Regla de oro

> Si un componente, hook, action o tipo **solo lo usa un feature**, vive dentro de `features/<nombre>/`. Si lo usan **2+ features**, va a la carpeta global correspondiente (`components/shared/`, `hooks/`, `types/`, `lib/`).

### Estructura de directorios

```
cloudflax/
├── app/                        ← Solo routing, layouts, pages
│   ├── api/                    ← Route handlers (API)
│   ├── (auth)/                 ← Grupo de rutas de autenticación
│   ├── (store)/                ← Grupo de rutas de la tienda pública
│   └── dashboard/              ← Panel de administración
│
├── features/                   ← Lógica de negocio por dominio
│   ├── <feature>/
│   │   ├── components/         ← Componentes del feature
│   │   ├── actions/            ← Server actions del feature
│   │   ├── hooks/              ← Hooks del feature
│   │   ├── services/           ← Llamadas API del feature
│   │   └── types.ts            ← Tipos del feature
│   ├── auth/
│   └── dashboard/
│
├── components/                 ← Componentes globales
│   ├── ui/                     ← Primitivos shadcn/ui (no modificar manualmente)
│   └── shared/                 ← Compartidos entre features (theme-provider, etc.)
│
├── lib/                        ← Utilidades globales
│   ├── utils.ts                ← Helpers (cn, etc.)
│   └── constants.ts            ← Constantes de la app (rutas, nombre, etc.)
│
├── hooks/                      ← Hooks globales (use-mobile, etc.)
├── types/                      ← Tipos compartidos entre features
├── services/                   ← Clientes API globales (futuro)
│
├── auth.ts                     ← Configuración NextAuth
└── middleware.ts               ← Middleware de autenticación
```

### Crear un nuevo feature

1. Crear carpeta `features/<nombre>/`.
2. Agregar subcarpetas según necesidad: `components/`, `actions/`, `hooks/`, `services/`.
3. Opcionalmente crear `types.ts` para tipos locales del feature.
4. Las páginas en `app/` importan desde `@/features/<nombre>/...` y componen.

### Imports entre features

- Un feature **nunca importa directamente** de otro feature.
- Si dos features necesitan compartir algo, moverlo a `components/shared/`, `hooks/`, `types/` o `lib/`.

## Reglas de Componentes

- **Jerarquía**: Mantén componentes pequeños, atómicos y reutilizables.
- **Server vs Client**:
  - Usa **Server Components** por defecto para fetching de datos y SEO.
  - Usa **Client Components** (`'use client'`) estrictamente para interactividad (hooks, eventos) o APIs del navegador.
- **Type-Safety**: Define interfaces claras para todas las *props*. Prohibido usar `any`.
- **Estilos**: Usa exclusivamente clases utilitarias de Tailwind 4. Respeta el sistema de diseño (tokens de color y espaciado).

## Calidad y Experiencia de Usuario (UX)

- **Estados de Carga**: Implementa siempre `loading.tsx` o esqueletos (skeletons) para procesos asíncronos.
- **Manejo de Errores**: Usa Error Boundaries y muestra mensajes claros al usuario en caso de fallos de red.
- **Accesibilidad (A11y)**: Usa elementos semánticos (main, nav, section) y atributos `aria-*` en componentes interactivos complejos.
- **Validación Final**: Antes de entregar, ejecuta `npm run lint`, `npm run typecheck` y `npm run build`.

## Flujo de Comunicación

- Explica los cambios en español de forma concisa.
- Resume: **Qué** se cambió, **Por qué** (decisión técnica) y si hay pasos manuales (ej. `npm install`).
