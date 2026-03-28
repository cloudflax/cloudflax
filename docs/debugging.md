# Debugging

## Errores comunes

### Server vs Client Components

**Error**: `Error: Cannot use useState in a Server Component`

**Causa**: Usar hooks o APIs del navegador en un Server Component.

**Solución**: Agregar `'use client'` al archivo.

---

**Error**: `Error: Cannot read properties of undefined`

**Causa**: Intentar pasar datos del servidor a un Client Component sin tipado.

**Solución**: Tipar las props del componente.

```typescript
// ✅ Correcto
export function ProductCard({ product }: { product: Product }) { ... }

// ❌ Incorrecto
export function ProductCard({ product }: any) { ... }
```

---

### Imports

**Error**: `Cannot find module '@/features/...'`

**Causa**: El alias `@/*` no está configurado en `tsconfig.json`.

**Verificar**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

**Error**: `Feature X is importing from Feature Y`

**Causa**: Violación de la regla de arquitectura.

**Solución**: Mover el código compartido a carpeta global (`components/shared/`, `hooks/`, `types/`).

---

### Tipado

**Error**: `Property 'xxx' does not exist on type 'any'`

**Causa**: Uso de `any` en lugar de interfaces tipadas.

**Solución**: Definir interfaz clara para las props.

---

### Server Actions

**Error**: `useActionState` returns `undefined` for `prevState`

**Causa**: El segundo argumento debe ser el estado inicial, no `undefined` en algunos casos.

**Solución**: Proporcionar estado inicial vacío:

```typescript
const [state, formAction] = useActionState(action, { success: false })
```

---

### API Client

**Error**: `ApiError: Unexpected end of JSON input`

**Causa**: La respuesta del backend no es JSON válido.

**Solución**: Verificar que el backend retorna `Content-Type: application/json`.

---

## Checklist de debugging

1. ¿Tiene `'use client'` si usa hooks o APIs del navegador?
2. ¿Están tipadas todas las props?
3. ¿Usa `@/*` para imports del proyecto?
4. ¿Los servicios usan `authenticatedApi` para endpoints protegidos?
5. ¿El error viene del servidor o del cliente?
