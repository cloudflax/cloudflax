import { auth } from "@/auth"
import { NextResponse } from "next/server"

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/confirm-email",
  "/auth/verify-email",
]

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
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (AUTH_ROUTES.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/confirm-email",
    "/auth/verify-email",
  ],
}

