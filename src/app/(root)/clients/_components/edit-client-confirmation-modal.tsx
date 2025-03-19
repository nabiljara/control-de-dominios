"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart2, CheckCircle, ArrowRight, Loader2, Handshake, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientUpdateValues } from "@/validators/zod-schemas"
import { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { ClientWithRelations, Contact } from "@/db/schema"
import { UpdateDomain } from "./update-domain"
import { getActiveClients } from "@/actions/client-actions"
import { changedField } from "@/components/changed-field"
import { getActiveIndividualContacts } from "@/actions/contacts-actions"
import useSWR from "swr";
import { sizeConfig, statusConfig } from "@/constants"

function useActiveClients(shouldFetch: boolean) {
  const { data: clients, error: clientsError } = useSWR(
    shouldFetch ? "activeClients" : null,
    getActiveClients
  );

  const { data: individualContacts, error: contactsError } = useSWR(
    shouldFetch ? "activeContacts" : null,
    getActiveIndividualContacts
  );

  return { clients, individualContacts, clientsError, contactsError };
}

export function EditClientConfirmationModal({
  handleSubmit,
  form,
  client,
  contacts,
  isSubmitting,
  setIsEditConfirmationModalOpen,
}: {
  handleSubmit: () => void
  form: UseFormReturn<Omit<ClientUpdateValues, "accesses" | "contacts">>
  client: Omit<ClientWithRelations, "access" | "contacts">
  contacts: Contact[]
  isSubmitting: boolean
  setIsEditConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { name, size, status, locality } = form.getValues()
  const nameState = form.getFieldState("name")
  const sizeState = form.getFieldState("size")
  const statusState = form.getFieldState("status")
  const localityState = form.getFieldState("locality.id")

  const activeDomains = client.domains.filter((domain) => domain.status === 'Activo')

  const shouldShowDomainsWarning = status === "Inactivo" && statusState.isDirty && activeDomains.length > 0

  const { clients, individualContacts, clientsError, contactsError } = useActiveClients(shouldShowDomainsWarning);

  if (clientsError || contactsError) return <p className="text-destructive">No se pudo cargar correctamente la información, vuelva a intentar más tarde.</p>;

  return (
    <Card className="shadow-none border-none">
      <CardContent className="space-y-4 p-0">
        {changedField(
          <Handshake className="w-4 h-4 text-primary" />,
          "Nombre",
          client.name,
          name,
          nameState.isDirty
        )}
        {sizeState.isDirty && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <span className="font-medium">Tamaño</span>
            </div>
            <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
              <Badge
                variant='outline'
                className={`${sizeConfig[client.size].color} justify-self-center w-fit`}
              >
                {client.size}
              </Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge
                variant='outline'
                className={`${sizeConfig[size].color} justify-self-center w-fit`}
              >
                {size}
              </Badge>
            </div>
          </div>
        )}
        {statusState.isDirty && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="font-medium">Estado</span>
            </div>
            <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
              <Badge
                variant='outline'
                className={`${statusConfig[client.status].color} justify-self-center w-fit`}
              >
                {client.status}
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
        {changedField(
          <MapPin className="w-4 h-4 text-primary" />,
          "Localidad",
          client.locality.name,
          locality.name,
          localityState.isDirty
        )}
        {
          (!clients || !individualContacts) && shouldShowDomainsWarning ?
            (
              <div className="space-y-4 p-4">
                {Array.from({ length: activeDomains.length }).map((_, index) => (
                  <div key={index} className="bg-card shadow-sm p-4 border rounded-lg animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="bg-muted rounded-md w-3/5 h-5" />
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-full w-16 h-6" />
                        <div className="bg-muted rounded w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : shouldShowDomainsWarning &&
            (
              <UpdateDomain clients={clients ?? []} contacts={contacts} individualContacts={individualContacts ?? []} clientId={client.id} form={form} />
            )
        }
        <div className='flex gap-2'>
          <Button
            type="button"
            variant='destructive'
            onClick={() => {
              setIsEditConfirmationModalOpen(false)
            }}
            disabled={isSubmitting}
            className='w-full'
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleSubmit()
            }}
            disabled={isSubmitting}
            className='w-full'
          >
            {isSubmitting ? (
              <>
                <div className='flex items-center gap-1'>
                  <Loader2 className='animate-spin' />
                  Confirmando
                </div>
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}