import type { LucideIcon } from "lucide-react"

interface AuthFormHeaderProps {
  eyebrow?: { icon: LucideIcon; label: string }
  title: string
  description?: string
}

export function AuthFormHeader({
  eyebrow,
  title,
  description,
}: AuthFormHeaderProps) {
  const EyebrowIcon = eyebrow?.icon

  return (
    <div className="mb-7 space-y-3 text-center">
      {eyebrow && EyebrowIcon ? (
        <div className="mx-auto inline-flex items-center text-xs font-medium text-muted-foreground">
          <EyebrowIcon className="mr-1.5 size-3.5 text-primary" />
          {eyebrow.label}
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
