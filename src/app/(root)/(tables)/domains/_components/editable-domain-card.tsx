"use client"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import {
  Client,
  ClientHistory,
  Contact,
  ContactHistory,
  DomainWithRelations,
  Provider,
  ProviderHistory
} from "@/db/schema"

import DomainInfoCard from "./domain-info-card"

import CreateDomainForm from "../create/_components/create-domain-form"

interface EditableDomainCardProps {
  domain: DomainWithRelations
  clients: Client[]
  providers: Provider[]
  domainHistory?: {
    clientsHistory: ClientHistory[] | null;
    providersHistory: ProviderHistory[] | null;
    contactsHistory: ContactHistory[] | null;
  }
}

export default function EditableDomainCard({
  domain,
  clients,
  providers,
  domainHistory,
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
      {isEditing ? (
        <CreateDomainForm clients={clients} providers={providers} domain={domain} setIsEditing={setIsEditing} />
      ) : (
        <>
          <DomainInfoCard domain={domain} domainHistory={domainHistory} />
        </>
      )}
    </>
  )
}
