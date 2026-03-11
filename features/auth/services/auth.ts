import { api } from "@/lib/api-client"
import type { RegisterRequest, RegisterResponse } from "@/features/auth/types"

export function registerUser(data: RegisterRequest) {
  return api<RegisterResponse>("/auth/register", {
    method: "POST",
    body: data,
  })
}
