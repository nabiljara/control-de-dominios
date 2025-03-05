"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addDays, addYears, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Loader2,
  Globe,
  Plus,
  ChevronsUpDown,
  Check,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  domainFormSchema,
  DomainFormValues
} from "@/validators/client-validator"
import { toast } from "sonner"
import {
  Client,
  Contact,
  Access,
  Provider,
  AccessWithRelations,
  DomainInsert,
  DomainWithRelations,
} from "@/db/schema"
import {
  getContactsByClientId,
  getIndividualContacts,
} from "@/actions/contacts-actions"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { ContactModal } from "@/components/contact-modal"
import { ContactInfoCard } from "@/app/(root)/clients/_components/contact-info-card"
import { cn } from "@/lib/utils"
import {
  getAccessByClientAndProviderId,
  getKernelAccessByProviderId,
} from "@/actions/accesses-actions"
import { AccessInfoCard } from "@/app/(root)/clients/_components/access-info-card"
import { es } from "date-fns/locale"
import { CreateDomainConfirmationModal } from "./create-domain-confirmation-modal"
import { insertDomain, updateDomain, validateDomain } from "@/actions/domains-actions"
import { AccessModal } from "@/components/access-modal"
import { EditDomainConfirmationModal } from "./edit-domain.confirmation-modal"
import { PreventNavigation } from "@/components/prevent-navigation"
import { DropdownNavProps, DropdownProps } from "react-day-picker";
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { domainStatus, statusConfig } from "@/constants"

export default function CreateDomainForm({
  providers,
  clients,
  domain,
  setIsEditing,
  kernelContacts
}: {
  providers: Provider[]
  clients: Client[]
  kernelContacts: Contact[]
  domain?: DomainWithRelations
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
}) {

  //** CONTACTOS:

  // Contactos del cliente
  const [clientContacts, setClientContacts] = useState<Contact[]>([])

  //Contactos individuales
  const [individualContacts, setIndividualContacts] = useState<Contact[]>([])

  //Notificaciones para nuevos contacto creados y reactivar los useEffects
  const [newClientContactCreated, setNewClientContactCreated] = useState(false)
  const [newIndividualContactCreated, setNewIndividualContactCreated] = useState(false)

  //Estado para manejar el contacto seleccionado de la base de datos
  const [selectedContact, setSelectedContact] = useState<Contact>()

  //** ACCESOS

  //Accesos del cliente con la relacion de proveedores
  const [clientAccess, setClientAccess] = useState<Omit<AccessWithRelations, "domainAccess" | "client">[]>([])

  //Accesos del kernel con la relacion de proveedores
  const [kernelAccess, setKernelAccess] = useState<Omit<AccessWithRelations, "domainAccess" | "client">[]>([])

  //Notificaciones para nuevos accesos creados y reactivar los useEffects
  const [newClientAccessCreated, setNewClientAccessCreated] = useState(false)
  const [newKernelAccessCreated, setNewKernelAccessCreated] = useState(false)

  //Estado para manejar el acceso seleccionado de la base de datos
  const [selectedAccess, setSelectedAccess] = useState<Access>()

  //** FORMULARIO DE DOMINIO

  //Estado para manejar manualmente el envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false)

  //Estado para mostrar el modal de confirmación final del dominio
  const [isConfirmationDomainModalOpen, setIsConfirmationDomainModalOpen] = useState(false)

  //Estado para mostrar el modal de confirmación cuando se edita el dominio
  const [isEditConfirmationDomainModalOpen, setIsEditConfirmationDomainModalOpen] = useState(false)

  const handleSelectContact = (contactId: string, contact: Contact) => {
    const currentSelectedId = form.getValues("contactId");

    if (currentSelectedId === contactId) {
      form.setValue("contactId", "", { shouldDirty: true });
      form.trigger();
      setSelectedContact(undefined);
    } else {
      form.setValue("contactId", contactId, { shouldDirty: true });
      form.trigger();
      setSelectedContact(contact);
    }
  };

  const handleSelectAccess = (accessId: number, access: Access) => {
    const currentSelectedId = form.getValues("accessId");
    if (currentSelectedId === accessId) {
      form.setValue("accessId", undefined, { shouldDirty: true })
      form.trigger();
      setSelectedAccess(undefined);
    } else {
      form.setValue("accessId", accessId, { shouldDirty: true })
      form.trigger()
      setSelectedAccess(access)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsSubmitting(true)
      const isValid = await form.trigger() //ejecuto validación manual
      const errorList = domain ? await validateDomain(form.getValues('name'), domain.name) : await validateDomain(form.getValues('name'), undefined); // valido el dominio en la base de datos manualmente

      if (isValid) {

        if (errorList.length > 0) {
          errorList.forEach((error) => {
            form.setError(error.field, {
              type: "manual",
              message: error.message,
            });
            toast.warning(error.message)
          });

        } else {

          if (domain) {
            setIsEditConfirmationDomainModalOpen(true)
          }
          else {
            setIsConfirmationDomainModalOpen(true)
          }
        }

      }
      setIsSubmitting(false)
    } catch (error) {
      toast.error('No se pudo validar el dominio correctamente.')
      console.log(error);
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    const data = {
      ...form.getValues(),
      expirationDate: format(
        form.getValues("expirationDate"),
        "yyyy-MM-dd HH:mm"
      )
    }
    const domainInsert: DomainInsert = {
      id: form.getValues("id"),
      name: data.name,
      providerId: parseInt(data.provider.id),
      clientId: parseInt(data.client.id),
      contactId: parseInt(data.contactId),
      expirationDate: data.expirationDate,
      status: data.status
    }

    if (domain) {
      toast.promise(
        new Promise<void>(async (resolve, reject) => {
          try {
            const accessId = form.getValues("isClientAccess") || form.getValues("isKernelAccess") ? form.getValues("accessId") : undefined
            await updateDomain(
              domainInsert,
              accessId
            )
            resolve()
            setIsEditConfirmationDomainModalOpen(false)
            if (setIsEditing) {
              setIsEditing(false)
            }
          } catch (error) {
            console.error(error)
            reject(error)
          } finally {
            setIsSubmitting(false)
          }
        }),
        {
          loading: "Editando dominio",
          success: "Dominio editado satisfactoriamente",
          error: "No se pudo editar el dominio correctamente, por favor intente nuevamente."
        }
      )
    } else {
      toast.promise(
        new Promise<void>(async (resolve, reject) => {
          try {
            const accessId = form.getValues("isClientAccess") || form.getValues("isKernelAccess") ? form.getValues("accessId") : undefined
            await insertDomain(
              domainInsert,
              accessId
            )
            resolve()
            setIsConfirmationDomainModalOpen(false)
          } catch (error) {
            console.error(error)
            reject(error)
          } finally {
            setIsSubmitting(false)
          }
        }),
        {
          loading: "Registrando dominio",
          success: "Dominio registrado satisfactoriamente",
          error: "No se pudo registrar el dominio correctamente, por favor intente nuevamente."
        }
      )
    }
  }

  const getDomainSchema = () => {
    return domainFormSchema.superRefine(async (data, ctx) => {
      const { contactId } = data
      if (contactId === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El contacto es requerido.",
          path: ["contactId"]
        })
      }
    })
  }

  const newDomainSchema = getDomainSchema()

  const diffFromUndefined = domain?.contact.clientId !== undefined && domain?.clientId !== undefined

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(newDomainSchema),
    defaultValues: {
      id: domain?.id,
      name: domain?.name ? domain?.name : "",
      provider: { id: domain?.provider.id.toString() ? domain?.provider.id.toString() : undefined, name: domain?.provider.name ? domain?.provider.name : undefined },
      client: { id: domain?.client.id.toString(), name: domain?.client.name },
      contactId: domain?.contactId.toString() ? domain?.contactId.toString() : '',
      accessId: domain?.accessData?.access.id,
      isClientContact: diffFromUndefined && domain?.contact.clientId === domain?.clientId,
      isKernelContact: diffFromUndefined && domain?.contact.clientId === 1,
      isIndividualContact: diffFromUndefined && domain?.contact.clientId !== domain?.clientId && domain?.contact.clientId !== 1,
      isClientAccess: domain?.accessData?.access.clientId !== undefined && domain?.clientId !== undefined && domain?.accessData?.access.clientId === domain?.clientId,
      isKernelAccess: domain?.accessData?.access.clientId !== undefined && domain?.clientId !== undefined && domain?.accessData?.access.clientId !== domain?.clientId,
      status: domain?.status,
      expirationDate: domain?.expirationDate ? new Date(domain.expirationDate) : undefined,
    },
    mode: 'onSubmit'
  })

  const isDirty = Object.keys(form.formState.dirtyFields).length !== 0

  const clientId = parseInt(form.getValues("client").id)
  const providerId = parseInt(form.getValues("provider").id)

  // useEffect para buscar contactos de los clientes

  useEffect(() => {
    if (clientId) {
      const fetchClientContacts = async () => {
        try {
          const clientContacts = await getContactsByClientId(clientId)
          setClientContacts(clientContacts)
          if (domain && domain.clientId === clientId) {
            form.setValue("contactId", domain.contactId.toString(), { shouldDirty: true })
          } else {
            form.setValue("contactId", "", { shouldDirty: true })
          }
          setSelectedContact(undefined)
        } catch (error) {
          console.error("Error al cargar los contactos del cliente:", error)
        }
      }
      fetchClientContacts();
      setNewClientContactCreated(false);
    }
  }, [clientId, form, domain, newClientContactCreated])

  // useEffect para buscar contactos individuales

  useEffect(() => {
    const fetchContactsWithoutClient = async () => {
      try {
        const individualContacts = await getIndividualContacts()
        setIndividualContacts(individualContacts)
      } catch (error) {
        console.error("Error al cargar los contactos individuales:", error)
      }
    }
    fetchContactsWithoutClient()
    setNewIndividualContactCreated(false);
  }, [newIndividualContactCreated])


  //useEffect para buscar los accesos entre  cliente y proveedor y los de kernel

  useEffect(() => {
    if (clientId && providerId) {
      const fetchClientAccess = async () => {
        try {
          const clientAccess = await getAccessByClientAndProviderId(
            clientId,
            providerId
          )
          setClientAccess(clientAccess)
        } catch (error) {
          console.error("Error al cargar los accesos del cliente:", error)
        }
      }
      const fetchKernelAccess = async () => {
        try {
          const kernelAccess = await getKernelAccessByProviderId(
            providerId
          )
          setKernelAccess(kernelAccess)
        } catch (error) {
          console.error("Error al cargar los accesos de kernel:", error)
        }
      }
      fetchClientAccess()
      fetchKernelAccess()
      setNewClientAccessCreated(false)
      setNewKernelAccessCreated(false)
    }
  }, [clientId, providerId, newClientAccessCreated, newKernelAccessCreated])

  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{domain ? ' Editar dominio' : 'Nuevo dominio'}</CardTitle>
        <CardDescription>{domain ? ' Edite los campos del dominio' : 'Ingrese los campos del dominio'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">

              {/* Nombre */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre del dominio"
                        autoComplete="name"
                        {...field}
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            e.stopPropagation()
                          }
                        }}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CLIENTE */}

              <FormField
                control={form.control}
                name="client.id"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-[11px]">
                    <FormLabel>
                      Cliente <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "m-0 justify-between w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? clients.find(
                                (client) =>
                                  client.id.toString() === field.value
                              )?.name
                              : "Seleccionar cliente"}
                            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>
                              Ningún cliente encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {clients.map((client) => (
                                <CommandItem
                                  value={client.name}
                                  key={client.id}
                                  onSelect={() => {
                                    field.onChange(client.id.toString())
                                    form.setValue("client.name", client.name)
                                    form.setValue("isClientContact", false, { shouldDirty: true })
                                    form.setValue("isKernelContact", false, { shouldDirty: true })
                                    form.setValue("isIndividualContact", false, { shouldDirty: true })
                                    form.setValue("isClientAccess", false, { shouldDirty: true })
                                    form.setValue("isKernelAccess", false, { shouldDirty: true })
                                    form.setValue("accessId", undefined, { shouldDirty: true })
                                  }}
                                >
                                  {client.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      client.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PROVEEDOR */}

              <FormField
                control={form.control}
                name="provider.id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Proveedor <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        const selectedProvider = providers.find(
                          (provider) => provider.id.toString() === value
                        )
                        if (selectedProvider) {
                          form.setValue("provider.name", selectedProvider.name)
                          form.setValue("accessId", undefined, { shouldDirty: true })
                        }
                      }}
                      name="provider"
                      defaultValue={domain?.provider.id.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem
                            key={provider.url}
                            value={provider.id.toString()}
                          >
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* ESTADO */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Estado <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name="state"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {domainStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                              <Badge variant='outline' className={statusConfig[status].color}>
                                {status}
                              </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FECHA DE VENCIMIENTO */}

            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Fecha de Vencimiento{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    onMonthChange={field.onChange}
                    month={field.value || addDays(new Date(), 1)}
                    className="p-2 border rounded-sm"
                    locale={es}
                    classNames={{
                      month_caption: "mx-0",
                    }}
                    disabled={[
                      { before: new Date() },
                    ]}
                    captionLayout="dropdown"
                    defaultMonth={field.value || addDays(new Date(), 1)}
                    startMonth={new Date()}
                    endMonth={addYears(new Date(), 10)}
                    hideNavigation
                    components={{
                      DropdownNav: (props: DropdownNavProps) => {
                        return <div className="flex items-center gap-2 w-full">{props.children}</div>;
                      },
                      Dropdown: (props: DropdownProps) => {
                        return (
                          <Select
                            value={String(props.value)}
                            onValueChange={(value) => {
                              if (props.onChange) {
                                handleCalendarChange(value, props.onChange);
                              }
                            }}
                          >
                            <SelectTrigger className="w-fit h-8 font-medium first:grow">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                              {props.options?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={String(option.value)}
                                  disabled={option.disabled}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      },
                    }}
                  />
                  {
                    domain && <Button
                      variant="outline"
                      size="sm"
                      className="w-min"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        field.onChange(addYears(field.value || new Date(), 1));
                      }}
                    >
                      Próximo año
                    </Button>
                  }
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONTACTO DEL CLIENTE */}

            <div className="space-y-4">
              <span className="items-center peer-disabled:opacity-70 font-medium text-sm text-center leading-none peer-disabled:cursor-not-allowed">
                Contacto <span className="text-red-500">*</span>
              </span>
              <FormField
                control={form.control}
                name="isClientContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Seleccionar un contacto activo del cliente
                      </FormLabel>
                      <FormDescription>
                        Activar para seleccionar un contacto del cliente.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          form.setValue("isClientContact", value, { shouldDirty: false })
                          form.setValue("contactId", "", { shouldDirty: true })
                          setSelectedContact(undefined)
                          form.setValue("isIndividualContact", false)
                          form.setValue("isKernelContact", false)
                        }}
                        disabled={!form.watch("client.id")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("isClientContact") && (
                <>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                    <ContactModal
                      client={{ id: parseInt(form.getValues('client').id), name: form.getValues('client').name }}
                      notification={setNewClientContactCreated}
                    >
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        className="w-full h-36 [&_svg]:size-9"
                      >
                        <Plus className="text-gray-700" />
                      </Button>
                    </ContactModal>

                    {clientContacts.length > 0 &&
                      clientContacts.map((contact) => {
                        return (
                          <ContactInfoCard
                            key={contact.email}
                            contact={contact}
                            isSelected={
                              form.getValues("contactId") ===
                              contact.id.toString()
                            }
                            onSelect={handleSelectContact}
                          />
                        )
                      })}
                  </div>
                  {clientContacts.length === 0 && (
                    <p className="font-medium text-destructive text-sm">
                      Este cliente no tiene contactos.
                    </p>
                  )}
                </>
              )}

              {/* CONTACTO DE KERNEL */}

              <FormField
                control={form.control}
                name="isKernelContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center text-base">
                        Seleccionar un contacto activo de Kernel
                        <div className="flex justify-center items-center rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                          <Image
                            src="/images/logo.svg"
                            width={20}
                            height={20}
                            alt='Logo'
                          />
                        </div>
                      </FormLabel>
                      <FormDescription>
                        Activar para seleccionar un contacto de Kernel.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          form.setValue("isKernelContact", value, { shouldDirty: false })
                          form.setValue("contactId", "", { shouldDirty: true })
                          setSelectedContact(undefined)
                          form.setValue("isIndividualContact", false)
                          form.setValue("isClientContact", false)
                        }}
                        disabled={!form.watch("client.id")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("isKernelContact") && (
                <>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                    <ContactModal
                      client={{ id: 1, name: 'Kernel' }}
                      pathToRevalidate={`/domains/${domain?.id}`}
                    >
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        className="w-full h-36 [&_svg]:size-9"
                      >
                        <Plus className="text-gray-700" />
                      </Button>
                    </ContactModal>

                    {kernelContacts.length > 0 &&
                      kernelContacts.map((contact) => {
                        return (
                          <ContactInfoCard
                            key={contact.email}
                            contact={contact}
                            isSelected={
                              form.getValues("contactId") ===
                              contact.id.toString()
                            }
                            onSelect={handleSelectContact}
                          />
                        )
                      })}
                  </div>
                  {kernelContacts.length === 0 && (
                    <p className="font-medium text-destructive text-sm">
                      Este cliente no tiene contactos.
                    </p>
                  )}
                </>
              )}

              {/* CONTACTO INDIVIDUAL */}

              <FormField
                control={form.control}
                name="isIndividualContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Seleccionar un contacto activo individual
                      </FormLabel>
                      <FormDescription>
                        Activar para seleccionar un contacto que no pertenece
                        a un cliente.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          form.setValue("isIndividualContact", value, { shouldDirty: false })
                          form.setValue("contactId", "", { shouldDirty: true })
                          setSelectedContact(undefined)
                          form.setValue("isClientContact", false)
                          form.setValue("isKernelContact", false)
                        }}
                        disabled={!form.watch("client.id")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("isIndividualContact") && (
                <>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">

                    <ContactModal
                      notification={setNewIndividualContactCreated}
                    >
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        className="w-full h-36 [&_svg]:size-9"
                      >
                        <Plus className="text-gray-700" />
                      </Button>
                    </ContactModal>

                    {individualContacts.map((contact) => (
                      <ContactInfoCard
                        key={contact.email}
                        contact={contact}
                        isSelected={
                          form.getValues("contactId") ===
                          contact.id.toString()
                        }
                        onSelect={handleSelectContact}
                      />
                    ))}
                  </div>
                  {individualContacts.length === 0 && (
                    <p className="font-medium text-destructive text-sm">
                      No hay contactos individuales creados.
                    </p>
                  )}
                </>
              )}

              {form.formState.errors.contactId && (
                <p className="font-medium text-destructive text-sm">
                  {form.formState.errors.contactId.message}
                </p>
              )}
            </div>

            {/* ACCESO DEL CLIENTE */}

            <div className="space-y-4">
              <span className="items-center peer-disabled:opacity-70 font-medium text-sm text-center leading-none peer-disabled:cursor-not-allowed">
                Acceso
              </span>
              <FormField
                control={form.control}
                name="isClientAccess"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Seleccionar un acceso del cliente o crear uno nuevo
                      </FormLabel>
                      <FormDescription>
                        Activar para seleccionar o crear un acceso del cliente
                        y proveedor seleccionado.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          form.setValue("isClientAccess", value, { shouldDirty: false })
                          form.setValue("accessId", undefined, { shouldDirty: true })
                          setSelectedAccess(undefined)
                          form.setValue("isKernelAccess", false)
                        }}
                        disabled={
                          !form.watch("client.id") ||
                          !form.watch("provider.id")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("isClientAccess") && (
                <>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <AccessModal
                      notification={setNewClientAccessCreated}
                      client={{ id: parseInt(form.getValues('client').id), name: form.getValues('client').name }}
                      provider={{ id: parseInt(form.getValues('provider').id), name: form.getValues('provider').name }}
                    >
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        className="w-full h-36 [&_svg]:size-9"
                      >
                        <Plus className="text-gray-700" />
                      </Button>
                    </AccessModal>
                    {clientAccess.length > 0 &&
                      clientAccess.map((access, index) => (
                        <AccessInfoCard
                          key={access.username}
                          access={access}
                          index={index}
                          provider={access.provider?.name}
                          isSelected={
                            form.getValues("accessId") ===
                            access.id
                          }
                          onSelect={handleSelectAccess}
                        />
                      ))}
                  </div>
                  {clientAccess.length === 0 && (
                    <p className="font-medium text-destructive text-sm">
                      El cliente no tiene accesos para el proveedor
                      seleccionado.
                    </p>
                  )}
                </>
              )}

              {/* ACCESO DE KERNEL */}

              <FormField
                control={form.control}
                name="isKernelAccess"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center text-base">
                        Seleccionar un acceso de Kernel
                        <div className="flex justify-center items-center rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                          <Image
                            src="/images/logo.svg"
                            width={20}
                            height={20}
                            alt='Logo'
                          />
                        </div>
                      </FormLabel>
                      <FormDescription>
                        Activar para seleccionar un acceso de Kernel
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          form.setValue("isKernelAccess", value, { shouldDirty: false })
                          form.setValue("accessId", undefined, { shouldDirty: true })
                          setSelectedAccess(undefined)
                          form.setValue("isClientAccess", false)
                        }}
                        disabled={
                          !form.watch("client.id") ||
                          !form.watch("provider.id")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("isKernelAccess") && (
                <>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <AccessModal
                      notification={setNewKernelAccessCreated}
                      client={{ id: 1, name: 'Kernel' }}
                      provider={{ id: parseInt(form.getValues('provider').id), name: form.getValues('provider').name }}
                    >
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        className="w-full h-36 [&_svg]:size-9"
                      >
                        <Plus className="text-gray-700" />
                      </Button>
                    </AccessModal>
                    {kernelAccess.length > 0 &&
                      kernelAccess.map((access, index) => (
                        <AccessInfoCard
                          key={access.username}
                          access={access}
                          index={index}
                          provider={access.provider?.name}
                          isSelected={
                            form.getValues("accessId") ===
                            access.id
                          }
                          onSelect={handleSelectAccess}
                        />
                      ))}
                  </div>
                  {kernelAccess.length === 0 && (
                    <p className="font-medium text-destructive text-sm">
                      No tienes accesos para el proveedor
                      seleccionado.
                    </p>
                  )}
                </>
              )}

            </div>

            {/* BOTON SUBMIT */}
            {Object.keys(form.formState.dirtyFields).length !== 0 && domain ?
              (<div className="flex justify-end">
                <Button
                  className="gap-2"
                  size="lg"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="animate-spin" />
                      Editando dominio
                    </div>
                  ) : (
                    <>

                      Guardar
                    </>
                  )}
                </Button>
              </div>) : !domain && (
                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    size="lg"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="animate-spin" />
                        Registrando dominio
                      </div>
                    ) : (
                      <>
                        <Globe className="w-5 h-5" />
                        Registrar dominio
                      </>
                    )}
                  </Button>
                </div>
              )
            }
          </form>
        </Form>
      </CardContent>
      {/* DIALOGS DE CONFIRMACIÓN */}
      <ResponsiveDialog
        open={isEditConfirmationDomainModalOpen}
        onOpenChange={() => setIsEditConfirmationDomainModalOpen(false)}
        title="Confirmar edición"
        description="Revise que los datos sean correctos y confirme la edición."
        className="sm:max-w-[700px]"
      >
        <EditDomainConfirmationModal
          handleSubmit={handleFinalSubmit}
          form={form}
          oldDomain={domain}
          newSelectedContact={selectedContact}
          newSelectedAccess={selectedAccess}
          oldSelectedContact={domain?.contact}
          oldSelectedAccess={domain?.accessData?.access}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        open={isConfirmationDomainModalOpen}
        onOpenChange={() => setIsConfirmationDomainModalOpen(false)}
        title="Confirmar registro"
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[700px]"
      >
        <CreateDomainConfirmationModal
          handleSubmit={handleFinalSubmit}
          form={form}
          selectedContact={selectedContact}
          selectedAccess={selectedAccess}
          provider={form.getValues("provider.name")}
        />
      </ResponsiveDialog>
      <PreventNavigation isDirty={isDirty} backHref={'/domain'} resetData={form.reset} />
    </Card>
  )
}
