import type { ApiErrorResponse } from "@/types"

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  next?: NextFetchRequestConfig
}

export function parseApiErrorBody(body: string): ApiErrorResponse | null {
  try {
    const data = JSON.parse(body) as unknown
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      data.error &&
      typeof data.error === "object" &&
      "code" in data.error &&
      "message" in data.error &&
      "status" in data.error
    ) {
      return data as ApiErrorResponse
    }
  } catch {
    // body no es JSON válido
  }
  return null
}

function getApiBaseUrl() {
  // Usamos siempre BACKEND_URL (expuesta al cliente vía next.config.mjs)
  return process.env.BACKEND_URL
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
    /** Present when `status === 429` and the API sends `Retry-After`. */
    public retryAfter?: string | null,
  ) {
    super(`API error ${status}: ${body}`)
    this.name = "ApiError"
  }
}

export async function api<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const { body, ...rest } = options ?? {}

  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    throw new Error("API base URL is not configured")
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  if (!res.ok) {
    const text = await res.text()
    const retryAfter =
      res.status === 429 ? res.headers.get("retry-after") : undefined
    throw new ApiError(res.status, text, retryAfter)
  }

  const contentType = res.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>
  }

  return undefined as T
}
