"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle2, KeyRound, Loader2, Lock, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthFormAlternateAction } from "@/features/auth/components/auth-form-footer"
import { AuthFormErrorAlert } from "@/features/auth/components/auth-form-feedback"
import { AuthFormHeader } from "@/features/auth/components/auth-form-header"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthFormStatusPanel } from "@/features/auth/components/auth-form-status"
import { AuthIconInput } from "@/features/auth/components/auth-icon-input"
import { rateLimitUserMessage } from "@/features/auth/lib/rate-limit-message"
import { resetPassword } from "@/features/auth/services/auth"
import { ApiError, parseApiErrorBody } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"

const PASSWORD_MIN = 8
const PASSWORD_MAX = 72

type ResetUiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

interface ResetPasswordFormProps {
  token: string | undefined
}

function validatePasswords(
  password: string,
  confirm: string,
): string | null {
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`
  }
  if (password !== confirm) {
    return "Las contraseñas no coinciden."
  }
  return null
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, setState] = useState<ResetUiState>({ status: "idle" })
  const [fieldError, setFieldError] = useState<string | null>(null)

  const missingToken = !token?.trim()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!token?.trim()) return

    const form = e.currentTarget
    const fd = new FormData(form)
    const password = (fd.get("password") as string) ?? ""
    const confirmPassword = (fd.get("confirmPassword") as string) ?? ""

    const validation = validatePasswords(password, confirmPassword)
    if (validation) {
      setFieldError(validation)
      return
    }
    setFieldError(null)

    setState({ status: "loading" })
    try {
      const res = await resetPassword({ token: token.trim(), password })
      setState({
        status: "success",
        message:
          res.message?.trim() ||
          "Tu contraseña se ha actualizado. Ya puedes iniciar sesión.",
      })
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
        const message =
          parsed?.error.message ??
          (error.status === 422
            ? "El enlace no es válido o ha expirado. Solicita uno nuevo desde recuperar contraseña."
            : `No pudimos restablecer la contraseña (${error.status}). Inténtalo de nuevo.`)
        setState({ status: "error", message })
        return
      }
      setState({
        status: "error",
        message: "No pudimos restablecer la contraseña. Inténtalo de nuevo.",
      })
    }
  }

  if (missingToken) {
    return (
      <AuthFormShell className="text-center">
        <AuthFormStatusPanel
          icon={<XCircle className="size-8 text-destructive" aria-hidden />}
          title="Enlace no válido"
          description="Falta el token de recuperación o el enlace está incompleto. Solicita un nuevo correo desde recuperar contraseña."
          iconRingClassName="bg-destructive/10"
        />
        <div className="space-y-3">
          <Button
            className="h-10 w-full cursor-pointer shadow-sm"
            asChild
          >
            <Link href={ROUTES.forgotPassword}>Solicitar nuevo enlace</Link>
          </Button>
          <Button variant="outline" className="h-10 w-full cursor-pointer" asChild>
            <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
          </Button>
        </div>
      </AuthFormShell>
    )
  }

  if (state.status === "success") {
    return (
      <AuthFormShell className="text-center">
        <AuthFormStatusPanel
          icon={<CheckCircle2 className="size-8 text-emerald-500" aria-hidden />}
          title="Contraseña actualizada"
          description={state.message}
          descriptionRole="status"
        />
        <div>
          <Button className="h-10 w-full cursor-pointer shadow-sm" asChild>
            <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
          </Button>
        </div>
      </AuthFormShell>
    )
  }

  const isLoading = state.status === "loading"

  return (
    <AuthFormShell>
      <AuthFormHeader
        eyebrow={{ icon: KeyRound, label: "Nueva clave" }}
        title="Nueva contraseña"
        description="Elige una contraseña segura para tu cuenta"
      />

      {state.status === "error" ? (
        <AuthFormErrorAlert className="mb-4">{state.message}</AuthFormErrorAlert>
      ) : null}

      {fieldError ? (
        <AuthFormErrorAlert className="mb-4">{fieldError}</AuthFormErrorAlert>
      ) : null}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Nueva contraseña
          </label>
          <AuthIconInput
            id="password"
            name="password"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            disabled={isLoading}
            aria-invalid={Boolean(fieldError)}
          />
          <p className="text-xs text-muted-foreground">
            Entre {PASSWORD_MIN} y {PASSWORD_MAX} caracteres
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar contraseña
          </label>
          <AuthIconInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer shadow-sm"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Guardar contraseña
        </Button>
      </form>

      <AuthFormAlternateAction>
        <Link
          href={ROUTES.login}
          className="font-medium text-foreground hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </AuthFormAlternateAction>
    </AuthFormShell>
  )
}
