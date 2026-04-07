export const RESET_PASSWORD_MIN_LENGTH = 8
export const RESET_PASSWORD_MAX_LENGTH = 72

/**
 * Client-side validation for reset password + confirmation (REQ-5).
 * Returns a Spanish user-facing message or null if valid.
 */
export function validateResetPasswordPair(
  password: string,
  confirm: string,
): string | null {
  if (
    password.length < RESET_PASSWORD_MIN_LENGTH ||
    password.length > RESET_PASSWORD_MAX_LENGTH
  ) {
    return `La contraseña debe tener entre ${RESET_PASSWORD_MIN_LENGTH} y ${RESET_PASSWORD_MAX_LENGTH} caracteres.`
  }
  if (password !== confirm) {
    return "Las contraseñas no coinciden."
  }
  return null
}
