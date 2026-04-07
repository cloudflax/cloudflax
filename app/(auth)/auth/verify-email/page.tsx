import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthFormStatusPanel } from "@/features/auth/components/auth-form-status"
import { verifyEmail } from "@/features/auth/services/auth"
import { ApiError, parseApiErrorBody } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"

type Status = "success" | "error"

type VerifyEmailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const tokenParam = resolvedSearchParams?.token
  const token = typeof tokenParam === "string" ? tokenParam : undefined

  let status: Status = "error"
  let message = ""

  if (!token) {
    status = "error"
    message = "El enlace de verificación no es válido o ha expirado."
  } else {
    try {
      const response = await verifyEmail(token)
      status = "success"
      message =
        response.message ||
        "Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión."
    } catch (error) {
      status = "error"
      if (error instanceof ApiError) {
        const parsed = parseApiErrorBody(error.body)
        message =
          parsed?.error.message ??
          "No fue posible verificar tu correo."
      } else {
        message = "No fue posible verificar tu correo."
      }
    }
  }

  return (
    <AuthFormShell className="text-center">
      <AuthFormStatusPanel
        icon={
          status === "success" ? (
            <CheckCircle2 className="size-8 text-emerald-500" aria-hidden />
          ) : (
            <XCircle className="size-8 text-destructive" aria-hidden />
          )
        }
        title={
          status === "success"
            ? "Correo verificado"
            : "No se pudo verificar tu correo"
        }
        description={message}
        iconRingClassName={
          status === "success" ? "bg-primary/10" : "bg-destructive/10"
        }
        descriptionRole={status === "success" ? "status" : "alert"}
      />
      <div className="space-y-3">
        <Button className="h-10 w-full cursor-pointer shadow-sm" asChild>
          <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
        </Button>
      </div>
    </AuthFormShell>
  )
}
