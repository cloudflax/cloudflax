## Agents — Cloudflax (Frontend)

Este documento establece las directrices operativas que deben seguir los agentes de Cursor para garantizar la consistencia arquitectónica, la calidad del código y la velocidad de entrega.

**Contexto**: El proyecto no proviene del scaffold de `create-next-app`; está configurado manualmente (Next.js, Tailwind, ESLint, etc.). Respeta la estructura y dependencias actuales.

## Stack tecnológico

- **Framework**: Next.js 16 (`next`) — App Router, dev con Turbopack (`next dev --turbopack`)
- **UI**: React 19 (`react`, `react-dom`)
- **Lenguaje**: TypeScript 5 (strict)
- **Estilos**: Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/postcss`)
- **Componentes/UI**: shadcn/ui, Radix UI, `next-themes` para tema
- **Linting**: ESLint 9 + `eslint-config-next`
- **Alias**: `@/*` → raíz del proyecto (imports tipo `@/components/...`)

## Comandos

- `npm run dev` — desarrollo con Turbopack
- `npm run build` — build de producción
- `npm run start` — servir build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript sin emitir
- `npm run format` — Prettier en `**/*.{ts,tsx}`

## Reglas de Arquitectura y Componentes

- **Jerarquía de Componentes**: Mantén componentes pequeños, atómicos y reutilizables.
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

