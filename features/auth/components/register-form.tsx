"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { register } from "@/features/auth/actions/auth"
import { Loader2 } from "lucide-react"

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, undefined)

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Crear cuenta</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa el formulario para registrarte
        </p>
      </div>

      {state?.success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
          {state.message}{" "}
          <Link href="/login" className="font-medium underline">
            Ir al login
          </Link>
        </div>
      )}

      {state && !state.success && state.message && (
        <p className="mb-4 text-sm text-destructive">{state.message}</p>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Juan Pérez"
            required
            aria-invalid={!!state?.errors?.name}
            aria-describedby={state?.errors?.name ? "name-error" : undefined}
          />
          {state?.errors?.name && (
            <p id="name-error" className="text-xs text-destructive" role="alert">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? "email-error" : undefined}
          />
          {state?.errors?.email && (
            <p id="email-error" className="text-xs text-destructive" role="alert">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? "password-error" : undefined}
          />
          {state?.errors?.password && (
            <p id="password-error" className="text-xs text-destructive" role="alert">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar contraseña
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            aria-invalid={!!state?.errors?.confirmPassword}
            aria-describedby={
              state?.errors?.confirmPassword ? "confirmPassword-error" : undefined
            }
          />
          {state?.errors?.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
