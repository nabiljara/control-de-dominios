"use client"

import { useState } from "react"
import { Activity, Handshake, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ClientInsert,
  ClientWithRelations,
  Contact,
  DomainInsert,
  Locality
} from "@/db/schema"
import { formatDate } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  clientUpdateFormSchema,
  ClientUpdateValues
} from "@/validators/client-validator"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { EditConfirmationModal } from "./edit-confirmation-modal"
import { toast } from "sonner"
import { updateClient } from "@/actions/client-actions"
import { updateDomain } from "@/actions/domains-actions"
import { clientSize, clientStatus, sizeConfig, statusConfig } from "@/constants"

interface EditableClientCardProps {
  client: Omit<ClientWithRelations, "access" | "contacts">
  localities: Locality[]
  contacts: Contact[]
}

export default function EditableClientCard({
  client,
  localities,
  contacts
}: EditableClientCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const activeDomains = client.domains.filter(
    (domain) => domain.status === "Activo"
  )

  const form = useForm<Omit<ClientUpdateValues, "accesses" | "contacts">>({
    resolver: zodResolver(
      clientUpdateFormSchema.omit({
        access: true,
        contacts: true
      })
    ),
    defaultValues: {
      name: client.name,
      status: client.status,
      size: client.size,
      locality: {
        id: client.localityId ? client.localityId.toString() : undefined,
        name: client.locality.name
      },
      domains: activeDomains.map((domain) => {
        const contact = contacts.find((c) => c.id === domain.contactId)

        return {
          id: domain.id,
          name: domain.name,
          provider: { id: domain.providerId.toString(), name: "" },
          client: { id: domain.clientId.toString(), name: client.name },
          contactId: domain.contactId.toString(),
          expirationDate: new Date(),
          status: domain.status,
          contact: contact
            ? {
              id: contact.id.toString(),
              name: contact.name,
              clientId: contact.clientId ? contact.clientId : undefined
            }
            : { id: "", name: "", clientId: undefined },
          isClientContact: false
        }
      })
    }
  })

  const onSubmit: SubmitHandler<ClientUpdateValues> = () => {
    setIsConfirmationModalOpen(true)
  }

  const handleFinalSubmit = async () => {
    const modifiedClient: ClientInsert = {
      name: form.getValues().name,
      status: form.getValues().status,
      size: form.getValues().size,
      localityId: parseInt(form.getValues().locality.id, 10),
      id: client.id
    }
    const domains = form.getValues().domains
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        if (modifiedClient.status === "Inactivo") {
          form.clearErrors("domains")
          for (let index = 0; index < domains.length; index++) {
            const domain = domains[index]
            if (domain.status === "Activo") {
              if (
                modifiedClient.id?.toString() === domain.client.id.toString()
              ) {
                //Cliente a dar de baja sigue en seteado en el dominio
                form.setError(`domains.${index}`, {
                  type: "manual",
                  message: "Este dominio tiene errores"
                })
                form.setError(`domains.${index}.client.id`, {
                  type: "manual",
                  message:
                    "Debe cambiar el cliente si desea dejar el dominio activo"
                })
                reject(new Error("El cliente no puede ser el mismo"))
                return
              }
              if (domain.contact?.clientId === modifiedClient.id) {
                form.setError(`domains.${index}`, {
                  type: "manual",
                  message: "Este dominio tiene errores"
                })
                form.setError(`domains.${index}.contactId`, {
                  type: "manual",
                  message:
                    "Debe cambiar el contacto ya que el cliente estará inactivo"
                })
                reject(new Error("El cliente no puede ser el mismo"))
                return
              }
              if (!domain.contactId) {
                form.setError(`domains.${index}`, {
                  type: "manual",
                  message: "Este dominio tiene errores"
                })
                form.setError(`domains.${index}.contactId`, {
                  type: "manual",
                  message: "Debe seleccionar un contacto para este dominio"
                })
                reject(new Error("Debe haber un contacto seleccionado"))
                return
              }
            }
          }
        }
        try {
          domains.map(async (domain) => {
            try {
              const modifiedDomain: DomainInsert = {
                contactId: parseInt(domain.contactId),
                clientId: parseInt(domain.client.id),
                id: domain.id ?? domain.id,
                name: domain.name,
                status: domain.status,
                expirationDate: domain.expirationDate.toISOString(),
                providerId: parseInt(domain.provider.id)
              }
              await updateDomain(modifiedDomain, undefined)
            } catch (error) {
              console.error(error)
              reject(error)
            }
          })
          setIsConfirmationModalOpen(false)
          setIsEditing(false)
          await updateClient(modifiedClient)
          resolve()
        } catch (error) {
          console.error(error)
          reject(error)
        }
      }),
      {
        loading: "Editando cliente",
        success: "Cliente editado satisfactoriamente",
        error: "No se pudo editar el cliente correctamente."
      }
    )
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      {isEditing ? (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ingrese el nombre del cliente"
                            autoComplete="name"
                            className="h-auto font-bold text-3xl"
                          />
                        </FormControl>
                      ) : (
                        <CardTitle className="font-bold text-3xl">
                          {client.name}
                        </CardTitle>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>Editar</span>
                <Switch
                  checked={isEditing}
                  onCheckedChange={setIsEditing}
                  aria-label="Habilitar edición"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-row justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2">
                      <FormLabel className="text-muted-foreground text-lg">
                        Estado
                      </FormLabel>
                      {isEditing ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientStatus.map((status) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <Badge className={statusConfig[status].color}>
                                    {status}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={statusConfig[client.status].color}
                        >
                          {client.status}
                        </Badge>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2">
                      <FormLabel className="text-muted-foreground text-lg">
                        Tamaño
                      </FormLabel>
                      {isEditing ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientSize.map((size) => (
                              <SelectItem key={size} value={size}>
                                <div className="flex items-center gap-2">
                                  <Badge className={sizeConfig[size].color}>
                                    {size}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={sizeConfig[client.size].color}>{client.size}</Badge>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locality.id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2">
                      <FormLabel className="text-muted-foreground text-lg">
                        Localidad
                      </FormLabel>
                      {isEditing ? (
                        <>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              const selectedLocality = localities.find(
                                (locality) => locality.id.toString() === value
                              )
                              if (selectedLocality) {
                                form.setValue(
                                  "locality.name",
                                  selectedLocality.name
                                )
                              }
                            }}
                            defaultValue={field.value}
                            name="locality"
                          >
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccione la localidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {localities.map((locality) => (
                                <SelectItem
                                  key={locality.name}
                                  value={locality.id.toString()}
                                >
                                  {locality.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </>
                      ) : (
                        <span>{client.locality.name}</span>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-between gap-2 text-start">
                  <span className="font-medium text-muted-foreground text-lg">
                    Fecha de registro
                  </span>
                  <span>
                    {formatDate(client.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-2 text-start">
                  <span className="font-medium text-muted-foreground text-lg">
                    Última actualización
                  </span>
                  <span>
                    {formatDate(client.updatedAt)}
                  </span>
                </div>
              </div>
              {isEditing && form.formState.isDirty && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => setIsConfirmationModalOpen(true)}
                  >
                    Editar cliente
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.reset()
                      setIsEditing(false)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <ResponsiveDialog
            open={isConfirmationModalOpen}
            onOpenChange={setIsConfirmationModalOpen}
            title="Confirmar edición del cliente"
            description="Revise si los datos modificados son correctos y confirme el cambio."
            className="sm:max-w-[700px]"
          >
            <EditConfirmationModal
              handleSubmit={handleFinalSubmit}
              form={form}
              client={client}
              contacts={contacts}
            />
          </ResponsiveDialog>
        </form>
      </Form>
    </>
  )
}
