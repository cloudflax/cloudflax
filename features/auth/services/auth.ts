import { api } from "@/lib/api-client"
import { BACKEND_AUTH_PATHS } from "@/lib/constants"
import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
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

export function resendVerificationEmail(data: ResendVerificationRequest) {
  return api<ResendVerificationResponse>("/auth/resend-verification", {
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

export function refreshAccessToken(refreshToken: string) {
  return api<RefreshTokenResponse>(BACKEND_AUTH_PATHS.refresh, {
    method: "POST",
    body: { refresh_token: refreshToken },
  })
}

export function getCurrentUser(accessToken: string) {
  return api<CurrentUserResponse>("/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
