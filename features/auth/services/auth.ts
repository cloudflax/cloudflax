import { api } from "@/lib/api-client"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailResponse,
} from "@/features/auth/types"

export function loginUser(data: LoginRequest) {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
  })
}

export function registerUser(data: RegisterRequest) {
  return api<RegisterResponse>("/auth/register", {
    method: "POST",
    body: data,
  })
}

export function verifyEmail(token: string) {
  return api<VerifyEmailResponse>(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
    },
  )
}
