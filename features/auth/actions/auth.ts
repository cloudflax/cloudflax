"use server"

import { auth, signIn, signOut } from "@/auth"
import { AuthError, CredentialsSignin } from "next-auth"
import {
  credentialsLockUserMessage,
  rateLimitUserMessage,
} from "@/features/auth/lib/rate-limit-message"
import { registerUser } from "@/features/auth/services/auth"
import { logout as backendLogout } from "@/features/auth/services/logout"
import { invalidateAuthenticatedUserProfileCache } from "@/features/auth/services/session"
import { ApiError, parseApiErrorBody } from "@/lib/api-client"
import type { RegisterFormState } from "@/features/auth/types"

/**
 * Auth.js throws CredentialsSignin from authorize(). Relying only on `instanceof`
 * can fail across module boundaries; `name` and `type` are still set by Auth.js.
 */
function asCredentialsSigninError(error: unknown): CredentialsSignin | null {
  if (error instanceof CredentialsSignin) {
    return error
  }
  if (error instanceof AuthError && error.type === "CredentialsSignin") {
    return error as CredentialsSignin
  }
  if (
    typeof error === "object" &&
    error !== null &&
    (error as Error).name === "CredentialsSignin"
  ) {
    return error as CredentialsSignin
  }
  return null
}

export async function login(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    const creds = asCredentialsSigninError(error)
    if (creds) {
      switch (creds.code ?? "credentials") {
        case "email_not_verified":
          return "Verifica tu correo antes de iniciar sesión. Revisa tu bandeja o solicita un nuevo enlace desde la página de registro o de confirmación."
        case "credentials_locked": {
          const r = creds.cause?.retryAfter
          const retryAfter =
            typeof r === "string" || r == null ? r : String(r)
          return credentialsLockUserMessage(retryAfter)
        }
        case "rate_limited": {
          const r = creds.cause?.retryAfter
          const retryAfter =
            typeof r === "string" || r == null ? r : String(r)
          return rateLimitUserMessage(retryAfter)
        }
        case "invalid_session":
          return "No pudimos completar debido a un problema técnico. Inténtalo de nuevo."
        default:
          return "Correo o contraseña incorrectos. Revísalos e inténtalo de nuevo."
      }
    }
    if (error instanceof AuthError) {
      return "Ocurrió un error inesperado."
    }
    throw error
  }
}

export async function register(
  _prevState: RegisterFormState | undefined,
  formData: FormData,
): Promise<RegisterFormState> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "",
      errors: { confirmPassword: ["Las contraseñas no coinciden."] },
    }
  }

  try {
    const res = await registerUser({ name, email, password })
    const message = res.meta.email_verification_required
      ? "Cuenta creada. Revisa tu correo para verificar tu email."
      : "Cuenta creada exitosamente. Ya puedes iniciar sesión."
    return {
      success: true,
      message,
      ...(res.meta.email_verification_required && {
        registeredEmail: res.data.email,
      }),
    }
  } catch (error) {
    if (error instanceof ApiError) {
      const parsed = parseApiErrorBody(error.body)
      const message =
        parsed?.error.message ?? `Error del servidor (${error.status}).`
      const errors = parsed?.error.details
        ? detailsToFormErrors(parsed.error.details)
        : undefined
      return { success: false, message, errors }
    }
    return { success: false, message: "Ocurrió un error inesperado." }
  }
}

function detailsToFormErrors(
  details: Array<{ field: string; message: string }>,
): RegisterFormState["errors"] {
  const acc: NonNullable<RegisterFormState["errors"]> = {}
  for (const { field, message } of details) {
    const key = field as keyof typeof acc
    if (!acc[key]) acc[key] = []
    acc[key]!.push(message)
  }
  return acc
}

export async function logout() {
  const session = await auth()
  const accessToken = session?.accessToken

  if (accessToken) {
    invalidateAuthenticatedUserProfileCache(accessToken)
    try {
      await backendLogout(accessToken)
    } catch {
      // Si el backend responde 401 (token inválido/expirado), igualmente cerramos sesión local.
    }
  }

  await signOut({ redirectTo: "/" })
}
