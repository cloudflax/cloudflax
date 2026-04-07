import NextAuth from "next-auth"
import { ApiError } from "@/lib/api-client"
import { AUTH_POLICY } from "@/lib/constants"
import Credentials from "next-auth/providers/credentials"
import { decodeAccessTokenIdentity } from "@/features/auth/lib/decode-access-token-payload"
import {
  throwFromLoginApiError,
  throwInvalidAccessTokenPayload,
} from "@/features/auth/lib/login-credentials-error"
import { trackAuthMetric } from "@/features/auth/services/telemetry"
import { loginUser, refreshAccessToken } from "@/features/auth/services/auth"

function hasTokenExpired(expiresAt?: string) {
  if (!expiresAt) return true
  const expiresAtMs = Date.parse(expiresAt)
  if (Number.isNaN(expiresAtMs)) return true
  return Date.now() >= expiresAtMs - AUTH_POLICY.accessTokenRefreshBufferMs
}

async function refreshJwtToken(token: Record<string, unknown>) {
  const refreshToken = token.refreshToken as string | undefined
  if (!refreshToken) {
    return {
      ...token,
      accessToken: undefined,
      refreshToken: undefined,
      error: "RefreshTokenError" as const,
    }
  }

  try {
    const response = await refreshAccessToken(refreshToken)
    const { access_token, refresh_token, expires_at } = response.data
    trackAuthMetric("refreshSuccess")
    return {
      ...token,
      accessToken: access_token,
      refreshToken: refresh_token ?? refreshToken,
      expiresAt: expires_at,
      error: undefined,
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : "unknown"
    console.warn("[auth] Refresh token failed", { details })
    trackAuthMetric("refreshFailure")
    return {
      ...token,
      accessToken: undefined,
      refreshToken: undefined,
      error: "RefreshTokenError" as const,
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const res = await loginUser({ email, password })
          const { access_token, refresh_token, expires_at } = res.data
          const identity = decodeAccessTokenIdentity(access_token)
          if (!identity) {
            throwInvalidAccessTokenPayload()
          }

          return {
            id: identity.userId,
            email: identity.email,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: expires_at,
          }
        } catch (error) {
          if (error instanceof ApiError) throwFromLoginApiError(error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = user.expiresAt
        token.error = undefined
        return token
      }

      if (token.error === "RefreshTokenError") {
        return token
      }

      if (!hasTokenExpired(token.expiresAt as string | undefined)) {
        return token
      }

      return refreshJwtToken(token)
    },
    session({ session, token }) {
      if (token.error === "RefreshTokenError") {
        session.error = "RefreshTokenError"
        session.accessToken = undefined
        session.expiresAt = undefined
        return session
      }

      if (session.user) {
        session.user.id = token.sub!
      }

      session.accessToken = token.accessToken as string | undefined
      session.expiresAt = token.expiresAt as string | undefined
      session.error = undefined
      return session
    },
  },
})
