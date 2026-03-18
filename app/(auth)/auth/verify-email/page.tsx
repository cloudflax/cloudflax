"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { verifyEmail } from "@/features/auth/services/auth"
import { ApiError } from "@/lib/api-client"
import type { ApiErrorResponse } from "@/types"

type Status = "idle" | "loading" | "success" | "error"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("El enlace de verificación no es válido o ha expirado.")
      return
    }

    const run = async () => {
      setStatus("loading")
      try {
        const response = await verifyEmail(token)
        setStatus("success")
        setMessage(
          response.message ||
            "Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión.",
        )
      } catch (error) {
        setStatus("error")

        if (error instanceof ApiError) {
          try {
            const parsed = JSON.parse(error.body) as ApiErrorResponse
            setMessage(
              parsed.error?.message ?? "No fue posible verificar tu correo.",
            )
          } catch {
            setMessage("No fue posible verificar tu correo.")
          }
        } else {
          setMessage("No fue posible verificar tu correo.")
        }
      }
    }

    void run()
  }, [searchParams])

  const handleGoToLogin = () => {
    router.push("/login")
  }

  const isLoading = status === "loading" || status === "idle"

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
          <Button className="w-full" onClick={handleGoToLogin}>
            Ir al inicio de sesión
          </Button>
        </div>
      )}
    </div>
  )
}

