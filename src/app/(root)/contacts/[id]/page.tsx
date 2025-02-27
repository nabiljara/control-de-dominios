import { getActiveContactsByClientId, getActiveIndividualContacts, getContact} from "@/actions/contacts-actions";
import { getActiveClients} from "@/actions/client-actions";
import { EntityNotFound } from "@/components/entity-not-found";
import { Contact2 } from "lucide-react";
import { EditableContactCard } from "../_components/editable-contact-card";

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

  const clients = await getActiveClients()
  const kernelContacts = await getActiveContactsByClientId(1) //TODO: Quizas cambiar de nuevo a petición del lado del cliente
  const individualContacts = await getActiveIndividualContacts()

  return (
    <div className="space-y-4 p-8">
      <EditableContactCard
        clients={clients}
        contact={contact}
        kernelContacts={kernelContacts}
        individualContacts={individualContacts}
      />
    </div>
  );
}
