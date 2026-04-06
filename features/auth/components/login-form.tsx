"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AuthFormAlternateAction,
  AuthFormTrustNote,
} from "@/features/auth/components/auth-form-footer"
import { AuthFormErrorAlert } from "@/features/auth/components/auth-form-feedback"
import { AuthFormHeader } from "@/features/auth/components/auth-form-header"
import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { AuthIconInput } from "@/features/auth/components/auth-icon-input"
import { login } from "@/features/auth/actions/auth"
import { ROUTES } from "@/lib/constants"

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    login,
    undefined,
  )

  return (
    <AuthFormShell>
      <AuthFormHeader
        eyebrow={{ icon: ShieldCheck, label: "Acceso seguro" }}
        title="Iniciar sesión"
        description="Bienvenido de nuevo, ingresa tus credenciales para continuar"
      />

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <AuthIconInput
            id="email"
            name="email"
            type="email"
            icon={Mail}
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
          <AuthIconInput
            id="password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            required
          />
        </div>

        {errorMessage ? (
          <AuthFormErrorAlert>{errorMessage}</AuthFormErrorAlert>
        ) : null}

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer shadow-sm"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Iniciar sesión
        </Button>
      </form>

      <AuthFormTrustNote>
        Queremos que accedas con confianza: cuidamos tu sesión con responsabilidad
        para que tu experiencia con{" "}
        <span className="font-bold text-foreground">Cloudflax</span> sea segura
        y tranquila.
      </AuthFormTrustNote>

      <AuthFormAlternateAction>
        ¿No tienes cuenta?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-foreground hover:underline"
        >
          Regístrate
        </Link>
      </AuthFormAlternateAction>
    </AuthFormShell>
  )
}
