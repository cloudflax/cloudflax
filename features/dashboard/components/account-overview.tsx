import type { AccountOverviewUser } from "@/features/dashboard/types"

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("es", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="break-all text-sm sm:col-span-2">{value}</dd>
    </div>
  )
}

export function AccountOverview({ user }: { user: AccountOverviewUser }) {
  const verifiedLabel = user.emailVerifiedAt
    ? formatDateTime(user.emailVerifiedAt)
    : "Sin verificar"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tu cuenta</h1>
        <p className="text-muted-foreground">
          Datos de tu perfil según el servidor.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Perfil</h2>
        <dl>
          <DetailRow label="Nombre" value={user.name} />
          <DetailRow label="Correo" value={user.email} />
          <DetailRow label="Email verificado" value={verifiedLabel} />
          <DetailRow label="ID de usuario" value={user.id} />
          <DetailRow
            label="Cuenta activa"
            value={user.activeAccountId ?? "—"}
          />
          <DetailRow
            label="Registro"
            value={formatDateTime(user.createdAt)}
          />
          <DetailRow
            label="Última actualización"
            value={formatDateTime(user.updatedAt)}
          />
        </dl>
      </div>
    </div>
  )
}
