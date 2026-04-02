// ── Login ──

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponseData {
  access_token: string
  refresh_token: string
  expires_at: string
}

export interface LoginResponse {
  data: LoginResponseData
}

// ── Register ──

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponseUser {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface RegisterResponseMeta {
  email_verification_required: boolean
}

export interface RegisterResponse {
  data: RegisterResponseUser
  meta: RegisterResponseMeta
}

export interface RegisterFormState {
  success: boolean
  message: string
  /** Email registrado cuando hace falta verificación; el cliente puede reenviar el enlace. */
  registeredEmail?: string
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
}

// ── Resend verification ──

export interface ResendVerificationRequest {
  email: string
}

/** 200: `{ "message": "If the email exists, a verification link has been sent" }` */
export interface ResendVerificationResponse {
  message: string
}

// ── Verify Email ──

export interface VerifyEmailResponse {
  message: string
}

// ── Session / Me ──

export type AuthErrorCode =
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "UNAUTHENTICATED"

export interface CurrentUser {
  id: string
  name: string
  email: string
  email_verified_at: string | null
  active_account_id: string | null
  created_at: string
  updated_at: string
}

export interface CurrentUserResponse {
  data: CurrentUser
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  data: LoginResponseData
}

export type SessionStatus = "authenticated" | "refreshing" | "unauthenticated"
