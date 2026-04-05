import { auth } from "@/auth"
import { ROUTES } from "@/lib/constants"
import { NextResponse } from "next/server"

const AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.confirmEmail,
  ROUTES.verifyEmail,
  ROUTES.resetPassword,
] as const satisfies readonly string[]

type MiddlewareSession = {
  accessToken?: string
  error?: "RefreshTokenError"
} | null

export default auth((req) => {
  const session = req.auth as MiddlewareSession
  const isLoggedIn = Boolean(
    session?.accessToken && session.error !== "RefreshTokenError",
  )

  const { pathname } = req.nextUrl
  if (pathname.startsWith(ROUTES.dashboard) && !isLoggedIn) {
    return NextResponse.redirect(new URL(ROUTES.login, req.nextUrl))
  }

  if ((AUTH_ROUTES as readonly string[]).includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, req.nextUrl))
  }
})

/** Next.js parses `matcher` at compile time — only string literals here. Keep aligned with `ROUTES` in `lib/constants.ts`. */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/confirm-email",
    "/auth/verify-email",
    "/auth/reset-password",
  ],
}

