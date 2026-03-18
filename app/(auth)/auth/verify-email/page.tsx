import Link from "next/link"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { verifyEmail } from "@/features/auth/services/auth"
import { ApiError } from "@/lib/api-client"
import type { ApiErrorResponse } from "@/types"

type Status = "success" | "error"

type VerifyEmailPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const tokenParam = searchParams?.token
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
        try {
          const parsed = JSON.parse(error.body) as ApiErrorResponse
          message = parsed.error?.message ?? "No fue posible verificar tu correo."
        } catch {
          message = "No fue posible verificar tu correo."
        }
      } else {
        message = "No fue posible verificar tu correo."
      }
    }
  }

  const isLoading = false

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
        {isLoading ? (
          <Loader2 className="size-8 animate-spin text-primary" />
        ) : status === "success" ? (
          <CheckCircle2 className="size-8 text-green-500" />
        ) : (
          <XCircle className="size-8 text-destructive" />
        )}
      </div>

      <h2 className="text-xl font-semibold">
        {isLoading
          ? "Verificando tu correo..."
          : status === "success"
            ? "Correo verificado"
            : "No se pudo verificar tu correo"}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        {isLoading
          ? "Estamos validando tu enlace de verificación. Esto puede tardar unos segundos."
          : message}
      </p>

      {!isLoading && (
        <div className="mt-8 space-y-3">
          <Button className="w-full" asChild>
            <Link href="/login">Ir al inicio de sesión</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

