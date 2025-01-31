"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addDays, addYears, format, parse } from "date-fns"
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
  AccessType,
  ContactType,
  domainFormSchema,
  DomainFormValues
} from "@/validators/client-validator"
import { toast } from "sonner"
import {
  Client,
  Contact as ContactDBType,
  Access as AccessDBType,
  ContactInsert,
  Provider,
  AccessWithRelations,
  DomainInsert,
  DomainWithRelations
} from "@/db/schema"
import {
  getContactsByClientId,
  getIndividualContacts,
  insertContact,
  validateEmail,
  validatePhone
} from "@/actions/contacts-actions"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { CreateContactForm } from "@/app/(root)/clients/create/_components/contacts/create-contact-form"
import ContactInfoCard from "@/app/(root)/clients/_components/contact-info-card"
import { cn } from "@/lib/utils"
import {
  getAccessByClientAndProviderId,
  getKernelAccessByProviderId,
  insertAccess,
  validateUsername
} from "@/actions/accesses-actions"
import { NewClientContactConfirmationModal } from "./new-client-contact-confirmation-modal"
import { AccessInfoCard } from "@/app/(root)/clients/_components/access-info-card"
import NewClientAccessConfirmationModal from "./new-client-access-confirmation-modal"
import { es } from "date-fns/locale"
import { CreateDomainConfirmationModal } from "./create-domain-confirmation-modal"
import { insertDomain, updateDomain, validateDomainName } from "@/actions/domains-actions"
import { CreateAccessModal } from "@/components/access/create-access-modal"
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
  setIsEditing
}: {
  providers: Provider[]
  clients: Client[]
  domain?: DomainWithRelations
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
}) {

  //** CONTACTOS:

  // Contactos del cliente
  const [clientContacts, setClientContacts] = useState<ContactDBType[]>([])

  //Contactos individuales
  const [individualContacts, setIndividualContacts] = useState<ContactDBType[]>(
    []
  )

  // Estado para mostrar el modal de creación de contacto
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] =
    useState(false)

  //Estado para mostrar el modal de confirmación de nuevo contacto de base de datos
  const [
    isNewDBContactConfirmationModalOpen,
    setIsNewDBContactConfirmationModalOpen
  ] = useState(false)

  //Estado para manejar el nuevo contacto de la base de datos
  const [newDBContact, setNewDBClientContact] = useState<ContactType>({
    email: "",
    name: "",
    status: "Activo",
    type: "Administrativo"
  })

  //Estado para manejar el contacto seleccionado de la base de datos
  const [selectedContact, setSelectedContact] = useState<ContactDBType>()

  //** ACCESOS
  //Accesos del cliente con la relacion de proveedores
  const [clientAccess, setClientAccess] = useState<
    Omit<AccessWithRelations, "domainAccess" | "client">[]
  >([])

  const [kernelAccess, setKernelAccess] = useState<
    Omit<AccessWithRelations, "domainAccess" | "client">[]
  >([])

  //Estado para mostrar el modal de creación de acceso
  const [isCreateAccessModalOpen, setIsCreateAccessModalOpen] = useState(false)

  //Estado para mostrar el modal de confirmación de nuevo acceso de base de datos
  const [
    isNewDBAccessConfirmationModalOpen,
    setIsNewDBAccessConfirmationModalOpen
  ] = useState(false)

  //Estado para manejar el nuevo acceso de la base de datos
  const [newDBAccess, setNewDBAccess] = useState<AccessType>({
    username: "",
    password: "",
    provider: { id: "", name: "" }
  })
  //Estado para manejar el acceso seleccionado de la base de datos
  const [selectedAccess, setSelectedAccess] = useState<AccessDBType>()

  //** FORMULARIO

  //Estado para manejar manualmente el envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false)

  //Estado para mostrar el modal de confirmación final del dominio
  const [isConfirmationDomainModalOpen, setIsConfirmationDomainModalOpen] = useState(false)

  //Estado para mostrar el modal de confirmación cuando se edita el dominio
  const [isEditConfirmationDomainModalOpen, setIsEditConfirmationDomainModalOpen] = useState(false)

  const getContactSchema = () => {
    return domainFormSchema.shape.contact.superRefine(async (data, ctx) => {
      const { email, phone } = data
        ? data
        : { email: undefined, phone: undefined }
      if (email) {
        const isValid = await validateEmail(email)
        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El correo ya está registrado en el sistema.",
            path: ["email"]
          })
        }
      }

      if (phone) {
        const isValid = await validatePhone(phone)
        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El teléfono ya está registrado en el sistema",
            path: ["phone"]
          })
        }
      }
    })
  }

  const getAccessSchema = () => {
    return domainFormSchema.shape.access.superRefine(async (data, ctx) => {
      const { provider, username } = data
        ? data
        : { provider: undefined, username: undefined }
      if (username && provider) {
        const alreadyRegistered = await validateUsername(
          username,
          parseInt(provider.id, 10)
        )
        if (!alreadyRegistered) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "El usuario o email ya está registrado en el sistema para el proveedor seleccionado.",
            path: ["username"]
          })
        }
      }
    })
  }

  const addNewDbContact = (contact: ContactType) => {
    setNewDBClientContact(contact)
    setIsNewDBContactConfirmationModalOpen(true)
  }

  const addNewDbAccess = (access: AccessType) => {
    setNewDBAccess(access)
    setIsNewDBAccessConfirmationModalOpen(true)
  }

  const handleSelectContact = (contactId: string, contact: ContactDBType) => {
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

  const handleSelectAccess = (accessId: number, access: AccessDBType) => {
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

  const onSubmit: SubmitHandler<DomainFormValues> = () => {
    if (domain) {
      setIsEditConfirmationDomainModalOpen(true)
    }
    else {
      setIsConfirmationDomainModalOpen(true)
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    const data = {
      ...form.getValues(),
      expirationDate: format(
        form.getValues("expirationDate"),
        "yyyy-MM-dd HH:mm:ss.SSSSSS"
      )
    }
    const domainInsert: DomainInsert = {
      id: form.getValues("id"),
      name: data.name,
      providerId: parseInt(data.provider.id, 10),
      clientId: parseInt(data.client.id, 10),
      contactId: parseInt(data.contactId, 10),
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

  const handleNewDBContactSubmit = async () => {
    setIsSubmitting(true)
    const contact: ContactInsert = {
      clientId: form.getValues("isClientContact")
        ? parseInt(form.getValues("client.id"), 10)
        : undefined,
      name: newDBContact.name,
      email: newDBContact.email,
      status: newDBContact.status,
      type: newDBContact.type,
      phone: newDBContact.phone
    }
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await insertContact(contact)
          resolve()
          setIsNewDBContactConfirmationModalOpen(false)
          setIsCreateContactModalOpen(false)
          setNewDBClientContact({
            email: "",
            name: "",
            status: "Activo",
            type: "Administrativo"
          })
        } catch (error) {
          console.error(error)
          reject(error)
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: "Registrando contacto",
        success: "Contacto registrado satisfactoriamente",
        error: "No se pudo registrar el contacto correctamente."
      }
    )
  }

  const handleNewDBAccessSubmit = async () => {
    setIsSubmitting(true)
    const access: AccessType = {
      username: newDBAccess.username,
      password: newDBAccess.password,
      providerId: parseInt(newDBAccess.provider.id, 10),
      clientId: parseInt(form.getValues("client.id"), 10),
      notes: newDBAccess.notes,
      provider: newDBAccess.provider
    }
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await insertAccess(access, access.clientId as number)
          resolve()
          setIsNewDBAccessConfirmationModalOpen(false)
          setIsCreateAccessModalOpen(false)
          setNewDBAccess({
            username: "",
            password: "",
            provider: { id: "", name: "" }
          })
        } catch (error) {
          console.error(error)
          reject(error)
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: "Registrando acceso",
        success: "Acceso registrado satisfactoriamente",
        error: "No se pudo registrar el acceso correctamente."
      }
    )
  }

  const getDomainSchema = () => {
    return domainFormSchema.superRefine(async (data, ctx) => {
      const { contactId, name } = data
      if (contactId === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El contacto es requerido.",
          path: ["contactId"]
        })
      }

      const alreadyRegistered = await validateDomainName(name)
      if (!alreadyRegistered && name !== domain?.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre de dominio ya está registrado en el sistema.",
          path: ["name"]
        })
      }
    })
  }

  const newDomainSchema = getDomainSchema()

  const form = useForm<z.infer<typeof newDomainSchema>>({
    resolver: zodResolver(newDomainSchema),
    defaultValues: {
      id: domain?.id,
      name: domain?.name ? domain?.name : "",
      provider: { id: domain?.provider.id.toString() ? domain?.provider.id.toString() : undefined, name: domain?.provider.name ? domain?.provider.name : undefined },
      client: { id: domain?.client.id.toString(), name: domain?.client.name },
      contactId: domain?.contactId.toString() ? domain?.contactId.toString() : '',
      accessId: domain?.accessData?.access.id,
      isClientContact: domain?.contact.clientId !== undefined && domain?.clientId !== undefined && domain?.contact.clientId === domain?.clientId,
      isIndividualContact: domain?.contact.clientId !== undefined && domain?.clientId !== undefined && domain?.contact.clientId !== domain?.clientId,
      isClientAccess: domain?.accessData?.access.clientId !== undefined && domain?.clientId !== undefined && domain?.accessData?.access.clientId === domain?.clientId,
      isKernelAccess: domain?.accessData?.access.clientId !== undefined && domain?.clientId !== undefined && domain?.accessData?.access.clientId !== domain?.clientId,
      status: domain?.status,
      expirationDate: domain?.expirationDate ? new Date(domain.expirationDate) : undefined,
    },
    mode: 'onSubmit'
  })

  const isDirty = Object.keys(form.formState.dirtyFields).length !== 0
  const today = new Date();

  const clientId = parseInt(form.getValues("client").id, 10)
  const providerId = parseInt(form.getValues("provider").id, 10)

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
      fetchClientContacts()
    }
  }, [clientId, form, domain, newDBContact])

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
  }, [newDBContact])

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
    }
  }, [clientId, providerId, newDBAccess])

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            <div className="flex items-center gap-2">
                              <Badge className={statusConfig[status].color}>
                                {status}
                              </Badge>
                            </div>
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
                <FormItem className="flex flex-col w-1/2">
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
                    className="p-2"
                    locale={es}
                    classNames={{
                      month_caption: "mx-0",
                    }}
                    disabled={[
                      { before: today },
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
                      variant="ghost"
                      size="sm"
                      className="justify-start w-min"
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
              <span className="items-center peer-disabled:opacity-70 font-medium text-center text-sm leading-none peer-disabled:cursor-not-allowed">
                Contacto <span className="text-red-500">*</span>
              </span>
              <FormField
                control={form.control}
                name="isClientContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Usar un contacto activo del cliente
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
                    <Button
                      aria-labelledby="button-label"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateContactModalOpen(true)
                      }}
                      className="w-full h-36 [&_svg]:size-9"
                    >
                      <Plus className="text-gray-700" />
                    </Button>
                    <ResponsiveDialog
                      open={isCreateContactModalOpen}
                      onOpenChange={() => setIsCreateContactModalOpen(false)}
                      title="Agregar nuevo contacto del cliente"
                      description="Agregue los datos correspondientes al contacto."
                    >
                      <CreateContactForm
                        onSave={addNewDbContact}
                        contactSchema={getContactSchema()}
                      />
                    </ResponsiveDialog>
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

              {/* CONTACTO INDIVIDUAL */}

              <FormField
                control={form.control}
                name="isIndividualContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Usar un contacto activo individual
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
                    <Button
                      aria-labelledby="button-label"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateContactModalOpen(true)
                      }}
                      className="w-full h-36 [&_svg]:size-9"
                    >
                      <Plus className="text-gray-700" />
                    </Button>
                    <ResponsiveDialog
                      open={isCreateContactModalOpen}
                      onOpenChange={() => setIsCreateContactModalOpen(false)}
                      title="Agregar nuevo contacto individual"
                      description="Agregue los datos correspondientes al contacto."
                    >
                      <CreateContactForm
                        onSave={addNewDbContact}
                        contactSchema={getContactSchema()}
                      />
                    </ResponsiveDialog>
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
              <span className="items-center peer-disabled:opacity-70 font-medium text-center text-sm leading-none peer-disabled:cursor-not-allowed">
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
                    <CreateAccessModal
                      onSave={addNewDbAccess}
                      accessSchema={getAccessSchema()}
                      providers={providers}
                      provider={form.getValues("provider")}
                      from="domains-create"
                    />
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
                        <div className="flex justify-center items-center rounded-lg text-sidebar-primary-foreground aspect-square size-8">
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
                      <Globe className="w-5 h-5" />
                      Editar dominio
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
        open={isNewDBContactConfirmationModalOpen}
        onOpenChange={() => setIsNewDBContactConfirmationModalOpen(false)}
        title="Confirmar registro de nuevo contacto"
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[420px]"
      >
        <NewClientContactConfirmationModal
          contact={newDBContact}
          handleSubmit={handleNewDBContactSubmit}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        open={isNewDBAccessConfirmationModalOpen}
        onOpenChange={() => setIsNewDBAccessConfirmationModalOpen(false)}
        title="Confirmar registro del nuevo acceso"
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[420px]"
      >
        <NewClientAccessConfirmationModal
          access={newDBAccess}
          handleSubmit={handleNewDBAccessSubmit}
        />
      </ResponsiveDialog>
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
