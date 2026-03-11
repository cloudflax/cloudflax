import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function StorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Bienvenido a <span className="text-primary">Cloudflax</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Descubre las mejores tiendas y productos en nuestra plataforma de
          comercio electrónico.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button size="lg" asChild>
            <Link href="/register">
              Crear cuenta
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 pb-16 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl border bg-muted/30 p-6 transition-colors hover:bg-muted/50"
          >
            <div className="mb-3 size-10 rounded-lg bg-primary/10" />
            <h3 className="font-semibold">Tienda {i + 1}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Explora los productos de esta tienda.
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}
