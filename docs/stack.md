# Stack Tecnológico

## Tecnologías principales

- **Framework**: Next.js 16 (`next`) — App Router, dev con Turbopack (`next dev --turbopack`)
- **UI**: React 19 (`react`, `react-dom`)
- **Lenguaje**: TypeScript 5 (strict)
- **Estilos**: Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/postcss`)
- **Componentes/UI**: shadcn/ui, Radix UI, `next-themes` para tema
- **Autenticación**: NextAuth.js v5 (`next-auth`)
- **Linting**: ESLint 9 + `eslint-config-next`

## Alias de imports

`@/*` → raíz del proyecto

```typescript
// Ejemplos
@import '@/features/auth/...'
@import '@/components/ui/...'
@import '@/lib/utils'
```

## Contexto

El proyecto no proviene del scaffold de `create-next-app`; está configurado manualmente (Next.js, Tailwind, ESLint, etc.). Respeta la estructura y dependencias actuales.
