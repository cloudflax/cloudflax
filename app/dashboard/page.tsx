import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { auth } from "@/auth"
import { getAuthenticatedUserState } from "@/features/auth/services/session"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  const { user, shouldLogout } = await getAuthenticatedUserState()

  if (shouldLogout) {
    redirect("/api/auth/force-logout?next=/login")
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Hola, {user?.name ?? session?.user?.name ?? "Usuario"}
        </h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración.
        </p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />

      <div className="flex items-center gap-3 pt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ShoppingBag className="mr-1.5 size-4" />
            Ir a la tienda
          </Link>
        </Button>
      </div>
    </>
  )
}
