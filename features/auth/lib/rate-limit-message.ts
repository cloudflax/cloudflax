/** User-facing copy when the API returns 429; uses Retry-After when present. */
export function rateLimitUserMessage(retryAfter?: string | null): string {
  if (retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10)
    if (!Number.isNaN(seconds) && seconds > 0) {
      return `Demasiadas solicitudes. Vuelve a intentarlo en ${seconds} segundos.`
    }
  }
  return "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo."
}
