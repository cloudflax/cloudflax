import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: string
  }

  interface Session {
    accessToken?: string
    expiresAt?: string
    error?: "RefreshTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: string
    error?: "RefreshTokenError"
  }
}
