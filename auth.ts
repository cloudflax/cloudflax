import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Backend simulado — reemplazar con una API real en producción
const MOCK_USERS = [
  {
    id: "1",
    name: "José Guerrero",
    email: "jose.guerrero@cloudflax.com",
    password: "123456",
  },
  {
    id: "2",
    name: "Usuario Demo",
    email: "demo@cloudflax.com",
    password: "demo123",
  },
]

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
        const user = MOCK_USERS.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password,
        )

        if (!user) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
})
