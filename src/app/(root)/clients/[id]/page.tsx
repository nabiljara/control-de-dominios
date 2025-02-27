
import { getClient } from "@/actions/client-actions"
import { User } from "lucide-react"
import { EditableClientCard } from "../_components/editable-client-card"
import { AccessWithRelations, ClientWithRelations, DomainWithRelations } from "@/db/schema"
import { getLocalities } from "@/actions/locality-actions"
import { getProviders } from "@/actions/provider-actions"
import { EntityNotFound } from "@/components/entity-not-found"
import { ClientContactsTable } from "../_components/client-tables/contacts/client-contacts-table"
import { ClientAccessTable } from "../_components/client-tables/access/client-access-table"
import { ClientDomainsTable } from "../_components/client-tables/domains/client-domains-table"
import { decryptPassword } from "@/actions/accesses-actions"

export default async function ClientPage({
  params
}: {
  params: { id: number }
}) {
  const clientId = Number(params.id)
  const entityNotFound =
    <EntityNotFound
      icon={<User className="w-12 h-12 text-gray-400" />}
      title="Cliente no encontrado"
      description="Lo sentimos, no pudimos encontrar el cliente que estás buscando. Es posible que la URL proporcionada no sea válida o que el cliente haya sido eliminado."
      href="/clients"
      linkText="Volver al listado de clientes"
    />

  if (isNaN(clientId)) {
    return entityNotFound
  }
  const client = await getClient(params.id)

  if (!client) {
    return entityNotFound
  }

  const { access, contacts, ...clientWithoutRelations } = client
  const accessWithRelations = access as Omit<AccessWithRelations, 'client'>[]
  const domainsWithRelations = client.domains as DomainWithRelations[]
  const clientWithoutRelationsTyped = clientWithoutRelations as Omit<
    ClientWithRelations,
    "access" | "contacts"
  >
  const localities = await getLocalities()
  const providers = await getProviders()

  const filterProviders: Array<string> = []
  try {
    const providers = await getProviders();

    providers.map((provider) => {
      const newFilterProvider: string = provider.name
      filterProviders.push(newFilterProvider)
    })
  } catch (error) {
    console.error("Error al cargar las localidades:", error);
  }

  accessWithRelations.map(async (access) => {
    try {
      access.password = await decryptPassword(access.password)
    } catch (error) {
      console.error("Error al desencriptar la contraseña")
      access.password = "Contraseña mal generada"
    }
  })

  return (
    <div className="space-y-4 p-8">
      <EditableClientCard
        client={clientWithoutRelationsTyped}
        localities={localities}
        contacts={contacts}
      />
      <div className="gap-6 grid md:grid-rows">
        {/* DOMAIN TABLE  */}
        <ClientDomainsTable domains={domainsWithRelations} filterProviders={filterProviders} />

        {/* CONTACTS TABLE */}
        <ClientContactsTable contacts={contacts} client={{ id: clientId, name: client.name }} />

        {/* ACCESS TABLE */}
        <ClientAccessTable access={accessWithRelations} client={{ id: clientId, name: client.name }} providers={providers} filterProviders={filterProviders} />

      </div>
    </div>
  )
}
