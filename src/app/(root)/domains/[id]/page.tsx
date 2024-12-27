import { getClients } from "@/actions/client-actions"
import { getProviders } from "@/actions/provider-actions"
import EditableDomainCard from "@/app/(root)/domains/_components/editable-domain-card"
import { getDomain } from "@/actions/domains-actions"

export default async function DomainDetails({
  params
}: {
  params: { id: number }
}) {
  const domain = await getDomain(params.id)

  if (domain) {
    const clients = await getClients()
    const providers = await getProviders()

    return (
      <div className="space-y-4 p-8">
        <EditableDomainCard
          domain={domain}
          clients={clients}
          providers={providers}
        />
      </div>
    )
  }
  // TODO: Mejorar
  return (
    <div>
      <h1>Dominio no encontrado</h1>
      <p>El dominio no existe o no está disponible.</p>
    </div>
  )
}
