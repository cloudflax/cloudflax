# Architecture — Cloudflax (Frontend)

Documentación de la estructura, patrones y reglas de diseño del frontend. El proyecto está configurado manualmente (no proviene del scaffold de `create-next-app`).

---

## 1. Stack Tecnológico

- **Framework**: Next.js 16 (App Router). Desarrollo con Turbopack (`next dev --turbopack`).
- **UI**: React 19.
- **Lenguaje**: TypeScript 5 (strict; prohibido `any`).
- **Estilos**: Tailwind CSS 4 (clases utilitarias exclusivamente).
- **Componentes/UI**: shadcn/ui, Radix UI, `next-themes` (tema claro/oscuro).
- **Linting**: ESLint 9 + `eslint-config-next`.
- **Imports**: Alias `@/*` apunta a la raíz del proyecto (ej. `@/components/ui/button`).

---

## 2. Estructura de Directorios

- **`app/`**: Rutas (App Router), layouts, páginas, `loading.tsx` y `error.tsx`.
- **`components/`**: UI reutilizable; `components/ui/` para primitivos (shadcn); separación presentación/lógica cuando aplique.
- **`lib/`**: Utilidades (`utils.ts`), lógica de dominio y servicios de API.

---

## 3. Patrones y Reglas de Componentes

- **Server vs Client**:
  - **Server Components**: Opción por defecto para páginas y layouts (Rendimiento/SEO).
  - **Client Components**: Solo para interactividad (`useState`, `useEffect`) o APIs del navegador.
- **Componentización**: Diseño de componentes pequeños, atómicos, funcionales y reutilizables.
- **Datos y Fetch**: Uso de Server Components asíncronos con el caché nativo de Next.js.

---

## 4. Calidad, UX y Accesibilidad

- **Gestión de Estados**: Implementación obligatoria de `loading.tsx`, `error.tsx` y estados vacíos.
- **Accesibilidad**: Uso de HTML semántico y atributos `aria-*` en componentes personalizados.

---

## 5. Workflow del Desarrollador

1. **Localizar**: Identificar componentes y rutas (p. ej. búsqueda semántica o por `@/`).
2. **Planear**: Proponer cambios con análisis de pros y contras.
3. **Validar**: Ejecutar `npm run lint`, `npm run typecheck` y `npm run build` antes de finalizar.
