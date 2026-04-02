"use client"

import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { register } from "@/features/auth/actions/auth"
import { resendVerificationEmail } from "@/features/auth/services/auth"
import { ApiError, parseApiErrorBody } from "@/lib/api-client"

const RESEND_SUCCESS_FALLBACK =
  "If the email exists, a verification link has been sent"

function resendVerificationUserMessage(code: string, fallback: string): string {
  switch (code) {
    case "EMAIL_ALREADY_VERIFIED":
      return "Este correo ya está verificado. Puedes iniciar sesión."
    case "RATE_LIMITED":
    case "RATE_LIMIT_EXCEEDED":
      return "Demasiadas solicitudes de verificación. Inténtalo más tarde."
    default:
      return fallback
  }
}

type ResendUiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

interface RegisterSuccessNoticeProps {
  message: string
  registeredEmail?: string
  isPendingForm: boolean
}

function RegisterSuccessNotice({
  message,
  registeredEmail,
  isPendingForm,
}: RegisterSuccessNoticeProps) {
  const [resendState, setResendState] = useState<ResendUiState>({ status: "idle" })

  async function handleResendVerification() {
    if (!registeredEmail) return

    setResendState({ status: "loading" })
    try {
      const res = await resendVerificationEmail({ email: registeredEmail })
      const text = res.message?.trim()
      setResendState({
        status: "success",
        message: text || RESEND_SUCCESS_FALLBACK,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        const parsed = parseApiErrorBody(error.body)
        const code = parsed?.error.code ?? ""
        const fallback =
          parsed?.error.message ?? `No se pudo reenviar el correo (${error.status}).`
        setResendState({
          status: "error",
          message: resendVerificationUserMessage(code, fallback),
        })
        return
      }
      setResendState({
        status: "error",
        message: "No se pudo reenviar el correo. Inténtalo de nuevo.",
      })
    }
  }

  return (
    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
      <p className="flex flex-wrap items-center gap-x-1 gap-y-2">
        <span>{message}</span>
        {registeredEmail ? (
          <>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <Button
              type="button"
              variant="link"
              className="h-auto min-h-0 p-0 text-sm font-medium text-green-800 underline-offset-4 hover:text-green-900 hover:underline dark:text-green-200 dark:hover:text-green-100"
              disabled={resendState.status === "loading" || isPendingForm}
              aria-busy={resendState.status === "loading"}
              onClick={() => void handleResendVerification()}
            >
              {resendState.status === "loading" ? (
                <>
                  <Loader2
                    className="mr-1 size-3.5 shrink-0 animate-spin"
                    aria-hidden
                  />
                  Enviando…
                </>
              ) : (
                "Reenviar correo de verificación"
              )}
            </Button>
          </>
        ) : null}
        <span className="hidden sm:inline" aria-hidden>
          ·
        </span>
        <Link href="/login" className="font-medium underline underline-offset-4">
          Ir al login
        </Link>
      </p>
      {resendState.status === "success" ? (
        <p className="mt-2 text-xs text-green-900/90 dark:text-green-100/90" role="status">
          {resendState.message}
        </p>
      ) : null}
      {resendState.status === "error" ? (
        <p className="mt-2 text-xs font-medium text-red-900 dark:text-red-200" role="alert">
          {resendState.message}
        </p>
      ) : null}
    </div>
  )
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, undefined)

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Crear cuenta</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa el formulario para registrarte
        </p>
      </div>

      {state?.success && (
        <RegisterSuccessNotice
          key={`${state.registeredEmail ?? ""}:${state.message}`}
          message={state.message}
          registeredEmail={state.registeredEmail}
          isPendingForm={isPending}
        />
      )}

      {state && !state.success && state.message && (
        <p className="mb-4 text-sm text-destructive">{state.message}</p>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Juan Pérez"
            required
            aria-invalid={!!state?.errors?.name}
            aria-describedby={state?.errors?.name ? "name-error" : undefined}
          />
          {state?.errors?.name && (
            <p id="name-error" className="text-xs text-destructive" role="alert">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? "email-error" : undefined}
          />
          {state?.errors?.email && (
            <p id="email-error" className="text-xs text-destructive" role="alert">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? "password-error" : undefined}
          />
          {state?.errors?.password && (
            <p id="password-error" className="text-xs text-destructive" role="alert">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar contraseña
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            aria-invalid={!!state?.errors?.confirmPassword}
            aria-describedby={
              state?.errors?.confirmPassword ? "confirmPassword-error" : undefined
            }
          />
          {state?.errors?.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
