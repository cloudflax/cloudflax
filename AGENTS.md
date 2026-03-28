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
- `npm run test` — pruebas Node (`node:test`, TypeScript vía `--experimental-strip-types`)
- `npm run format` — Prettier en `**/*.{ts,tsx}`

## Arquitectura Feature-Driven

Organización **por dominio de negocio**: lo específico de un feature vive en `features/<nombre>/`, lo compartido en carpetas globales.

### Estructura de directorios

```
cloudflax/
├── app/                        ← Routing, layouts, pages
│   ├── api/                    ← Route handlers
│   ├── (auth)/                 ← Grupo de autenticación
│   ├── (store)/                ← Grupo de tienda pública
│   └── dashboard/              ← Panel de administración
│
├── features/                   ← Lógica por dominio
│   ├── <feature>/
│   │   ├── components/         ← Componentes del feature
│   │   ├── actions/            ← Server actions
│   │   ├── hooks/              ← Hooks del feature
│   │   ├── services/           ← Llamadas API
│   │   └── types.ts            ← Tipos locales
│   ├── auth/                   ← Feature de autenticación
│   └── dashboard/              ← Feature del panel
│
├── components/
│   ├── ui/                     ← shadcn/ui (no modificar manualmente)
│   └── shared/                 ← Compartidos entre features
│
├── lib/
│   ├── utils.ts                ← cn, helpers
│   └── constants.ts            ← Rutas, constantes de la app
│
├── hooks/                      ← Hooks globales
├── types/                      ← Tipos compartidos
├── services/                   ← Clientes API globales
│
├── auth.ts                     ← Configuración NextAuth
└── middleware.ts               ← Middleware de autenticación
```

**Regla**: Si algo lo usan ≥2 features → carpeta global. Si es solo de un feature → dentro de su carpeta.

## Reglas de Componentes

- **Jerarquía**: Componentes pequeños, atómicos y reutilizables.
- **Server vs Client**: Server Components por defecto; `'use client'` solo para interactividad (hooks, eventos, APIs del navegador).
- **Type-Safety**: Props con interfaces claras. Prohibido `any`.
- **Estilos**: Clases utilitarias de Tailwind 4. Respeta tokens de color y espaciado.

## UX y Calidad

- **Carga**: `loading.tsx` o skeletons para procesos asíncronos.
- **Errores**: Error Boundaries con mensajes claros.
- **A11y**: Elementos semánticos (`main`, `nav`, `section`) y `aria-*` en componentes interactivos.
- **Validación**: `npm run lint` → `typecheck` → `test` → `build`.

## Flujo de Comunicación

- Explica los cambios en español de forma concisa.
- Resume: **Qué** se cambió, **Por qué** (decisión técnica) y si hay pasos manuales (ej. `npm install`).
