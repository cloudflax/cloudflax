import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from "lucide-react"
import { auth } from "@/auth"
import { logout } from "@/lib/actions"

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="size-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">Cloudflax</span>
          </Link>

          <nav className="flex items-center gap-2">
            {session?.user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {session.user.name}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-1.5 size-4" />
                    Dashboard
                  </Link>
                </Button>
                <form action={logout}>
                  <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="mr-1.5 size-4" />
                    Cerrar sesión
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <UserCircle className="mr-1.5 size-4" />
                    Iniciar sesión
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-1.5 size-4" />
                    Dashboard
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Cloudflax. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
