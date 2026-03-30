import type { Metadata } from "next"
import type { CurrentUser } from "@/features/auth/types"
import { getAuthenticatedUserState } from "@/features/auth/services/session"
import { AccountOverview } from "@/features/dashboard/components/account-overview"
import type { AccountOverviewUser } from "@/features/dashboard/types"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Cuenta",
}

function toAccountOverviewUser(user: CurrentUser): AccountOverviewUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerifiedAt: user.email_verified_at,
    activeAccountId: user.active_account_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }
}

export default async function DashboardAccountPage() {
  const { user, shouldLogout } = await getAuthenticatedUserState()

  if (shouldLogout || !user) {
    redirect("/api/auth/force-logout?next=/login")
  }

  return <AccountOverview user={toAccountOverviewUser(user)} />
}
