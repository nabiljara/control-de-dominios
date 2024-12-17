'use client'

import { useState, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, PlusCircle, Loader2, Eye, User, Users, Building, UserPlus, Globe, Plus, ChevronsUpDown, Check } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import SearchableSelect from '@/components/searchable-select'
import { AccessType, ContactType, domainFormSchema, DomainFormValues } from '@/validators/client-validator'
import { toast } from 'sonner'
import { Client, Provider } from '@/db/schema'
import { Contact } from '@/app/(root)/clients/create/_components/contacts/contact'
import { getContactsByClient, validateEmail, validatePhone } from '@/actions/contacts-actions'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { CreateContactForm } from '@/app/(root)/clients/create/_components/contacts/create-contact-form'
import ContactInfoCard from '@/app/(root)/clients/_components/contact-info-card'
import { cn } from '@/lib/utils'


export default function CreateDomainForm({
  providers,
  clients
}: {
  providers: Provider[]
  clients: Client[]
}
) {

  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(false)
  const [contacts, setContacts] = useState<ContactType[]>([])
  const [temporaryContact, setTemporaryContact] = useState<ContactType[]>([])
  const [isCreateAccessModalOpen, setIsCreateAccessModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(undefined);
  const [access, setAccess] = useState<AccessType>()
  const statusOptions = domainFormSchema.shape.status.options;

  const onSubmit: SubmitHandler<DomainFormValues> = () => {
    // setIsConfirmationModalOpen(true)
    console.log('Hola');
  }

  const getContactSchema = (editingIndex: number | null) => {
    return domainFormSchema.shape.contact.superRefine(
      async (data, ctx) => {
        const { email, phone } = data ? data : { email: undefined, phone: undefined };
        if (email) {
          const isValid = await validateEmail(email)
          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El correo ya está registrado en el sistema.",
              path: ["email"],
            });
          }
        }

        if (phone) {
          const isValid = await validatePhone(phone)
          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El teléfono ya está registrado en el sistema",
              path: ["phone"],
            });
          }
        }
      }
    )
  };


  const addContact = (contact: ContactType) => {
    setTemporaryContact([...temporaryContact, contact])
    setIsCreateContactModalOpen(false)
  }
  const removeContact = (index: number) => {
    setTemporaryContact(temporaryContact.filter((_, i) => i !== index))
  }

  const editContact = (index: number, updatedContact: ContactType) => {
    setTemporaryContact(temporaryContact.map((contact, i) => (i === index ? updatedContact : contact)));
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId)
    form.setValue('contactId', contactId)
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // const domain = { ...form.getValues(), contact, access }
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          // await insertDomain(domain);
          resolve();
          setIsConfirmationModalOpen(false);
        } catch (error) {
          console.error(error)
          reject(error);
        } finally {
          setIsSubmitting(false);
        }
      }),
      {
        loading: 'Registrando dominio',
        success: 'Dominio registrado satisfactoriamente',
        error: 'No se pudo registrar el dominio correctamente.'
      }
    )
  }

  const form = useForm<z.infer<typeof domainFormSchema>>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      name: '',
      provider: { id: undefined, name: undefined },
      client: { id: undefined, name: undefined },
      contact: undefined,
      contactId: undefined,
      isClientContact: false
    },
  })

  const clientId = parseInt(form.getValues('client').id, 10)
  // console.log(form.getValues('name'));
  // console.log(form.getValues('client.id'));
  // console.log(form.getValues('client.name'));
  // console.log(form.getValues('expirationDate'));
  // console.log(form.getValues('provider.id'));
  // console.log(form.getValues('provider.name'));
  // console.log(form.getValues('status'));
  console.log(form.getValues('contactId'));


  useEffect(() => {
    const fetchClientContacts = async () => {
      try {
        if (clientId) {
          const contacts = await getContactsByClient(clientId);
          const newContacts: ContactType[] = []
          contacts.map((contact) => {
            const newContact: ContactType = {
              name: contact.name,
              email: contact.email,
              status: contact.status,
              type: contact.type,
              id: contact.id.toString(),
              phone: contact.phone ? contact.phone : undefined,
            }
            newContacts.push(newContact)
          })
          setContacts(newContacts);
          setSelectedContactId(undefined)
        }
      } catch (error) {
        console.error("Error al cargar las localidades:", error);
      }
    };
    fetchClientContacts();
  }, [clientId]);

  return (
    <div className="bg-gradient-to-b from-gray-50 dark:from-gray-900 to-gray-100/50 dark:to-gray-800 p-4 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nuevo dominio</CardTitle>
          <CardDescription>Ingrese los detalles del dominio</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre del dominio" autoComplete='name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        const selectedProvider = providers.find((provider) => provider.id.toString() === value);
                        if (selectedProvider) {
                          form.setValue("provider.name", selectedProvider.name);
                        }
                      }} name='provider'>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el proveedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            providers.map((provider) => (
                              <SelectItem key={provider.url} value={provider.id.toString()}>{provider.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client.id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-[11px]">
                      <FormLabel>Cliente <span className="text-red-500">*</span></FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between m-0",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? clients.find(
                                  (client) => client.id.toString() === field.value
                                )?.name
                                : "Seleccionar cliente"}
                              <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[200px]">
                          <Command>
                            <CommandInput placeholder="Buscar cliente..." />
                            <CommandList>
                              <CommandEmpty>Ningún cliente encontrado.</CommandEmpty>
                              <CommandGroup>
                                {clients.map((client) => (
                                  <CommandItem
                                    value={client.name}
                                    key={client.id}
                                    onSelect={() => {
                                      field.onChange(client.id.toString());
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

                {/* TODO DINÁMICO */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} name='state'>
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
                          {
                            statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Vencimiento <span className="text-red-500">*</span></FormLabel>
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
                            <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.watch('isClientContact') && form.watch('client.id') &&
                <FormItem>
                  <div className="flex items-center gap-5">
                    <span className='peer-disabled:opacity-70 mb-4 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'>Contacto <span className="text-red-500">*</span></span>
                    {temporaryContact.length <= 0 && <Button
                      aria-labelledby="button-label"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateContactModalOpen(true);
                      }}
                      className='rounded-full w-8 h-8'
                    >
                      <Plus />
                    </Button>}
                  </div>
                  <div className="gap-4 w-1/2">
                    {temporaryContact.map((contact, index) => (
                      <Contact key={contact.email} contact={contact} index={index} removeContact={removeContact} editContact={editContact} contactSchema={getContactSchema(null)} />
                    ))
                    }
                  </div>
                  <ResponsiveDialog open={isCreateContactModalOpen} onOpenChange={setIsCreateContactModalOpen} title='Agregar contacto' description='Agregue los datos correspondientes al contacto.'>
                    <CreateContactForm onSave={addContact} contactSchema={getContactSchema(null)} />
                  </ResponsiveDialog>
                </FormItem>}


              {form.watch('client.id') &&

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isClientContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-row justify-between items-center p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Usar contacto del cliente</FormLabel>
                          <FormDescription>
                            Activar para usar el contacto del cliente seleccionado
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.contactId && <p
                    className='font-medium text-destructive text-sm'>
                    {form.formState.errors.contactId.message}
                  </p>
                  }

                  {form.watch("isClientContact") && (contacts.length > 0 ? (
                    <>
                      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                        {contacts.map((contact) => (
                          <ContactInfoCard
                            key={contact.email}
                            {...contact}
                            isSelected={selectedContactId === contact.id}
                            onSelect={handleSelectContact} />
                        ))}
                      </div>
                    </>
                  ) :
                    (
                      <div>
                        Este cliente no tiene contactos
                      </div>
                    )
                  )}
                </div>
              }

              {/* {form.watch('client.id') && form.watch('provider.id') &&  */}

              {/* } */}

              <div className='flex justify-end'>
                <Button
                  className="gap-2"
                  size="lg"
                  disabled={isSubmitting}
                  type='submit'>
                  {isSubmitting ? (
                    <div className='flex items-center gap-1'>
                      <Loader2 className='animate-spin' />
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}