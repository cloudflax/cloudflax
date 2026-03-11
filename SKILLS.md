## Skills — Cloudflax

Capacidades y conocimientos esperados para trabajar en este proyecto.

---

## Skill Expectations

- **Assume senior frontend knowledge** — No explicar conceptos básicos de HTML, CSS, JS o React.
- **Do not explain basic TypeScript/React syntax** — Asumir dominio de TS y React. Ir directo al punto.
- **Focus on arquitectura, DX y UX** — Priorizar decisiones de diseño, patrones, accesibilidad y tradeoffs.
- **Align with Next.js App Router** — Seguir convenciones modernas (server/client components, rutas, layouts).

---

## Skills del agente

El agente de IA debe dominar:

| Área                        | Conocimiento requerido                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**              | Tipado estricto, types vs interfaces, utility types comunes, evitar `any`, tipos de props y retornos explícitos                                                                                |
| **React 19**                | Componentes funcionales, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`), composición de componentes, lifting state up                                       |
| **Next.js 16 (App Router)** | Estructura `app/`, layouts anidados, server vs client components, data fetching en server components, `fetch` con caché de Next, metadata, routing dinámico, segmentación por features         |
| **Tailwind CSS 4**          | Diseño con clases utilitarias, responsive design, dark mode si aplica, uso consistente de espaciados, tipografías y colores del proyecto                                                       |
| **Estado y datos**          | Gestión de estado local y compartido con hooks/context, patrones de lifting state, integración con APIs REST del backend, manejo de loading/error/empty states                                 |
| **Accesibilidad (a11y)**    | Uso de elementos semánticos (`<button>`, `<nav>`, `<main>`, etc.), atributos `aria-`\* cuando haya componentes personalizados, focus management básico                                         |
| **Performance frontend**    | Code splitting, lazy loading cuando tiene sentido, evitar renders innecesarios (memoización razonable), cuidado con efectos costosos en client components                                      |
| **Linting y calidad**       | ESLint 9, `eslint-config-next`, interpretación de reglas comunes, corrección de lints sin desactivar reglas salvo casos muy justificados                                                       |
| **Testing**                 | Tests de componentes con librería de testing de React (p. ej. React Testing Library), pruebas de rutas y comportamiento crítico, preferencia por tests orientados a comportamiento del usuario |
| **Arquitectura**            | Organización por features/módulos, separación clara de UI pura vs lógica de datos, reutilización de componentes, evitar duplicación y acoplamiento fuerte                                      |

---

## Skills del equipo

Quien contribuya debe conocer:

- **React + TypeScript** — Nivel intermedio/avanzado (hooks, tipado de props/estado, composición).
- **Next.js moderno (App Router)** — Rutas en `app/`, server components por defecto, client components solo cuando se necesiten APIs del navegador o estado interactivo complejo.
- **HTTP/REST** — Consumo de APIs (GET/POST/PUT/DELETE), status codes, manejo de errores en UI.
- **Diseño y UX básicas** — Layouts responsivos, jerarquía visual, formularios usables, feedback de carga/errores.
- **Accesibilidad básica** — Navegación por teclado, etiquetas correctas en formularios, roles y `aria-`\* cuando haga falta.
- **Git** — Branching, commits claros, revisión de PRs, respeto a hooks/lint antes de merge.
- **Docker / Devcontainer** — Uso básico del entorno de desarrollo si el proyecto lo requiere.

---

## Skills del proyecto

Tecnologías y prácticas del stack:

| Tecnología / Práctica             | Uso                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Next.js 16**                    | Framework principal para la aplicación web (App Router, server/client components)                |
| **React 19**                      | Librería de UI base                                                                              |
| **TypeScript**                    | Tipado estático fuerte en todo el código                                                         |
| **Tailwind CSS 4**                | Sistema de estilos principal mediante utilidades                                                 |
| **ESLint 9 + eslint-config-next** | Linter y reglas de estilo/consistencia específicas de Next                                       |
| **Devcontainer / Docker**         | Entorno de desarrollo aislado y reproducible (si está configurado en el repo)                    |
| **Gestor de paquetes JS**         | Gestión de dependencias y scripts de desarrollo/build (`npm`, `pnpm` o `yarn` según el proyecto) |
| **Arquitectura feature-driven**   | Organización del código por dominios/funcionalidades, no solo por capas técnicas                 |
| **Server Components por defecto** | Páginas y layouts como Server Components; Client Components solo cuando sea necesario            |

---
