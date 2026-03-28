import { cache } from "react"
import { auth } from "@/auth"
import { ApiError } from "@/lib/api-client"
import { authenticatedApi } from "@/lib/authenticated-api-client"
import type { ApiErrorResponse } from "@/types"
import { transitionSessionState } from "@/features/auth/lib/session-state-machine"
import { trackAuthMetric } from "@/features/auth/services/telemetry"
import type { CurrentUser, SessionStatus } from "@/features/auth/types"

export interface AuthenticatedUserState {
  status: SessionStatus
  user: CurrentUser | null
  shouldLogout: boolean
}

function parseApiErrorBody(body: string): ApiErrorResponse | null {
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
    // Ignoramos body no JSON.
  }

  return null
}

export const getAuthenticatedUserState = cache(
  async (): Promise<AuthenticatedUserState> => {
  const session = await auth()
  const accessToken = session?.accessToken
  let status: SessionStatus = "unauthenticated"

  if (!accessToken || session?.error === "RefreshTokenError") {
    trackAuthMetric("forcedLogout")
    return {
      status,
      user: null,
      shouldLogout: true,
    }
  }

  status = transitionSessionState(status, "SESSION_VALID")

  try {
    status = transitionSessionState(status, "REFRESH_STARTED")
    const response = await authenticatedApi<{ data: CurrentUser }>("/users/me")
    status = transitionSessionState(status, "REFRESH_SUCCESS")
    return {
      status,
      user: response.data,
      shouldLogout: false,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      const parsed = parseApiErrorBody(error.body)
      const code = parsed?.error.code
      const shouldInvalidateSession =
        error.status === 401 ||
        (error.status === 404 && code === "USER_NOT_FOUND")

      if (shouldInvalidateSession) {
        if (error.status === 401) {
          trackAuthMetric("unauthorized401")
        }

        console.warn("[auth] /users/me session invalid", {
          status: error.status,
          code: code ?? "UNAUTHENTICATED",
        })
        status = transitionSessionState(status, "REFRESH_FAILED")
        trackAuthMetric("forcedLogout")

        return {
          status,
          user: null,
          shouldLogout: true,
        }
      }
    }

    throw error
  }
  },
)
