import { api } from "@/lib/api-client"
import { BACKEND_AUTH_PATHS, ROUTES } from "@/lib/constants"
import type {
  CurrentUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
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
    `${ROUTES.verifyEmail}?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
    },
  )
}

export function requestPasswordReset(data: ForgotPasswordRequest) {
  return api<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: data,
  })
}

export function resetPassword(data: ResetPasswordRequest) {
  return api<ResetPasswordResponse>(ROUTES.resetPassword, {
    method: "POST",
    body: data,
  })
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
