"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Globe, Calendar, Box, User, Contact2, Shield, KeySquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DomainFormValues } from "@/validators/client-validator"
import { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Access, Contact, DomainWithRelations } from "@/db/schema"

import { formatDate } from "@/lib/utils"
import { ContactInfoCard } from "@/app/(root)/clients/_components/contact-info-card"
import { AccessInfoCard } from "@/app/(root)/clients/_components/access-info-card"
import { statusConfig } from "@/constants"

export function EditDomainConfirmationModal({
  handleSubmit,
  form,
  oldDomain,
  newSelectedContact,
  newSelectedAccess,
  oldSelectedContact,
  oldSelectedAccess
}: {
  handleSubmit: () => void
  form: UseFormReturn<DomainFormValues>
  oldDomain: DomainWithRelations | undefined,
  newSelectedContact?: Contact
  newSelectedAccess?: Access
  oldSelectedContact?: Contact,
  oldSelectedAccess?: Access
}) {
  const { name, provider, expirationDate, status, client } = form.getValues()
  const nameState = form.getFieldState("name")
  const providerState = form.getFieldState("provider.id")
  const clientState = form.getFieldState("client.id")
  const accessState = form.getFieldState("accessId")
  const contactState = form.getFieldState("contactId")
  const expirationDateState = form.getFieldState("expirationDate")
  const statusState = form.getFieldState("status")


  const renderField = (
    icon: React.ReactNode,
    label: string,
    oldValue: string | undefined,
    newValue: string,
    isDirty: boolean
  ) => {
    if (!isDirty) return null
    return (
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
          <span className="text-muted-foreground text-sm text-center">{oldValue}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-primary text-sm text-center">{newValue}</span>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-none">
      <CardContent className="space-y-4 p-0">
        {renderField(
          <Globe className="w-4 h-4 text-primary" />,
          "Nombre",
          oldDomain?.name,
          name,
          nameState.isDirty
        )}
        {renderField(
          <Box className="w-4 h-4 text-primary" />,
          "Proveedor",
          oldDomain?.provider.name,
          provider.name,
          providerState.isDirty
        )}
        {renderField(
          <User className="w-4 h-4 text-primary" />,
          "Cliente",
          oldDomain?.client.name,
          client.name,
          clientState.isDirty
        )}
        {statusState.isDirty && oldDomain && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="font-medium">Estado</span>
            </div>
            <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
              <Badge
                variant='outline'
                className={`${statusConfig[oldDomain.status].color} justify-self-center w-fit`}
              >
                {oldDomain.status}
              </Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge
                variant='outline'
                className={`${statusConfig[status].color} justify-self-center w-fit`}
              >
                {status}
              </Badge>
            </div>
          </div>
        )}
        {renderField(
          <Calendar className="w-4 h-4 text-primary" />,
          "Fecha de vencimiento",
          formatDate(oldDomain?.expirationDate.toString() ?? ''),
          formatDate(expirationDate.toDateString()),
          expirationDateState.isDirty
        )}
        {contactState.isDirty && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Contact2 className="w-4 h-4 text-primary" />
              <span className="font-medium">Contacto</span>
            </div>
            <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
              <ContactInfoCard
                contact={oldSelectedContact}
                readOnly
              />
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <ContactInfoCard
                contact={newSelectedContact}
                readOnly
              />
            </div>
          </div>
        )}
        {accessState.isDirty && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <KeySquare className="w-4 h-4 text-primary" />
              <span className="font-medium">Acceso</span>
            </div>
            <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
              {oldSelectedAccess ?
                (<AccessInfoCard
                  access={oldSelectedAccess}
                  index={1}
                  readOnly
                  provider={oldDomain?.provider.name}
                />) : (
                  <span className="text-center">Sin acceso</span>
                )
              }
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              {
                newSelectedAccess ?
                  (
                    <AccessInfoCard
                      access={newSelectedAccess}
                      index={1}
                      readOnly
                      provider={provider.name}
                    />

                  ) : (
                    <span className="text-destructive text-center">Sin acceso</span>
                  )
              }
            </div>
          </div>
        )}
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => {
              handleSubmit()
            }}
            className="w-full sm:w-auto"
          >
            Finalizar edición
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
