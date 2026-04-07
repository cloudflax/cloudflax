export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

/** Detalle de validación en respuestas de error 422 */
export interface ApiErrorDetail {
  field: string
  message: string
}

/** Forma del objeto `error` en respuestas de error de la API */
export interface ApiErrorPayload {
  code: string
  message: string
  status: number
  details?: ApiErrorDetail[]
  /** Secundos hasta poder reintentar (p. ej. bloqueo por credenciales en login). */
  retry_after_seconds?: number
}

/** Respuesta de error de la API: { error: { code, message, status, details? } } */
export interface ApiErrorResponse {
  error: ApiErrorPayload
}
