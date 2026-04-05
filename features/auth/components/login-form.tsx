"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/features/auth/actions/auth"
import { ROUTES } from "@/lib/constants"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    login,
    undefined,
  )

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder
        </p>
      </div>

      <form action={formAction} className="space-y-4">
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
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Iniciar sesión
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-foreground hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  )
}
