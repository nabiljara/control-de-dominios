"use client"

import { useState, useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addDays, format } from "date-fns"
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
  CalendarIcon,
  Loader2,
  Globe,
  Plus,
  ChevronsUpDown,
  Check
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
  AccessInsert
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
  insertAccess,
  validateUsername
} from "@/actions/accesses-actions"
import { NewClientContactConfirmationModal } from "./new-client-contact-confirmation-modal"
import { AccessInfoCard } from "@/app/(root)/clients/_components/access-info-card"
import NewClientAccessConfirmationModal from "./new-client-access-confirmation-modal"
import { es } from "date-fns/locale"
import { CreateDomainConfirmationModal } from "./create-domain-confirmation-modal"
import { insertDomain, validateDomainName } from "@/actions/domains-actions"
import { CreateAccessModal } from "@/components/access/create-access-modal"

export default function CreateDomainForm({
  providers,
  clients
}: {
  providers: Provider[]
  clients: Client[]
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

  //Opciones de los estados del dominio
  const statusOptions = domainFormSchema.shape.status.options

  //Estado para mostrar el modal de confirmación final del dominio
  const [isConfirmationDomainModalOpen, setIsConfirmationDomainModalOpen] =
    useState(false)

  const onSubmit: SubmitHandler<DomainFormValues> = () => {
    setIsConfirmationDomainModalOpen(true)
  }

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
    form.setValue("contactId", contactId)
    form.trigger()
    setSelectedContact(contact)
  }

  const handleSelectAccess = (accessId: string, access: AccessDBType) => {
    form.setValue("accessId", accessId)
    form.trigger()
    setSelectedAccess(access)
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
    const domain: DomainInsert = {
      name: data.name,
      providerId: parseInt(data.provider.id, 10),
      clientId: parseInt(data.client.id, 10),
      contactId: parseInt(data.contactId, 10),
      expirationDate: data.expirationDate,
      status: data.status
    }
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await insertDomain(
            domain,
            form.getValues("hasAccess") ? form.getValues("accessId") : undefined
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
        error: "No se pudo registrar el dominio correctamente."
      }
    )
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
        loading: "Registrando contacto",
        success: "Contacto registrado satisfactoriamente",
        error: "No se pudo registrar el contacto correctamente."
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
      if (!alreadyRegistered) {
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
      name: "",
      provider: { id: undefined, name: undefined },
      client: { id: undefined, name: undefined },
      contactId: "",
      isClientContact: false,
      hasAccess: false
    }
  })

  const clientId = parseInt(form.getValues("client").id, 10)
  const providerId = parseInt(form.getValues("provider").id, 10)
  useEffect(() => {
    if (clientId) {
      const fetchClientContacts = async () => {
        try {
          const clientContacts = await getContactsByClientId(clientId)
          setClientContacts(clientContacts)
          form.setValue("contactId", "")
          setSelectedContact(undefined)
        } catch (error) {
          console.error("Error al cargar los contactos del cliente:", error)
        }
      }
      fetchClientContacts()
    }
  }, [clientId, form, newDBContact])

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
      fetchClientAccess()
    }
  }, [clientId, providerId, newDBAccess])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nuevo dominio</CardTitle>
          <CardDescription>Ingrese los detalles del dominio</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        />
                      </FormControl>
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
                            form.setValue(
                              "provider.name",
                              selectedProvider.name
                            )
                          }
                        }}
                        name="provider"
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
                                "m-0 justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? clients.find(
                                    (client) =>
                                      client.id.toString() === field.value
                                  )?.name
                                : "Seleccionar cliente"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
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

                {/* ESTADO -> TODO DINÁMICO */}
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
                            <SelectValue placeholder="Seleccione un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <SelectItem value="Activo">
                            <Badge variant="outline" className="bg-green-500">Activo</Badge>
                          </SelectItem>
                          <SelectItem value="Inactivo">
                            <Badge variant="outline">Inactivo</Badge>
                          </SelectItem>
                          <SelectItem value="Suspendido">
                            <Badge variant="outline" className="bg-red-500">Suspendido</Badge>
                          </SelectItem> */}
                          {/* //TODO: COLORES */}
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown-buttons"
                          mode="single"
                          fromDate={addDays(new Date(), 1)}
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CONTACTO DEL CLIENTE */}

              <div className="space-y-4">
                <span className="items-center text-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contacto <span className="text-red-500">*</span>
                </span>
                <FormField
                  control={form.control}
                  name="isClientContact"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                            field.onChange(value)
                            form.setValue("contactId", "")
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateContactModalOpen(true)
                        }}
                        className="h-36 w-full [&_svg]:size-9"
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
                      <p className="text-sm font-medium text-destructive">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                            field.onChange(value)
                            form.setValue("contactId", "")
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
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Button
                        aria-labelledby="button-label"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateContactModalOpen(true)
                        }}
                        className="h-36 w-full [&_svg]:size-9"
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
                      <p className="text-sm font-medium text-destructive">
                        No hay contactos individuales creados.
                      </p>
                    )}
                  </>
                )}

                {form.formState.errors.contactId && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.contactId.message}
                  </p>
                )}
              </div>

              {/* ACCESO */}

              <div className="space-y-4">
                <span className="items-center text-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Acceso
                </span>
                <FormField
                  control={form.control}
                  name="hasAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Seleccionar un acceso o crear uno nuevo
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
                            field.onChange(value)
                            form.setValue("accessId", "")
                            setSelectedAccess(undefined)
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
                {form.watch("hasAccess") && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                              access.id.toString()
                            }
                            onSelect={handleSelectAccess}
                          />
                        ))}
                    </div>
                    {clientAccess.length === 0 && (
                      <p className="text-sm font-medium text-destructive">
                        El cliente no tiene accesos para el proveedor
                        seleccionado.
                      </p>
                    )}
                  </>
                )}
              </div>

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
                      <Globe className="h-5 w-5" />
                      Registrar dominio
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ResponsiveDialog
        open={isNewDBContactConfirmationModalOpen}
        onOpenChange={() => setIsNewDBContactConfirmationModalOpen(false)}
        title="Confirmar registro de nuevo contacto"
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[700px]"
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
        className="sm:max-w-[700px]"
      >
        <NewClientAccessConfirmationModal
          access={newDBAccess}
          handleSubmit={handleNewDBAccessSubmit}
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
    </div>
  )
}
