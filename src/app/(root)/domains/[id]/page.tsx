import { getClients } from "@/actions/client-actions"
import { getProviders } from "@/actions/provider-actions"
import EditableDomainCard from "@/app/(root)/domains/_components/editable-domain-card"
import { getDomain } from "@/actions/domains-actions"
import DomainNotFound from "../_components/domain-not-found"

export default async function DomainDetails({
  params
}: {
  params: { id: string }
}) {
  const domainId = Number(params.id)
  if (isNaN(domainId)) {
    return <DomainNotFound />
  }

  const domain = await getDomain(domainId)
  if (!domain) {
    return <DomainNotFound />
  }

  // console.log(domain);

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
