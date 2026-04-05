export const APP_NAME = "Cloudflax"

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  verifyEmail: "/auth/verify-email",
  resetPassword: "/auth/reset-password",
  confirmEmail: "/confirm-email",
  dashboard: "/dashboard",
  dashboardAccount: "/dashboard/account",
} as const

export const AUTH_POLICY = {
  accessTokenRefreshBufferMs: 30_000,
  retryUnauthorizedOnce: true,
} as const

/** Caché de `GET /users/me` en servidor (ver SDD dashboard user fetch). */
export const AUTH_USER_ME_CACHE = {
  revalidateSeconds: 60,
  cacheKeyPrefix: "auth-users-me-v1",
  tagPrefix: "auth-users-me-v1",
} as const

/** Rutas de auth del backend (ajustables sin tocar código) */
export const BACKEND_AUTH_PATHS = {
  refresh: process.env.BACKEND_AUTH_REFRESH_PATH ?? "/auth/refresh",
} as const
