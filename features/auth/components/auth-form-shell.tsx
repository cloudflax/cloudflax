import { cn } from "@/lib/utils"

interface AuthFormShellProps {
  children: React.ReactNode
  className?: string
}

export function AuthFormShell({ children, className }: AuthFormShellProps) {
  return (
    <div
      className={cn(
        "mx-2 mt-4 rounded-2xl bg-background/60 px-8 py-12 sm:mx-0 sm:px-10 sm:py-14",
        className,
      )}
    >
      {children}
    </div>
  )
}
