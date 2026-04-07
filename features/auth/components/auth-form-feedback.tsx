import { cn } from "@/lib/utils"

interface AuthFormErrorAlertProps {
  children: React.ReactNode
  className?: string
  id?: string
  role?: "alert"
}

export function AuthFormErrorAlert({
  children,
  className,
  id,
  role = "alert",
}: AuthFormErrorAlertProps) {
  return (
    <p
      id={id}
      role={role}
      className={cn(
        "whitespace-pre-line rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm leading-relaxed text-destructive",
        className,
      )}
    >
      {children}
    </p>
  )
}

interface AuthFormSuccessAlertProps {
  children: React.ReactNode
  className?: string
}

export function AuthFormSuccessAlert({
  children,
  className,
}: AuthFormSuccessAlertProps) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-50",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface AuthFormFieldErrorProps {
  children: React.ReactNode
  id: string
}

export function AuthFormFieldError({ children, id }: AuthFormFieldErrorProps) {
  return (
    <p id={id} className="text-xs text-destructive" role="alert">
      {children}
    </p>
  )
}
