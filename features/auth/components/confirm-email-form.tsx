"use client"

import Link from "next/link"
import { Loader2, Mail, MailCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  AuthFormErrorAlert,
  AuthFormSuccessAlert,
} from "@/features/auth/components/auth-form-feedback"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthFormStatusPanel } from "@/features/auth/components/auth-form-status"
import { AuthIconInput } from "@/features/auth/components/auth-icon-input"
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

export interface ConfirmEmailFormProps {
  initialEmail?: string
}

export function ConfirmEmailForm({ initialEmail = "" }: ConfirmEmailFormProps) {
  const [email, setEmail] = useState(initialEmail.trim())
  const [resendState, setResendState] = useState<ResendUiState>({
    status: "idle",
  })

  async function handleResend() {
    const trimmed = email.trim()
    if (!trimmed) {
      setResendState({
        status: "error",
        message: "Introduce el correo con el que te registraste.",
      })
      return
    }

    setResendState({ status: "loading" })
    try {
      const res = await resendVerificationEmail({ email: trimmed })
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

  const isLoading = resendState.status === "loading"

  return (
    <AuthFormShell className="text-center">
      <AuthFormStatusPanel
        icon={<MailCheck className="size-8 text-primary" aria-hidden />}
        title="Confirma tu correo"
        description="Hemos enviado un enlace de verificación a tu correo electrónico. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta."
      />

      {resendState.status === "success" ? (
        <AuthFormSuccessAlert className="mb-4 text-left">
          {resendState.message}
        </AuthFormSuccessAlert>
      ) : null}

      {resendState.status === "error" ? (
        <AuthFormErrorAlert className="mb-4 text-left">
          {resendState.message}
        </AuthFormErrorAlert>
      ) : null}

      <div className="space-y-5 text-left">
        <div className="space-y-2">
          <label htmlFor="confirm-email-input" className="text-sm font-medium">
            Correo electrónico
          </label>
          <AuthIconInput
            id="confirm-email-input"
            name="email"
            type="email"
            icon={Mail}
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full cursor-pointer shadow-sm"
          disabled={isLoading}
          aria-busy={isLoading}
          onClick={() => void handleResend()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            "Reenviar correo de verificación"
          )}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href={ROUTES.login}
          className="font-medium text-foreground hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </AuthFormShell>
  )
}
