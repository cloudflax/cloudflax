import { createHash } from "node:crypto"
import { cache } from "react"
import { unstable_cache, revalidateTag } from "next/cache"
import { auth } from "@/auth"
import { ApiError } from "@/lib/api-client"
import {
  executeAuthenticatedFetch,
} from "@/lib/authenticated-api-client"
import { AUTH_POLICY, AUTH_USER_ME_CACHE } from "@/lib/constants"
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

function digestAccessToken(accessToken: string): string {
  return createHash("sha256").update(accessToken).digest("hex")
}

export function userMeProfileCacheTag(accessToken: string): string {
  return `${AUTH_USER_ME_CACHE.tagPrefix}:${digestAccessToken(accessToken)}`
}

/**
 * Tras logout, actualización de perfil u otro evento que deba forzar `GET /users/me` fresco.
 * Llamar desde server actions / route handlers con el token de la sesión actual.
 */
export function invalidateAuthenticatedUserProfileCache(accessToken: string) {
  revalidateTag(userMeProfileCacheTag(accessToken), "default")
}

async function fetchCurrentUserWithRetry(
  accessToken: string | undefined,
): Promise<CurrentUser> {
  if (!accessToken) {
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

  const runCached = (token: string) =>
    unstable_cache(
      async () =>
        executeAuthenticatedFetch<{ data: CurrentUser }>(token, "/users/me"),
      [
        AUTH_USER_ME_CACHE.cacheKeyPrefix,
        digestAccessToken(token),
      ],
      {
        revalidate: AUTH_USER_ME_CACHE.revalidateSeconds,
        tags: [userMeProfileCacheTag(token)],
      },
    )()

  try {
    const response = await runCached(accessToken)
    return response.data
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      AUTH_POLICY.retryUnauthorizedOnce
    ) {
      invalidateAuthenticatedUserProfileCache(accessToken)
      const refreshedSession = await auth()
      const nextToken = refreshedSession?.accessToken
      if (!nextToken) {
        throw error
      }
      try {
        const response = await runCached(nextToken)
        return response.data
      } catch (retryErr) {
        if (retryErr instanceof ApiError && retryErr.status === 401) {
          invalidateAuthenticatedUserProfileCache(nextToken)
        }
        throw retryErr
      }
    }
    if (error instanceof ApiError && error.status === 401) {
      invalidateAuthenticatedUserProfileCache(accessToken)
    }
    throw error
  }
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
    const user = await fetchCurrentUserWithRetry(accessToken)
    status = transitionSessionState(status, "REFRESH_SUCCESS")
    return {
      status,
      user,
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
        invalidateAuthenticatedUserProfileCache(accessToken)

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
