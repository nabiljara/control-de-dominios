import { getActiveClients, getClients } from "@/actions/client-actions"
import { getProviders } from "@/actions/provider-actions"
import EditableDomainCard from "@/app/(root)/domains/_components/editable-domain-card"
import { getDomain } from "@/actions/domains-actions"
import { EntityNotFound } from "@/components/entity-not-found"
import { Globe } from "lucide-react"

export default async function DomainDetails({
  params
}: {
  params: { id: string }
}) {
  const domainId = Number(params.id)
  const entityNotFound =
    <EntityNotFound
      icon={<Globe className="w-12 h-12 text-gray-400" />}
      title="Dominio no encontrado"
      description="Lo sentimos, no pudimos encontrar el dominio que estás buscando. Es posible que la URL proporcionada no sea válida o que el dominio haya sido eliminado."
      href="/domains"
      linkText="Volver al listado de dominios"
    />
  if (isNaN(domainId)) {
    return entityNotFound
  }

  const domain = await getDomain(domainId)
  if (!domain) {
    return entityNotFound
  }

  const clients = await getActiveClients()
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
