# Cloudflax

**Tu central de comercio electrónico.** Una SaaS pensada para emprendedores que venden por internet: un espacio único donde gestionar ventas, catálogos, envíos y marketing.

## ¿Qué es Cloudflax?

Cloudflax es una plataforma de comercio electrónico centralizada. En lugar de que cada emprendedor monte su propia infraestructura, ofrecemos **millones de tiendas dentro de una sola SaaS**: cada vendedor tiene su espacio para operar su negocio de forma sencilla y escalable.

### Lo que pueden hacer los emprendedores

- **Gestionar ventas** — Pedidos, cobros y facturación en un solo lugar.
- **Catálogos de productos** — Organizar y publicar su oferta con facilidad.
- **Gestionar envíos** — Seguimiento, etiquetas y logística integrada.
- **Campañas de marketing** — Promociones, descuentos y comunicación con clientes.
- *Y más en camino.*

Todo centralizado, sin tener que preocuparse por servidores ni integraciones dispersas.

## Stack técnico

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5** (strict)
- **Tailwind CSS 4**
- **shadcn/ui** + Radix UI
- **NextAuth.js v5** (autenticación)

## Estructura del proyecto

El proyecto sigue una **arquitectura feature-driven**: cada dominio de negocio agrupa sus componentes, actions, hooks y tipos. Solo lo verdaderamente compartido vive en carpetas globales.

```
cloudflax/
├── app/                  ← Routing y layouts (App Router)
├── features/             ← Lógica de negocio por dominio
│   ├── auth/             ← Autenticación (components, actions)
│   ├── dashboard/        ← Panel de administración (components)
│   ├── products/         ← Catálogo de productos (futuro)
│   ├── orders/           ← Gestión de pedidos (futuro)
│   └── cart/             ← Carrito de compras (futuro)
├── components/           ← Componentes globales
│   ├── ui/               ← Primitivos shadcn/ui
│   └── shared/           ← Componentes compartidos entre features
├── lib/                  ← Utilidades globales (utils, constants)
├── hooks/                ← Hooks globales
├── types/                ← Tipos compartidos entre features
├── services/             ← Clientes API globales (futuro)
├── auth.ts               ← Configuración NextAuth
└── middleware.ts          ← Middleware de autenticación
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo con Turbopack
npm run dev

# Build de producción
npm run build

# Lint y typecheck
npm run lint
npm run typecheck

# Formatear código
npm run format
```

## Documentación del proyecto

- [AGENTS.md](./AGENTS.md) — Directrices para agentes de IA y desarrollo.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Arquitectura, estructura y decisiones técnicas.
- [SKILLS.md](./SKILLS.md) — Capacidades y conocimientos requeridos.

---

*Cloudflax — Comercio electrónico centralizado para emprendedores.*
