import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LayoutDashboard } from "lucide-react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Cloudflax</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plataforma de comercio electrónico
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>

      <nav className="mt-10 flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ShoppingBag className="mr-1.5 size-4" />
            Tienda
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-1.5 size-4" />
            Dashboard
          </Link>
        </Button>
      </nav>
    </div>
  )
}
