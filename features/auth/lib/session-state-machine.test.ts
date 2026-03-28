import { strictEqual } from "node:assert"
import { describe, it } from "node:test"

import { transitionSessionState } from "./session-state-machine.ts"

describe("transitionSessionState", () => {
  it("moves from unauthenticated to authenticated on SESSION_VALID", () => {
    strictEqual(
      transitionSessionState("unauthenticated", "SESSION_VALID"),
      "authenticated",
    )
  })

  it("moves from authenticated to refreshing on REFRESH_STARTED", () => {
    strictEqual(
      transitionSessionState("authenticated", "REFRESH_STARTED"),
      "refreshing",
    )
  })

  it("returns to authenticated after REFRESH_SUCCESS", () => {
    strictEqual(
      transitionSessionState("refreshing", "REFRESH_SUCCESS"),
      "authenticated",
    )
  })

  it("falls back to unauthenticated after REFRESH_FAILED", () => {
    strictEqual(
      transitionSessionState("refreshing", "REFRESH_FAILED"),
      "unauthenticated",
    )
  })

  it("ignores unknown transitions", () => {
    strictEqual(
      transitionSessionState("authenticated", "REFRESH_SUCCESS"),
      "authenticated",
    )
  })
})
