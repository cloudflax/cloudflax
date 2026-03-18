"use server"

import { auth, signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { registerUser } from "@/features/auth/services/auth"
import { logout as backendLogout } from "@/features/auth/services/logout"
import { ApiError } from "@/lib/api-client"
import type { RegisterFormState } from "@/features/auth/types"
import type { ApiErrorResponse } from "@/types"

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
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas."
        default:
          return "Ocurrió un error inesperado."
      }
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
    return { success: true, message }
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

function parseApiErrorBody(body: string): ApiErrorResponse | null {
  try {
    const data = JSON.parse(body) as unknown
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      data.error &&
      typeof data.error === "object" &&
      "code" in data.error &&
      "message" in data.error &&
      "status" in data.error
    ) {
      return data as ApiErrorResponse
    }
  } catch {
    // body no es JSON válido
  }
  return null
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
    try {
      await backendLogout(accessToken)
    } catch {
      // Si el backend responde 401 (token inválido/expirado), igualmente cerramos sesión local.
    }
  }

  await signOut({ redirectTo: "/" })
}
