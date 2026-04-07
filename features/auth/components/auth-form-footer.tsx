interface AuthFormTrustNoteProps {
  children: React.ReactNode
}

export function AuthFormTrustNote({ children }: AuthFormTrustNoteProps) {
  return (
    <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  )
}

interface AuthFormAlternateActionProps {
  children: React.ReactNode
}

export function AuthFormAlternateAction({
  children,
}: AuthFormAlternateActionProps) {
  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  )
}
