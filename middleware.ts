import { auth } from "@/auth"
import { NextResponse } from "next/server"

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/confirm-email"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (AUTH_ROUTES.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password", "/confirm-email"],
}
