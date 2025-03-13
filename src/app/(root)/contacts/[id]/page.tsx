import { getActiveContactsByClientId, getActiveIndividualContacts, getContact } from "@/actions/contacts-actions";
import { getActiveClients, getClients } from "@/actions/client-actions";
import { EntityNotFound } from "@/components/entity-not-found";
import { Contact2 } from "lucide-react";
import { EditableContactCard } from "../_components/editable-contact-card";
import { ContactDomainsTable } from "../_components/domains/contact-domains-table";
import { getProviders } from "@/actions/provider-actions";
import { DomainWithRelations } from "@/db/schema";

export default async function ContactDetailsPage({
  params,
}: {
  params: { id: number };
}) {

  const contactId = Number(params.id)
  const entityNotFound =
    <EntityNotFound
      icon={<Contact2 className="w-12 h-12 text-gray-400" />}
      title="Contacto no encontrado"
      description="Lo sentimos, no pudimos encontrar el contacto que estás buscando. Es posible que la URL proporcionada no sea válida o que el contacto haya sido eliminado."
      href="/contacts"
      linkText="Volver al listado de contactos"
    />
  if (isNaN(contactId)) {
    return entityNotFound
  }

  const contact = await getContact(contactId)

  if (!contact) {
    return entityNotFound
  }

  const domainsWithRelations = contact.domains as unknown as DomainWithRelations[]

  const clients = await getActiveClients()
  const kernelContacts = await getActiveContactsByClientId(1)
  const individualContacts = await getActiveIndividualContacts()

  const filterProviders: Array<string> = []
  const filterClients: Array<string> = []

  try {
    const providers = await getProviders();

    providers.map((provider) => {
      const newFilterProvider: string = provider.name
      filterProviders.push(newFilterProvider)
    })
  } catch (error) {
    console.error("Error al cargar las localidades:", error);
  }

  if (!contact.clientId) {
    try {
      const clients = await getClients();
      clients.map((client) => {
        const newFilterClient: string = client.name
        filterClients.push(newFilterClient)
      })
    } catch (error) {
      console.error("Error al cargar las localidades:", error);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <EditableContactCard
        clients={clients}
        contact={contact}
        kernelContacts={kernelContacts}
        individualContacts={individualContacts}
      />
      <ContactDomainsTable domains={domainsWithRelations} filterProviders={filterProviders} filterClients={filterClients} />
    </div>
  );
}
