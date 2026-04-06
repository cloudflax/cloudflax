import type { LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AuthIconInputProps extends React.ComponentProps<typeof Input> {
  icon: LucideIcon
}

export function AuthIconInput({
  icon: Icon,
  className,
  ...props
}: AuthIconInputProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("h-10 pl-9", className)} {...props} />
    </div>
  )
}
