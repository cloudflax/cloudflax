export const APP_NAME = "Cloudflax"

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  confirmEmail: "/confirm-email",
  dashboard: "/dashboard",
} as const

export const AUTH_POLICY = {
  accessTokenRefreshBufferMs: 30_000,
  retryUnauthorizedOnce: true,
} as const

/** Rutas de auth del backend (ajustables sin tocar código) */
export const BACKEND_AUTH_PATHS = {
  refresh: process.env.BACKEND_AUTH_REFRESH_PATH ?? "/auth/refresh",
} as const
