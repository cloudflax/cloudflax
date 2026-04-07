import assert from "node:assert/strict"
import test from "node:test"

import { decodeAccessTokenIdentity } from "./decode-access-token-payload.ts"

test("decodeAccessTokenIdentity reads user_id and email from JWT payload", () => {
  const payload = Buffer.from(
    JSON.stringify({ user_id: "usr_1", email: "hi@example.com" }),
  ).toString("base64url")
  const token = `hdr.${payload}.sig`
  assert.deepEqual(decodeAccessTokenIdentity(token), {
    userId: "usr_1",
    email: "hi@example.com",
  })
})

test("decodeAccessTokenIdentity returns null for malformed token", () => {
  assert.equal(decodeAccessTokenIdentity("not-a-jwt"), null)
  assert.equal(decodeAccessTokenIdentity("only.two"), null)
})

test("decodeAccessTokenIdentity returns null when claims are missing", () => {
  const payload = Buffer.from(JSON.stringify({ sub: "x" })).toString(
    "base64url",
  )
  assert.equal(decodeAccessTokenIdentity(`h.${payload}.s`), null)
})
