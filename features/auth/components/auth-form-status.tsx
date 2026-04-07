import { cn } from "@/lib/utils"

interface AuthFormStatusPanelProps {
  icon: React.ReactNode
  title: string
  description: string
  iconRingClassName?: string
  descriptionRole?: "status" | "alert"
  children?: React.ReactNode
}

export function AuthFormStatusPanel({
  icon,
  title,
  description,
  iconRingClassName = "bg-primary/10",
  descriptionRole,
  children,
}: AuthFormStatusPanelProps) {
  return (
    <>
      <div className="mb-7 text-center">
        <div
          className={cn(
            "mx-auto mb-4 flex size-16 items-center justify-center rounded-full",
            iconRingClassName,
          )}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground" role={descriptionRole}>
          {description}
        </p>
      </div>
      {children}
    </>
  )
}
