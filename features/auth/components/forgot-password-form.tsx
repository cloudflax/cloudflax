"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthFormAlternateAction } from "@/features/auth/components/auth-form-footer"
import {
  AuthFormErrorAlert,
  AuthFormSuccessAlert,
} from "@/features/auth/components/auth-form-feedback"
import { AuthFormHeader } from "@/features/auth/components/auth-form-header"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthIconInput } from "@/features/auth/components/auth-icon-input"
import { rateLimitUserMessage } from "@/features/auth/lib/rate-limit-message"
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
    <AuthFormShell>
      <AuthFormHeader
        eyebrow={{ icon: KeyRound, label: "Recuperación segura" }}
        title="Recuperar contraseña"
        description="Te enviaremos un enlace para restablecer tu contraseña"
      />

      {state.status === "success" ? (
        <AuthFormSuccessAlert>{state.message}</AuthFormSuccessAlert>
      ) : null}

      {state.status === "error" ? (
        <AuthFormErrorAlert className="mb-4">{state.message}</AuthFormErrorAlert>
      ) : null}

      {showForm ? (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico
            </label>
            <AuthIconInput
              id="email"
              name="email"
              type="email"
              icon={Mail}
              autoComplete="email"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="h-10 w-full cursor-pointer shadow-sm"
            disabled={isLoading}
          >
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
            className="h-10 w-full cursor-pointer shadow-sm"
            onClick={() => setState({ status: "idle" })}
          >
            Enviar otro correo
          </Button>
          <Button variant="outline" className="h-10 w-full cursor-pointer" asChild>
            <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
          </Button>
        </div>
      ) : null}

      <AuthFormAlternateAction>
        <Link
          href={ROUTES.login}
          className="inline-flex items-center font-medium text-foreground hover:underline"
        >
          <ArrowLeft className="mr-1.5 size-4" />
          Volver al inicio de sesión
        </Link>
      </AuthFormAlternateAction>
    </AuthFormShell>
  )
}
