# UX y Calidad

## Estados de Carga

Implementar siempre `loading.tsx` o skeletons para procesos asíncronos.

## Manejo de Errores

Usar Error Boundaries con mensajes claros al usuario.

## Accesibilidad (A11y)

- Elementos semánticos: `<main>`, `<nav>`, `<section>`, `<header>`, `<footer>`
- Atributos `aria-*` en componentes interactivos complejos

```tsx
<button aria-label="Cerrar menú" onClick={onClose}>
  <X aria-hidden="true" />
</button>
```

## Validación antes de entregar

```bash
npm run lint → typecheck → test → build
```
