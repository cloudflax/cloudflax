# Arquitectura Feature-Driven

Organización **por dominio de negocio**: lo específico de un feature vive en `features/<nombre>/`, lo compartido en carpetas globales.

## Estructura de directorios

```
cloudflax/
├── app/                        ← Routing, layouts, pages
│   ├── api/                    ← Route handlers
│   ├── (auth)/                 ← Grupo de autenticación
│   ├── (store)/                ← Grupo de tienda pública
│   └── dashboard/              ← Panel de administración
│
├── features/                   ← Lógica por dominio
│   ├── <feature>/
│   │   ├── components/         ← Componentes del feature
│   │   ├── actions/            ← Server actions
│   │   ├── hooks/              ← Hooks del feature
│   │   ├── services/           ← Llamadas API
│   │   └── types.ts            ← Tipos locales
│   ├── auth/                   ← Feature de autenticación
│   └── dashboard/              ← Feature del panel
│
├── components/
│   ├── ui/                     ← shadcn/ui (no modificar manualmente)
│   └── shared/                 ← Compartidos entre features
│
├── lib/
│   ├── utils.ts                ← cn, helpers
│   └── constants.ts            ← Rutas, constantes de la app
│
├── hooks/                      ← Hooks globales
├── types/                      ← Tipos compartidos
├── services/                   ← Clientes API globales
│
├── auth.ts                     ← Configuración NextAuth
└── middleware.ts               ← Middleware de autenticación
```

## Regla de ubicación

> Si algo lo usan **≥2 features** → carpeta global. Si es solo de un feature → dentro de su carpeta.

**Carpetas globales:**

- `components/shared/` — componentes compartidos
- `hooks/` — hooks globales
- `types/` — tipos compartidos
- `lib/` — utilidades

## Imports entre features

- Un feature **nunca importa directamente** de otro feature.
- Si dos features necesitan compartir algo, moverlo a carpeta global.
