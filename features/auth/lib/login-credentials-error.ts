import { CredentialsSignin } from "next-auth"

import { ApiError, parseApiErrorBody } from "@/lib/api-client"

const UNVERIFIED_EMAIL_CODES = new Set([
  "EMAIL_NOT_VERIFIED",
  "EMAIL_VERIFICATION_REQUIRED",
])

function throwCredentialsSignin(
  code: string,
  cause?: Record<string, unknown>,
): never {
  const err = new CredentialsSignin()
  err.code = code
  if (cause) err.cause = { ...err.cause, ...cause }
  throw err
}

export function throwInvalidAccessTokenPayload(): never {
  throwCredentialsSignin("invalid_session")
}

/** Mapea fallos de `POST /auth/login` a códigos seguros para Auth.js (query / server action). */
export function throwFromLoginApiError(error: ApiError): never {
  if (error.status === 429) {
    throwCredentialsSignin("rate_limited", {
      retryAfter: error.retryAfter ?? null,
    })
  }
  const parsed = parseApiErrorBody(error.body)
  const apiCode = parsed?.error.code ?? ""
  if (UNVERIFIED_EMAIL_CODES.has(apiCode)) {
    throwCredentialsSignin("email_not_verified")
  }
  throwCredentialsSignin("credentials")
}
