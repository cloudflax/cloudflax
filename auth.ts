import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginUser } from "@/features/auth/services/auth"
import { ApiError } from "@/lib/api-client"

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split(".")[1]
  const json = Buffer.from(base64, "base64url").toString("utf-8")
  return JSON.parse(json) as Record<string, unknown>
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
          const payload = decodeJwtPayload(access_token)

          return {
            id: payload.user_id as string,
            email: payload.email as string,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: expires_at,
          }
        } catch (error) {
          if (error instanceof ApiError) return null
          throw error
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = user.expiresAt
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    },
  },
})
