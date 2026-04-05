"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
        const parsed = parseApiErrorBody(error.body)
        const message =
          parsed?.error.message ??
          (error.status === 422
            ? "El enlace no es válido o ha expirado. Solicita uno nuevo desde recuperar contraseña."
            : "No pudimos restablecer la contraseña. Inténtalo de nuevo.")
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
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="size-8 text-destructive" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold">Enlace no válido</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Falta el token de recuperación o el enlace está incompleto. Solicita un
          nuevo correo desde recuperar contraseña.
        </p>
        <div className="mt-8 space-y-3">
          <Button className="w-full" asChild>
            <Link href={ROUTES.forgotPassword}>Solicitar nuevo enlace</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (state.status === "success") {
    return (
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-8 text-green-500" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold">Contraseña actualizada</h2>
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          {state.message}
        </p>
        <div className="mt-8">
          <Button className="w-full" asChild>
            <Link href={ROUTES.login}>Ir al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isLoading = state.status === "loading"

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Nueva contraseña</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige una contraseña segura para tu cuenta
        </p>
      </div>

      {state.status === "error" ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}

      {fieldError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {fieldError}
        </p>
      ) : null}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Nueva contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
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
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Guardar contraseña
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href={ROUTES.login}
          className="font-medium text-foreground hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  )
}
