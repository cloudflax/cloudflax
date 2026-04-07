import assert from "node:assert/strict"
import test from "node:test"

import {
  RESET_PASSWORD_MAX_LENGTH,
  RESET_PASSWORD_MIN_LENGTH,
  validateResetPasswordPair,
} from "./reset-password-validation.ts"

test("validateResetPasswordPair accepts password in 8–72 range with matching confirm", () => {
  assert.equal(
    validateResetPasswordPair("abcdefgh", "abcdefgh"),
    null,
  )
  assert.equal(
    validateResetPasswordPair("a".repeat(RESET_PASSWORD_MAX_LENGTH), "a".repeat(RESET_PASSWORD_MAX_LENGTH)),
    null,
  )
})

test("validateResetPasswordPair rejects password shorter than minimum", () => {
  const msg = validateResetPasswordPair("abc", "abc")
  assert.ok(msg)
  assert.match(msg!, new RegExp(String(RESET_PASSWORD_MIN_LENGTH)))
})

test("validateResetPasswordPair rejects password longer than maximum", () => {
  const p = "a".repeat(RESET_PASSWORD_MAX_LENGTH + 1)
  const msg = validateResetPasswordPair(p, p)
  assert.ok(msg)
  assert.match(msg!, new RegExp(String(RESET_PASSWORD_MAX_LENGTH)))
})

test("validateResetPasswordPair rejects non-matching confirmation", () => {
  const msg = validateResetPasswordPair("abcdefgh", "abcdefgH")
  assert.equal(msg, "Las contraseñas no coinciden.")
})
