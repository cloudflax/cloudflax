import { api } from "@/lib/api-client"

export function logout(accessToken: string) {
  return api<void>("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

