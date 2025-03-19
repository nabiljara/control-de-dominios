"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Plus, UserPlus, Loader2, Handshake } from "lucide-react"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Contact } from "@/app/(root)/clients/create/_components/contacts/contact"
import { ContactModal } from "@/components/contact-modal"
import { Access } from "@/app/(root)/clients/create/_components/accesses/access"
import { CreateClientConfirmationModal } from "@/app/(root)/clients/create/_components/create-client-confirmation-modal"
import { Provider } from "@/db/schema"
import { Locality } from "@/db/schema"
import { toast } from "sonner"
import { createClient } from "@/actions/client-actions"
import {
  accessFormSchema,
  AccessFormValues,
  clientFormSchema,
  ClientFormValues,
  contactFormSchema,
  ContactFormValues
} from "@/validators/zod-schemas"
import { AccessModal } from "@/components/access-modal"
import { PreventNavigation } from "@/components/prevent-navigation"
import { clientSizes, clientStatus, sizeConfig, statusConfig } from "@/constants"

export function CreateClientForm({
  providers,
  localities
}: {
  providers: Provider[]
  localities: Locality[]
}) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contacts, setContacts] = useState<ContactFormValues[]>([])
  const [accessArray, setAccessArray] = useState<AccessFormValues[]>([])

  const getContactSchema = (editingIndex: number | null) => {
    return contactFormSchema.superRefine((data, ctx) => {
      const { email, phone } = data

      if (contacts.some((c, i) => i !== editingIndex && c.email === email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El correo ya ha sido cargado.",
          path: ["email"]
        });
      }

      if (contacts.some((c, i) => i !== editingIndex && c.phone === phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El número de teléfono ya está en uso.",
          path: ["phone"]
        });
      }
    })
  }

  const getAccessSchema = (editingIndex: number | null) => {
    return accessFormSchema
      .superRefine(async (data, ctx) => {
        const { provider, username } = data
        const isDuplicate = accessArray.some(
          (access, i) =>
            i !== editingIndex &&
            access.provider.id === provider.id &&
            access.username === username
        )

        if (isDuplicate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "El usuario o email ya está en uso para el proveedor seleccionado.",
            path: ["username"]
          })
        }
      })
  }

  const onSubmit: SubmitHandler<ClientFormValues> = () => {
    setIsConfirmationModalOpen(true)
  }

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const editContact = (index: number, updatedContact: ContactFormValues) => {
    setContacts(
      contacts.map((contact, i) => (i === index ? updatedContact : contact))
    )
  }

  const removeAccess = (index: number) => {
    setAccessArray(accessArray.filter((_, i) => i !== index))
  }

  const editAccess = (index: number, updatedAccess: AccessFormValues) => {
    setAccessArray(
      accessArray.map((access, i) => (i === index ? updatedAccess : access))
    )
  }

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      contacts: [],
      access: [],
      status:'Activo'
    }
  })

  const isDirty = Object.keys(form.formState.dirtyFields).length !== 0 || contacts.length !== 0 || accessArray.length !== 0

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    const client = { ...form.getValues(), contacts, access: accessArray }

    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await createClient(client)
          resolve()
          setIsConfirmationModalOpen(false)
        } catch (error) {
          console.error(error)
          reject(error)
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: "Registrando cliente...",
        success: "Cliente registrado satisfactoriamente.",
        error: "No se pudo registrar el cliente correctamente."
      }
    )
  }

  return (
    <div className="p-6 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold text-2xl">
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
              <Handshake className="w-6 h-6 text-primary" />
            </div>
            Registro de Cliente
          </CardTitle>
          <CardDescription>
            Complete el formulario para registrar un nuevo cliente. Los campos
            marcados con <span className="text-red-500">*</span> son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent className="md:flex-row space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex md:flex-row flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Nombre <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el nombre del cliente"
                            autoComplete="name"
                            {...field}
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Tamaño <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          name="size"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el tamaño" />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex md:flex-row flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="locality.id"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Localidad <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            const selectedLocality = localities.find(
                              (locality) => locality.id.toString() === value
                            )
                            if (selectedLocality) {
                              form.setValue("locality.name", selectedLocality.name)
                            }
                          }}
                          defaultValue={field.value}
                          name="locality"
                        >
                          <FormControl>
                            <SelectTrigger>
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                            {clientStatus.map((status) => (
                              <SelectItem key={status} value={status} className="hover:bg-muted cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={statusConfig[status].color}>
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
              </div>


              {/* CONTACTOS */}

              <FormItem>
                <div className="flex items-center gap-5">
                  <span className="peer-disabled:opacity-70 mb-1 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                    Contactos
                  </span>
                </div>
                <FormControl>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ContactModal
                      contacts={contacts}
                      setContacts={setContacts}
                      contactFormSchema={getContactSchema(null)}
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
                    {contacts.map((contact, index) => (
                      <Contact
                        key={index}
                        contact={contact}
                        index={index}
                        removeContact={removeContact}
                        editContact={editContact}
                        contactSchema={getContactSchema(index)}
                      />
                    ))}
                  </div>
                </FormControl>
              </FormItem>

              {/* ACCESOS */}

              <FormItem>
                <div className="flex items-center gap-5">
                  <span className="peer-disabled:opacity-70 mb-1 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                    Accesos
                  </span>
                </div>
                <FormControl>
                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                    <AccessModal
                      accessArray={accessArray}
                      setAccess={setAccessArray}
                      accessFormSchema={getAccessSchema(null)}
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
                    {accessArray.map((access, index) => (
                      <Access
                        key={index}
                        access={access}
                        index={index}
                        removeAccess={removeAccess}
                        editAccess={editAccess}
                        accessSchema={getAccessSchema(index)}
                        providers={providers}
                      />
                    ))}
                  </div>
                </FormControl>
              </FormItem>

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
                      Registrando cliente
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Registrar Cliente
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ResponsiveDialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
        title="Confirmar registro"
        description="Revise que los datos sean correctos y confirme el registro."
        className="md:max-w-fit"
      >
        <CreateClientConfirmationModal
          handleSubmit={handleFinalSubmit}
          contacts={contacts}
          form={form}
          isSubmitting={isSubmitting}
          accesses={accessArray}
          setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        />
      </ResponsiveDialog>
      <PreventNavigation isDirty={isDirty} backHref={'/clients'} resetData={form.reset} />
    </div >
  )
}
