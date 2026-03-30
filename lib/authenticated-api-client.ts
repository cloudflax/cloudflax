import { auth } from "@/auth"
import { ApiError } from "@/lib/api-client"
import { AUTH_POLICY } from "@/lib/constants"

type AuthenticatedApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  retryOnUnauthorized?: boolean
}

function getApiBaseUrl() {
  return process.env.BACKEND_URL
}

export async function executeAuthenticatedFetch<T>(
  accessToken: string,
  path: string,
  options?: AuthenticatedApiOptions,
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) {
    throw new Error("API base URL is not configured")
  }

  const { body, ...rest } = options ?? {}
  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...rest.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  if (!res.ok) {
    throw new ApiError(res.status, await res.text())
  }

  const contentType = res.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>
  }

  return undefined as T
}

export async function authenticatedApi<T>(
  path: string,
  options?: AuthenticatedApiOptions,
): Promise<T> {
  const initialSession = await auth()
  const firstToken = initialSession?.accessToken
  if (!firstToken) {
    throw new ApiError(
      401,
      JSON.stringify({
        error: {
          code: "UNAUTHENTICATED",
          message: "Missing session",
          status: 401,
        },
      }),
    )
  }

  try {
    return await executeAuthenticatedFetch<T>(firstToken, path, options)
  } catch (error) {
    if (
      !(error instanceof ApiError) ||
      error.status !== 401 ||
      options?.retryOnUnauthorized === false ||
      !AUTH_POLICY.retryUnauthorizedOnce
    ) {
      throw error
    }
  }

  // Reintentamos una vez para evitar cortes por rotación/refresh concurrente.
  const refreshedSession = await auth()
  const refreshedToken = refreshedSession?.accessToken
  if (!refreshedToken) {
    throw new ApiError(
      401,
      JSON.stringify({
        error: {
          code: "UNAUTHENTICATED",
          message: "Missing session after refresh",
          status: 401,
        },
      }),
    )
  }

  return executeAuthenticatedFetch<T>(refreshedToken, path, {
    ...options,
    retryOnUnauthorized: false,
  })
}
