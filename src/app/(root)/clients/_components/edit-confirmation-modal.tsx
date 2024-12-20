"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User, BarChart2, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientUpdateValues } from "@/validators/client-validator"
import { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { ClientWithRelations, Contact } from "@/db/schema"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger
// } from "@/components/ui/accordion"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { domainFormSchema } from "@/validators/client-validator"
import { useEffect, useState } from "react"
// import { Contact } from "@/db/schema"
import { isDirty } from "zod"
// import { getContactsByClient } from "@/actions/contacts-actions"
import UpdateDomain from "./update-domain"
import { getActiveClients } from "@/actions/client-actions"
import { getContactsByClient } from "@/actions/contacts-actions"

export function EditConfirmationModal({
  handleSubmit,
  form,
  client,
  contacts
}: {
  handleSubmit: () => void
  form: UseFormReturn<Omit<ClientUpdateValues, "accesses" | "contacts">>
  client: Omit<ClientWithRelations, "access" | "contacts">
  contacts: Contact[]
}) {
  const { name, size, status, locality } = form.getValues()
  const nameState = form.getFieldState("name")
  const sizeState = form.getFieldState("size")
  const statusState = form.getFieldState("status")
  const localityState = form.getFieldState("locality.id")
  const [clients, setClients] = useState<
    Omit<ClientWithRelations, "locality" | "domains" | "access" | "contacts">[]
  >([])
  const fetchClients = async () => {
    const clientsData = await getActiveClients()
    setClients(clientsData)
  }
  useEffect(() => {
    if (statusState.isDirty) {
      fetchClients()
    }
  }, [client, statusState.isDirty])

  const renderField = (
    icon: React.ReactNode,
    label: string,
    oldValue: string,
    newValue: string,
    isDirty: boolean
  ) => {
    if (!isDirty) return null
    return (
      <div className="rounded-lg bg-muted p-4">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
          <span className="text-sm text-muted-foreground">{oldValue}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-primary">{newValue}</span>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-0">
        {renderField(
          <User className="h-4 w-4 text-primary" />,
          "Nombre",
          client.name,
          name,
          nameState.isDirty
        )}
        {renderField(
          <BarChart2 className="h-4 w-4 text-primary" />,
          "Tamaño",
          client.size,
          size,
          sizeState.isDirty
        )}
        {statusState.isDirty && (
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="font-medium">Estado</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
              <Badge
                variant="outline"
                className={
                  client.status === "Activo"
                    ? "bg-green-500/10 text-green-500"
                    : ""
                }
              >
                {client.status}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge
                variant="outline"
                className={
                  status === "Activo" ? "bg-green-500/10 text-green-500" : ""
                }
              >
                {status}
              </Badge>
            </div>
          </div>
        )}
        {renderField(
          <BarChart2 className="h-4 w-4 text-primary" />,
          "Localidad",
          client.locality.name,
          locality.name,
          localityState.isDirty
        )}
        {status === "Inactivo" && statusState.isDirty && (
          <UpdateDomain client={client} clients={clients} contacts={contacts} />
        )}
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => {
              handleSubmit()
              // form.reset({
              //   name: form.getValues("name"),
              //   locality: {
              //     id: form.getValues("locality.id"),
              //     name: form.getValues("locality.name")
              //   },
              //   size: form.getValues("size"),
              //   status: form.getValues("status")
              // })
            }}
            className="w-full sm:w-auto"
          >
            Guardar cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
