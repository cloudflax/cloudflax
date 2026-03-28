type SessionStatus = "authenticated" | "refreshing" | "unauthenticated"

type SessionEvent =
  | "SESSION_VALID"
  | "SESSION_EXPIRED"
  | "REFRESH_STARTED"
  | "REFRESH_SUCCESS"
  | "REFRESH_FAILED"

const transitions: Record<SessionStatus, Partial<Record<SessionEvent, SessionStatus>>> = {
  authenticated: {
    SESSION_EXPIRED: "unauthenticated",
    REFRESH_STARTED: "refreshing",
  },
  refreshing: {
    REFRESH_SUCCESS: "authenticated",
    REFRESH_FAILED: "unauthenticated",
  },
  unauthenticated: {
    SESSION_VALID: "authenticated",
  },
}

export function transitionSessionState(
  current: SessionStatus,
  event: SessionEvent,
): SessionStatus {
  return transitions[current][event] ?? current
}
