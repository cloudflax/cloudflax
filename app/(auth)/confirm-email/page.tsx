import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

export default function ConfirmEmailPage() {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="size-8 text-primary" />
      </div>

      <h2 className="text-xl font-semibold">Confirma tu correo</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Hemos enviado un enlace de verificación a tu correo electrónico.
        Revisa tu bandeja de entrada y haz clic en el enlace para activar tu
        cuenta.
      </p>

      <div className="mt-8 space-y-3">
        <Button variant="outline" className="w-full">
          Reenviar correo de verificación
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="/login">Volver al inicio de sesión</Link>
        </Button>
      </div>
    </div>
  )
}
