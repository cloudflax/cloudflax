import assert from "node:assert/strict"
import test from "node:test"
import {
  credentialsLockUserMessage,
  rateLimitUserMessage,
} from "./rate-limit-message.ts"

test("credentials lock: long wait uses rounded-up minutes only", () => {
  assert.equal(
    credentialsLockUserMessage("1762"),
    "Tu cuenta ha sido bloqueada temporalmente por seguridad. Vuelve a intentarlo en 30 minutos.",
  )
  assert.equal(
    credentialsLockUserMessage("1617"),
    "Tu cuenta ha sido bloqueada temporalmente por seguridad. Vuelve a intentarlo en 27 minutos.",
  )
})

test("credentials lock: under one minute keeps seconds", () => {
  assert.equal(
    credentialsLockUserMessage("45"),
    "Tu cuenta ha sido bloqueada temporalmente por seguridad. Vuelve a intentarlo en 45 segundos.",
  )
})

test("credentials lock: one minute exact", () => {
  assert.equal(
    credentialsLockUserMessage("60"),
    "Tu cuenta ha sido bloqueada temporalmente por seguridad. Vuelve a intentarlo en 1 minuto.",
  )
})

test("rate limit: long wait uses hours and rounded minutes", () => {
  assert.equal(
    rateLimitUserMessage("3665"),
    "Demasiadas peticiones seguidas. Vuelve a intentarlo en 1 hora y 2 minutos.",
  )
})

test("invalid or empty retry falls back to generic copy", () => {
  const fallback =
    "Tu cuenta ha sido bloqueada temporalmente por seguridad. Espera unos minutos antes de volver a intentarlo."
  assert.equal(credentialsLockUserMessage(""), fallback)
  assert.equal(credentialsLockUserMessage(null), fallback)
  assert.ok(!credentialsLockUserMessage("xyz").includes("NaN"))
})
