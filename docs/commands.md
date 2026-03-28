# Comandos npm

## Uso frecuente

| Comando             | Descripción                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | Desarrollo con Turbopack                                                |
| `npm run lint`      | ESLint                                                                  |
| `npm run typecheck` | TypeScript sin emitir                                                   |
| `npm run test`      | Pruebas Node (`node:test`, TypeScript vía `--experimental-strip-types`) |

## Build y producción

| Comando         | Descripción         |
| --------------- | ------------------- |
| `npm run build` | Build de producción |
| `npm run start` | Servir build        |

## Utilidades

| Comando          | Descripción                 |
| ---------------- | --------------------------- |
| `npm run format` | Prettier en `**/*.{ts,tsx}` |

## Orden de validación

```
npm run lint → typecheck → test → build
```
