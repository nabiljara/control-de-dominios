"use client"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import {
  Client,
  DomainWithRelations,
  Provider
} from "@/db/schema"

import DomainInfoCard from "./domain-info-card"

import CreateDomainForm from "../create/_components/create-domain-form"

interface EditableDomainCardProps {
  domain: DomainWithRelations
  clients: Client[]
  providers: Provider[]
}

export default function EditableDomainCard({
  domain,
  clients,
  providers
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
        <CreateDomainForm clients={clients} providers={providers} domain={domain} setIsEditing={setIsEditing}  />
      ) : (
        <DomainInfoCard domain={domain} />
      )}
    </>
  )
}
