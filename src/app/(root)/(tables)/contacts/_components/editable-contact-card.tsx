"use client"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import {
  Client,
  Contact,
  ContactWithRelations,
} from "@/db/schema"

import { ContactInfoCard } from "./contact-info-card"
import { ContactModal } from "@/components/contact-modal"

interface EditableDomainCardProps {
  clients: Client[]
  contact: ContactWithRelations
  individualContacts?: Contact[]
}

export function EditableContactCard({
  clients,
  contact,
  individualContacts,
}: EditableDomainCardProps) {

  const [isEditing, setIsEditing] = useState(false)
  return (
    <>
      <div className="flex justify-end items-center space-x-2">
        <span>Editar</span>
        <Switch
          checked={isEditing}
          onCheckedChange={setIsEditing}
          aria-label="Habilitar edición"
        />
      </div>
      <ContactInfoCard contact={contact} />
      {isEditing &&
        <ContactModal
          individualContacts={individualContacts}
          pathToRevalidate={`/contacts/${contact.id}`}
          clients={clients}
          contact={contact}
          isOpen={isEditing}
          setIsOpen={setIsEditing}
          client={{ id: contact.clientId ? contact.clientId : undefined, name: contact.client ? contact.client.name : undefined }} />
      }
    </>
  )
}
