/**
 * Short Spanish wait phrase: seconds if under 1 min; otherwise whole minutes
 * (rounded up) so we never tell the user they can retry sooner than allowed.
 */
function formatRetryWaitSpanishCompact(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return totalSeconds === 1 ? "1 segundo" : `${totalSeconds} segundos`
  }

  const totalMinutesCeil = Math.ceil(totalSeconds / 60)
  if (totalMinutesCeil < 60) {
    return totalMinutesCeil === 1 ? "1 minuto" : `${totalMinutesCeil} minutos`
  }

  const hours = Math.floor(totalMinutesCeil / 60)
  const mins = totalMinutesCeil % 60
  const hoursPhrase = hours === 1 ? "1 hora" : `${hours} horas`
  if (mins === 0) {
    return hoursPhrase
  }
  const minsPhrase = mins === 1 ? "1 minuto" : `${mins} minutos`
  return `${hoursPhrase} y ${minsPhrase}`
}

/** Copy when login is blocked after repeated wrong passwords (`CREDENTIALS_LOCKED`). */
export function credentialsLockUserMessage(retryAfter?: string | null): string {
  if (retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10)
    if (!Number.isNaN(seconds) && seconds > 0) {
      const wait = formatRetryWaitSpanishCompact(seconds)
      return `Tu cuenta ha sido bloqueada temporalmente por seguridad. Vuelve a intentarlo en ${wait}.`
    }
  }
  return "Tu cuenta ha sido bloqueada temporalmente por seguridad. Espera unos minutos antes de volver a intentarlo."
}

/** User-facing copy when the API returns 429; uses Retry-After when present. */
export function rateLimitUserMessage(retryAfter?: string | null): string {
  if (retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10)
    if (!Number.isNaN(seconds) && seconds > 0) {
      const wait = formatRetryWaitSpanishCompact(seconds)
      return `Demasiadas peticiones seguidas. Vuelve a intentarlo en ${wait}.`
    }
  }
  return "Demasiadas peticiones seguidas. Espera un momento e inténtalo de nuevo."
}
