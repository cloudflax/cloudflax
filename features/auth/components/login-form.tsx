"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/features/auth/actions/auth"
import { ROUTES } from "@/lib/constants"
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react"

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    login,
    undefined,
  )

  return (
    <div className="mx-2 mt-4 rounded-2xl bg-background/60 px-8 py-12 sm:mx-0 sm:px-10 sm:py-14">
      <div className="mb-7 space-y-3 text-center">
        <div className="mx-auto inline-flex items-center text-xs font-medium text-muted-foreground">
          <ShieldCheck className="mr-1.5 size-3.5 text-primary" />
          Acceso seguro
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h2>
        <p className="text-sm text-muted-foreground">
          Bienvenido de nuevo, ingresa tus credenciales para continuar
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              className="h-10 pl-9"
              required
            />
          </div>
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
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-10 pl-9"
              required
            />
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer shadow-sm"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Iniciar sesión
        </Button>
      </form>

      <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
        Queremos que accedas con confianza: cuidamos tu sesión con responsabilidad
        para que tu experiencia con{" "}
        <span className="font-bold text-foreground">Cloudflax</span> sea segura
        y tranquila.
      </p>

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
