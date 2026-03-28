# Reglas de Componentes

## Jerarquía

Componentes pequeños, atómicos y reutilizables.

## Naming

| Tipo         | Convención                | Ejemplo                     |
| ------------ | ------------------------- | --------------------------- |
| Componentes  | PascalCase                | `ProductCard`, `UserAvatar` |
| Hooks        | camelCase + prefijo `use` | `useAuth`, `useCart`        |
| Utils/Helper | camelCase                 | `formatDate`, `cn`          |
| Constantes   | SCREAMING_SNAKE_CASE      | `MAX_ITEMS`, `API_URL`      |

## Server vs Client Components

- **Server Components** (por defecto): fetching de datos, SEO
- **Client Components** (`'use client'`): interactividad, hooks, APIs del navegador

```typescript
// Server Component (async, sin 'use client')
async function ProductList() {
  const data = await fetchProducts();
  return <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Client Component (con 'use client')
'use client';
import { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Type-Safety

Props con interfaces claras. Prohibido `any`.

```typescript
// ✅ Correcto
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

// ❌ Incorrecto
interface ButtonProps {
  any
}
```

## Estilos

Clases utilitarias de Tailwind CSS 4. Respeta tokens de color y espaciado.
