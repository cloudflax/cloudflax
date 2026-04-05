"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { requestPasswordReset } from "@/features/auth/services/auth"
import { ApiError, parseApiErrorBody } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"

/** Same copy for any 200 response — does not reveal whether the email exists (CA1, R6). */
const NEUTRAL_SUCCESS_MESSAGE =
  "Si el correo está registrado, recibirás un enlace para restablecer la contraseña."

type ForgotUiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

function rateLimitUserMessage(retryAfter?: string | null): string {
  if (retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10)
    if (!Number.isNaN(seconds) && seconds > 0) {
      return `Demasiadas solicitudes. Vuelve a intentarlo en ${seconds} segundos.`
    }
  }
  return "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo."
}

export function ForgotPasswordForm() {
  const [state, setState] = useState<ForgotUiState>({ status: "idle" })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (new FormData(form).get("email") as string)?.trim()
    if (!email) return

    setState({ status: "loading" })
    try {
      await requestPasswordReset({ email })
      setState({
        status: "success",
        message: NEUTRAL_SUCCESS_MESSAGE,
      })
      form.reset()
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 429) {
          setState({
            status: "error",
            message: rateLimitUserMessage(error.retryAfter),
          })
          return
        }
        const parsed = parseApiErrorBody(error.body)
        const fallback =
          parsed?.error.message ??
          "No pudimos enviar el enlace. Inténtalo de nuevo."
        setState({ status: "error", message: fallback })
        return
      }
      setState({
        status: "error",
        message: "No pudimos enviar el enlace. Inténtalo de nuevo.",
      })
    }
  }

  const isLoading = state.status === "loading"
  const showForm = state.status === "idle" || state.status === "loading"

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Recuperar contraseña</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      {state.status === "success" ? (
        <p
          className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}

      {showForm ? (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Enviar enlace de recuperación
          </Button>
        </form>
      ) : null}

      {state.status === "success" ? (
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => setState({ status: "idle" })}
          >
            Enviar otro correo
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-6 text-center">
        <Button variant="link" size="sm" asChild>
          <Link href={ROUTES.login}>
            <ArrowLeft className="mr-1.5 size-4" />
            Volver al inicio de sesión
          </Link>
        </Button>
      </div>
    </div>
  )
}
