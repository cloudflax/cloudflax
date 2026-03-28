# Patrones de código

## Clientes API

### Cliente genérico

```typescript
// lib/api-client.ts
import { ApiError } from "@/lib/api-client"

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  next?: NextFetchRequestConfig
}

export async function api<T>(
  path: string,
  options?: ApiRequestOptions
): Promise<T>
```

### Cliente autenticado

```typescript
// lib/authenticated-api-client.ts
import { ApiError } from "@/lib/api-client"

type AuthenticatedApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  retryOnUnauthorized?: boolean // Reintento automático en 401
}

export async function authenticatedApi<T>(
  path: string,
  options?: AuthenticatedApiOptions
): Promise<T>
```

### Tipos de error

```typescript
// lib/api-client.ts o types/index.ts
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    status: number
    details?: ApiErrorDetail[]
  }
}

export class ApiError extends Error {
  body: unknown
  status: number
}
```

## Servicio tipado

```typescript
// features/<feature>/services/<service>.ts
import { authenticatedApi } from "@/lib/authenticated-api-client"
import type { ApiErrorResponse } from "@/lib/api-client"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponseData {
  user: User
  token: string
}

export async function loginUser(
  data: LoginRequest
): Promise<LoginResponseData> {
  return authenticatedApi<LoginResponseData>("/auth/login", {
    method: "POST",
    body: data,
  })
}
```

## Server Action + useActionState

### Action con manejo de errores

```typescript
// features/<feature>/actions/<action>.ts
"use server"

import { loginUser } from "@/features/auth/services/auth"
import { ApiError, parseApiErrorBody } from "@/lib/api-client"

interface FormState {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function login(_prevState: FormState, formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }
    await loginUser(data)
    redirect("/dashboard")
  } catch (error) {
    if (error instanceof ApiError) {
      const parsed = parseApiErrorBody(error.body)
      return {
        success: false,
        message: parsed?.error.message,
        errors: parsed?.error.details,
      }
    }
    return { success: false, message: "Error inesperado" }
  }
}
```

### Componente con useActionState

```typescript
// features/<feature>/components/LoginForm.tsx
"use client"

import { useActionState } from "react"
import { login } from "@/features/auth/actions/auth"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined)

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Iniciar sesión
      </Button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

## Server Component con servicio

```typescript
// app/dashboard/page.tsx
import { getAuthenticatedUserState } from "@/features/auth/services/session"

export default async function DashboardPage() {
  const { user, shouldLogout } = await getAuthenticatedUserState()

  if (shouldLogout) {
    redirect("/api/auth/force-logout?next=/login")
  }

  return <h1>Hola, {user?.name}</h1>
}
```

## API Route Handler

```typescript
// app/api/products/route.ts
export async function GET() {
  const products = await authenticatedApi<Product[]>("/products")
  return Response.json(products)
}

export async function POST(request: Request) {
  const data = await request.json()
  const product = await authenticatedApi<Product>("/products", {
    method: "POST",
    body: data,
  })
  return Response.json(product, { status: 201 })
}
```
