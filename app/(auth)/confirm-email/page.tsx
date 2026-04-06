import Link from "next/link"
import { MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthFormStatusPanel } from "@/features/auth/components/auth-form-status"
import { ROUTES } from "@/lib/constants"

export default function ConfirmEmailPage() {
  return (
    <AuthFormShell className="text-center">
      <AuthFormStatusPanel
        icon={<MailCheck className="size-8 text-primary" aria-hidden />}
        title="Confirma tu correo"
        description="Hemos enviado un enlace de verificación a tu correo electrónico. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta."
      />
      <div className="space-y-3">
        <Button
          variant="outline"
          className="h-10 w-full cursor-pointer shadow-sm"
        >
          Reenviar correo de verificación
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={ROUTES.login}
            className="font-medium text-foreground hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </AuthFormShell>
  )
}
