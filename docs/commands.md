# Comandos npm

| Comando             | Descripción                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | Desarrollo con Turbopack                                                |
| `npm run build`     | Build de producción                                                     |
| `npm run start`     | Servir build                                                            |
| `npm run lint`      | ESLint                                                                  |
| `npm run typecheck` | TypeScript sin emitir                                                   |
| `npm run test`      | Pruebas Node (`node:test`, TypeScript vía `--experimental-strip-types`) |
| `npm run format`    | Prettier en `**/*.{ts,tsx}`                                             |

## Orden de validación

```
npm run lint → typecheck → test → build
```
