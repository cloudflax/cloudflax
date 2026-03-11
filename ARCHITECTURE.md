# Architecture — Cloudflax (Frontend)

Documentación de la estructura, patrones y reglas de diseño del frontend.

---

## 1. Stack Tecnológico

- **Framework**: Next.js 16 (App Router).
- **UI Library**: React 19.
- **Lenguaje**: TypeScript (Tipado estricto, prohibido el uso de `any`).
- **Estilos**: Tailwind CSS 4 (Clases utilitarias exclusivamente).
- **Linting**: ESLint 9 + `eslint-config-next`.

---

## 2. Estructura de Directorios

- **`app/`**: Rutas, layouts, páginas y estados globales (loading/error).
- **`components/`**: UI reutilizable; separación de presentación y lógica (containers).
- **`lib/`**: Lógica de dominio, servicios de API y utilidades puras.

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

1. **Localizar**: Identificar componentes y rutas mediante búsqueda semántica.
2. **Planear**: Proponer cambios con análisis de pros y contras.
3. **Validar**: Ejecución de `npm run lint` y `npm run build` antes de finalizar.
