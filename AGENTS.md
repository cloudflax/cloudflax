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

- **Imports**: `@/*` → raíz del proyecto (`@/features/...`, `@/components/...`)
- **Ubicación**: Feature usa `features/<nombre>/`; lo compartido va a `components/shared/`, `hooks/`, `types/`
- **Componentes**: Server por defecto; `'use client'` solo para interactividad
- **Types**: Interfaces claras, prohibido `any`
- **Validación**: `lint → typecheck → test → build`

## Índice

| Sección      | Archivo                                        | Descripción                   |
| ------------ | ---------------------------------------------- | ----------------------------- |
| Stack        | [docs/stack.md](docs/stack.md)                 | Tecnologías, aliases          |
| Comandos     | [docs/commands.md](docs/commands.md)           | Scripts npm                   |
| Arquitectura | [docs/architecture.md](docs/architecture.md)   | Estructura, features, imports |
| Componentes  | [docs/components.md](docs/components.md)       | Reglas, Server vs Client      |
| UX           | [docs/ux.md](docs/ux.md)                       | Carga, errores, accesibilidad |
| Comunicación | [docs/communication.md](docs/communication.md) | Flujo de comunicación         |
