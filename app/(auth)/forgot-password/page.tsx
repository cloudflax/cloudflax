import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Recuperar contraseña</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input id="email" type="email" placeholder="tu@email.com" />
        </div>

        <Button type="submit" className="w-full">
          Enviar enlace de recuperación
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button variant="link" size="sm" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-1.5 size-4" />
            Volver al inicio de sesión
          </Link>
        </Button>
      </div>
    </div>
  )
}
