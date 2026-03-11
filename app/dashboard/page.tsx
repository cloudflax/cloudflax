import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LogOut } from "lucide-react"

export default function DashboardPage() {
  return (
    <>
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
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">
            <LogOut className="mr-1.5 size-4" />
            Cerrar sesión
          </Link>
        </Button>
      </div>
    </>
  )
}
