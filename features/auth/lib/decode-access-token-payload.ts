export interface AccessTokenIdentity {
  userId: string
  email: string
}

/** Lee el payload del JWT sin verificar firma (el backend ya emitió el token). */
export function decodeAccessTokenIdentity(
  accessToken: string,
): AccessTokenIdentity | null {
  try {
    const parts = accessToken.split(".")
    if (parts.length < 2 || !parts[1]) return null
    const json = Buffer.from(parts[1], "base64url").toString("utf-8")
    const data = JSON.parse(json) as unknown
    if (!data || typeof data !== "object") return null
    const o = data as Record<string, unknown>
    const userId = o.user_id
    const email = o.email
    if (typeof userId !== "string" || typeof email !== "string") return null
    const uid = userId.trim()
    const em = email.trim()
    if (!uid || !em) return null
    return { userId: uid, email: em }
  } catch {
    return null
  }
}
