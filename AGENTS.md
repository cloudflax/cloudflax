# Agents — Cloudflax (Frontend)

Directrices operativas para agentes de Cursor.

## Índice

| Sección      | Archivo                                        | Descripción                   |
| ------------ | ---------------------------------------------- | ----------------------------- |
| Stack        | [docs/stack.md](docs/stack.md)                 | Tecnologías, aliases          |
| Comandos     | [docs/commands.md](docs/commands.md)           | Scripts npm                   |
| Arquitectura | [docs/architecture.md](docs/architecture.md)   | Estructura, features, imports |
| Componentes  | [docs/components.md](docs/components.md)       | Reglas, Server vs Client      |
| UX           | [docs/ux.md](docs/ux.md)                       | Carga, errores, accesibilidad |
| Comunicación | [docs/communication.md](docs/communication.md) | Flujo de comunicación         |

## Reglas de oro

- Feature: `features/<nombre>/` — todo lo suyo
- Global: `components/shared/`, `hooks/`, `types/` — compartido
- Server Components por defecto; `'use client'` solo para interactividad
- Type-Safety: interfaces claras, prohibido `any`
- Validación: `lint → typecheck → test → build`
