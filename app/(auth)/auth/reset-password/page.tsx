import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const resolved = searchParams ? await searchParams : undefined
  const tokenParam = resolved?.token
  const token = typeof tokenParam === "string" ? tokenParam : undefined

  return <ResetPasswordForm token={token} />
}
