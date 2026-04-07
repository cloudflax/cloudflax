import { ApiError, parseApiErrorBody } from "@/lib/api-client"

import { rateLimitUserMessage } from "@/features/auth/lib/rate-limit-message"

/** Neutral copy when the API returns 200 sin mensaje (no revela si el email existe). */
export const RESEND_VERIFICATION_NEUTRAL_SUCCESS =
  "Si el correo está registrado, recibirás un enlace de verificación."

export function resendVerificationErrorMessageForCode(
  code: string,
  fallback: string,
): string {
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

export function resendVerificationErrorFromApiError(error: ApiError): string {
  if (error.status === 429) {
    return rateLimitUserMessage(error.retryAfter)
  }
  const parsed = parseApiErrorBody(error.body)
  const code = parsed?.error.code ?? ""
  const fallback =
    parsed?.error.message ?? `No se pudo reenviar el correo (${error.status}).`
  return resendVerificationErrorMessageForCode(code, fallback)
}
