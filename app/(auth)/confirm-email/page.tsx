import { ConfirmEmailForm } from "@/features/auth/components/confirm-email-form"

type ConfirmEmailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ConfirmEmailPage({
  searchParams,
}: ConfirmEmailPageProps) {
  const resolved = searchParams ? await searchParams : undefined
  const emailParam = resolved?.email
  const initialEmail = typeof emailParam === "string" ? emailParam : undefined

  return <ConfirmEmailForm initialEmail={initialEmail ?? ""} />
}
