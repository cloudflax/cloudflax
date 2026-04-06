import Link from "next/link"
import {
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-muted/30 px-4 py-10 lg:px-8 lg:py-14">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-2">
        <aside className="hidden px-4 py-6 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center text-sm font-semibold text-primary">
              <Store className="mr-2 size-4" />
              Comercio y operaciones
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight">
              Gestiona tu negocio con una experiencia fluida y segura
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Accede al panel y administra productos, pedidos y clientes en un
              solo lugar
            </p>
          </div>

          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-center gap-2.5 text-sm">
              <ShieldCheck className="size-4" />
              Proteccion de sesion y credenciales
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <LayoutDashboard className="size-4" />
              Acceso rapido al dashboard de operaciones
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <ShoppingBag className="size-4" />
              Gestion conectada con la tienda
            </div>
          </div>
        </aside>

        <div className="flex flex-col">
          <div className="mb-6 flex justify-center sm:justify-start">
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight">
              <Sparkles className="size-4 text-primary" />
              Cloudflax
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            {children}
          </div>

          <nav
            className="mt-10 flex flex-col items-center gap-2 sm:mt-8"
            aria-label="Navegación secundaria"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-11 min-w-[min(100%,17.5rem)] cursor-pointer rounded-full border-border/80 bg-background/90 px-6 shadow-sm backdrop-blur-sm transition-all hover:border-primary/35 hover:bg-background hover:shadow-md"
              asChild
            >
              <Link href="/" className="gap-2.5">
                <ShoppingBag className="size-4 text-primary" />
                <span className="font-semibold">Ir a la tienda</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <p className="max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
              Explora productos y ofertas desde la tienda
            </p>
          </nav>
        </div>
      </div>
    </div>
  )
}
