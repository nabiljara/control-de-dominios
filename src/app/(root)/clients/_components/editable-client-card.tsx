"use client"

import { useState } from "react"
import { Handshake } from "lucide-react"
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
  ClientWithRelations,
  Contact,
  Locality
} from "@/db/schema"
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
} from "@/validators/zod-schemas"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { EditClientConfirmationModal } from "./edit-client-confirmation-modal"
import { toast } from "sonner"
import { updateClient, updateClientAndDomains, validateClient } from "@/actions/client-actions"
import { clientSizes, clientStatus, sizeConfig, statusConfig } from "@/constants"

interface EditableClientCardProps {
  client: Omit<ClientWithRelations, "access" | "contacts">
  localities: Locality[]
  contacts: Contact[]
}

export function EditableClientCard({
  client,
  localities,
  contacts
}: EditableClientCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditConfirmationModalOpen, setIsEditConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<Omit<ClientUpdateValues, "accesses" | "contacts">>({
    resolver: zodResolver(
      clientUpdateFormSchema
    ),
    defaultValues: {
      id: client.id,
      name: client.name,
      status: client.status,
      size: client.size,
      locality: {
        id: client.localityId ? client.localityId.toString() : undefined,
        name: client.locality.name
      },
      domains: client.domains ? client.domains.filter((domain) => domain.status === 'Activo').map((domain) => {
        return {
          id: domain.id,
          name: domain.name,
          client: { id: domain.clientId.toString(), name: client.name },
          contactId: domain.contactId.toString(),
          status: domain.status,
          accessId: domain.accessData?.accessId,
          provider: { id: domain.providerId.toString(), name: '' },
          expirationDate: new Date(domain.expirationDate)
        }
      }) : []
    },
    mode: 'onSubmit'
  })

  const onSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsSubmitting(true)
      const isValid = await form.trigger() //ejecuto validación manual
      if (isValid && form.formState.isDirty) {
        const errorList = await validateClient(form.getValues('name'), client.name) // valido el nombre del cliente en la base de datos manualmente
        if (errorList.length > 0) {
          errorList.forEach((error) => {
            form.setError(error.field, {
              type: "manual",
              message: error.message,
            });
            toast.warning(error.message)
          });
        } else {
          setIsEditConfirmationModalOpen(true)
        }
      }
      setIsSubmitting(false)
    } catch (error) {
      toast.error('No se pudo validar el cliente correctamente.')
      console.log(error);
    }
  }

  const validateDomains = () => {
    const { domains = [], status, id } = form.getValues();

    if (domains.length === 0) return true;

    if (status !== "Inactivo") return true;

    form.clearErrors('domains');

    domains.map((domain, index) => {
      if (domain.status === 'Activo') {

        if (Number(id) === Number(domain.client.id)) {
          form.setError(`domains.${index}.client.id`, {
            type: "manual",
            message:
              "Debe cambiar el cliente si desea dejar el dominio activo."
          })
          return true
        }

        if (!domain.contactId) {
          form.setError(`domains.${index}.contactId`, {
            type: "manual",
            message:
              "El contacto es requerido."
          })
          return true;
        }
      }
    });
    return Object.keys(form.formState.errors).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (validateDomains()) {
      setIsSubmitting(true)
      toast.promise(
        new Promise<void>(async (resolve, reject) => {
          try {
            const { domains = [] } = form.getValues();
            if (domains.length === 0 || form.getValues('status') !== 'Inactivo') {
              await updateClient(form.getValues());
            } else {
              await updateClientAndDomains(form.getValues())
            }
            resolve()
            form.reset({
              id: form.getValues('id'),
              name: form.getValues("name"),
              locality: {
                id: form.getValues("locality.id"),
                name: form.getValues("locality.name")
              },
              size: form.getValues("size"),
              status: form.getValues("status"),
              domains: client.domains ? client.domains.filter((domain) => domain.status === 'Activo').map((domain) => {
                return {
                  id: domain.id,
                  name: domain.name,
                  client: { id: domain.clientId.toString(), name: client.name },
                  contactId: domain.contactId.toString(),
                  status: domain.status,
                  accessId: domain.accessData?.accessId,
                  provider: { id: domain.providerId.toString(), name: '' },
                  expirationDate: new Date(domain.expirationDate)
                }
              }) : []
            })
            setIsEditConfirmationModalOpen(false)
            setIsEditing(false)
          } catch (error) {
            console.error(error)
            reject(error)
          } finally {
            setIsSubmitting(false)
          }
        }),
        {
          loading: "Editando cliente...",
          success: "Cliente editado satisfactoriamente.",
          error: "No se pudo editar el cliente correctamente."
        }
      )
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader className="flex sm:flex-row flex-col justify-between gap-4 overflow-hidden">
              <div className="flex flex-row items-center gap-2">
                <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10 shrink-0">
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
                            autoComplete="off"
                            className="h-auto font-bold text-3xl"
                          />
                        </FormControl>
                      ) : (
                        <CardTitle className="font-bold text-xl md:text-3xl">
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
                  autoFocus
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex md:flex-row flex-col justify-between items-start gap-3 p-1 overflow-auto">
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
                              <SelectItem key={status} value={status} className="hover:bg-muted cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Badge variant='outline' className={statusConfig[status].color}>
                                    {status}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant='outline'
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
                              <SelectTrigger className="max-w-[260px]">
                                <SelectValue placeholder="Seleccione la localidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {localities.map((locality) => (
                                <SelectItem
                                  key={locality.name}
                                  value={locality.id.toString()}
                                  className="hover:bg-muted cursor-pointer"
                                >
                                  {locality.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </>
                      ) : (
                        <span className="font-semibold text-black">{client.locality.name}</span>
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
                            {clientSizes.map((size) => (
                              <SelectItem key={size} value={size} className="hover:bg-muted cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Badge variant='outline' className={sizeConfig[size].color}>
                                    {size}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant='outline' className={sizeConfig[client.size].color}>{client.size}</Badge>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isEditing && form.formState.isDirty && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="submit"
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
            open={isEditConfirmationModalOpen}
            onOpenChange={() => setIsEditConfirmationModalOpen(false)}
            title="Confirmar edición del cliente"
            description="Revise si los datos modificados son correctos y confirme el cambio."
            className="md:max-w-fit"
          >
            <EditClientConfirmationModal
              handleSubmit={handleFinalSubmit}
              setIsEditConfirmationModalOpen={setIsEditConfirmationModalOpen}
              form={form}
              client={client}
              contacts={contacts}
              isSubmitting={isSubmitting}
            />
          </ResponsiveDialog>
        </form>
      </Form>
    </>
  )
}
