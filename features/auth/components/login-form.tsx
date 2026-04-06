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
        eyebrow={{ icon: ShieldCheck, label: "Tu espacio protegido" }}
        title="Bienvenido de nuevo"
        description="Introduce tu correo y contraseña para entrar a tu cuenta"
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
              ¿La has olvidado?
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
        Cuidamos tu sesión para que en{" "}
        <span className="font-bold text-foreground">Cloudflax</span> puedas
        centrarte en tu negocio, no en preocuparte por la seguridad.
      </AuthFormTrustNote>

      <AuthFormAlternateAction>
        ¿Primera vez aquí?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-foreground hover:underline"
        >
          Crea tu cuenta
        </Link>
      </AuthFormAlternateAction>
    </AuthFormShell>
  )
}
