"use client"

import Link from "next/link"
import { Loader2, Lock, Mail, UserPlus, UserRound } from "lucide-react"
import { useActionState, useState } from "react"

import { Button } from "@/components/ui/button"
import { AuthFormAlternateAction } from "@/features/auth/components/auth-form-footer"
import {
  AuthFormErrorAlert,
  AuthFormFieldError,
  AuthFormSuccessAlert,
} from "@/features/auth/components/auth-form-feedback"
import { AuthFormHeader } from "@/features/auth/components/auth-form-header"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthIconInput } from "@/features/auth/components/auth-icon-input"
import { register } from "@/features/auth/actions/auth"
import {
  RESEND_VERIFICATION_NEUTRAL_SUCCESS,
  resendVerificationErrorFromApiError,
} from "@/features/auth/lib/resend-verification"
import { resendVerificationEmail } from "@/features/auth/services/auth"
import { ApiError } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"

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

const successLinkClass =
  "font-medium text-emerald-900 underline underline-offset-4 hover:underline dark:text-emerald-50"

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
        message: text || RESEND_VERIFICATION_NEUTRAL_SUCCESS,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        setResendState({
          status: "error",
          message: resendVerificationErrorFromApiError(error),
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
    <AuthFormSuccessAlert className="mb-4">
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
              className={`h-auto min-h-0 p-0 text-sm ${successLinkClass}`}
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
        <Link href={ROUTES.login} className={successLinkClass}>
          Ir al login
        </Link>
      </p>
      {resendState.status === "success" ? (
        <p
          className="mt-2 text-xs text-emerald-900/90 dark:text-emerald-50/90"
          role="status"
        >
          {resendState.message}
        </p>
      ) : null}
      {resendState.status === "error" ? (
        <p className="mt-2 text-xs font-medium text-destructive" role="alert">
          {resendState.message}
        </p>
      ) : null}
    </AuthFormSuccessAlert>
  )
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, undefined)

  return (
    <AuthFormShell>
      <AuthFormHeader
        eyebrow={{ icon: UserPlus, label: "Nueva cuenta" }}
        title="Crear cuenta"
        description="Completa el formulario para registrarte"
      />

      {state?.success && (
        <RegisterSuccessNotice
          key={`${state.registeredEmail ?? ""}:${state.message}`}
          message={state.message}
          registeredEmail={state.registeredEmail}
          isPendingForm={isPending}
        />
      )}

      {state && !state.success && state.message ? (
        <AuthFormErrorAlert className="mb-4">{state.message}</AuthFormErrorAlert>
      ) : null}

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <AuthIconInput
            id="name"
            name="name"
            icon={UserRound}
            placeholder="Juan Pérez"
            required
            aria-invalid={!!state?.errors?.name}
            aria-describedby={state?.errors?.name ? "name-error" : undefined}
          />
          {state?.errors?.name ? (
            <AuthFormFieldError id="name-error">
              {state.errors.name[0]}
            </AuthFormFieldError>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <AuthIconInput
            id="email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="tu@email.com"
            required
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? "email-error" : undefined}
          />
          {state?.errors?.email ? (
            <AuthFormFieldError id="email-error">
              {state.errors.email[0]}
            </AuthFormFieldError>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <AuthIconInput
            id="password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            required
            aria-invalid={!!state?.errors?.password}
            aria-describedby={
              state?.errors?.password ? "password-error" : undefined
            }
          />
          {state?.errors?.password ? (
            <AuthFormFieldError id="password-error">
              {state.errors.password[0]}
            </AuthFormFieldError>
          ) : null}
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
            placeholder="••••••••"
            required
            aria-invalid={!!state?.errors?.confirmPassword}
            aria-describedby={
              state?.errors?.confirmPassword ? "confirmPassword-error" : undefined
            }
          />
          {state?.errors?.confirmPassword ? (
            <AuthFormFieldError id="confirmPassword-error">
              {state.errors.confirmPassword[0]}
            </AuthFormFieldError>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer shadow-sm"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      <AuthFormAlternateAction>
        ¿Ya tienes cuenta?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-foreground hover:underline"
        >
          Inicia sesión
        </Link>
      </AuthFormAlternateAction>
    </AuthFormShell>
  )
}
