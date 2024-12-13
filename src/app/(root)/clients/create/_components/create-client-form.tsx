'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Plus, UserPlus, Loader2 } from "lucide-react"
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Contact } from '@/app/(root)/clients/create/_components/contacts/contact'
import { CreateContactForm } from '@/app/(root)/clients/create/_components/contacts/create-contact-form'
import { Access } from '@/app/(root)/clients/create/_components/accesses/access'
import { CreateAccessForm } from '@/app/(root)/clients/create/_components/accesses/create-access-form'
import { ConfirmationModal } from '@/app/(root)/clients/create/_components/confirmation-modal'
import { Provider } from '@/actions/provider-actions'
import { Locality } from '@/db/schema'
import { toast } from 'sonner'
import { insertClient } from '@/actions/client-actions'
import { AccessType, clientFormSchema, ClientFormValues, ContactType } from '@/validators/client-validator'
import { validateEmail, validatePhone } from '@/actions/contacts-actions'
import { validateUsername } from '@/actions/accesses-actions'

export function CreateClientForm({
  providers,
  localities
}: {
  providers: Provider[],
  localities: Locality[]
}
) {
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(false)
  const [isCreateAccessModalOpen, setIsCreateAccessModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([])
  const [accesses, setAccesses] = useState<AccessType[]>([])

  const getContactSchema = (editingIndex: number | null) => {
    return clientFormSchema.shape.contacts.unwrap().element.extend({
      email: z.string().email({ message: "El email no es válido." }).max(30, { message: "El email debe contener como máximo 30 caracteres." })
        .refine(
          (email) => !contacts.some((c, i) => i !== editingIndex && c.email === email),
          { message: "El correo ya ha sido cargado." }
        ).refine(
          async (email) => await validateEmail(email),
          { message: "El correo ya está registrado en el sistema" }
        ),

      phone: z.string().min(11, { message: "El número no es válido." }).max(14, { message: "El número no es válido." }).optional()
        .refine(
          (phone) => !contacts.some((c, i) => i !== editingIndex && c.phone !== undefined && c.phone === phone),
          { message: "El número de teléfono ya está en uso." }
        )
        .refine(
          async (phone) => await validatePhone(phone),
          { message: "El teléfono ya está registrado en el sistema" }
        ),
    });
  };

  const getAccessSchema = (editingIndex: number | null) => {
    return clientFormSchema.shape.accesses.unwrap().element.superRefine(async (data, ctx) => {
      const { provider, username } = data;
      const isDuplicate = accesses.some((access, i) =>
        i !== editingIndex &&
        access.provider.id === provider.id &&
        access.username === username
      );

      if (isDuplicate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El usuario o email ya está en uso para el proveedor seleccionado.",
          path: ["username"],
        });
      }

      const alreadyRegistered = await validateUsername(username, parseInt(provider.id,10))
      console.log(alreadyRegistered); 

      if (!alreadyRegistered) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El usuario o email ya está registrado en el sistema para el proveedor seleccionado.",
          path: ["username"],
        });
      }
    });
  };

  const onSubmit: SubmitHandler<ClientFormValues> = () => {
    setIsConfirmationModalOpen(true)
  }

  const addContact = (contact: ContactType) => {
    setContacts([...contacts, contact])
    setIsCreateContactModalOpen(false)
  }
  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const editContact = (index: number, updatedContact: ContactType) => {
    setContacts(contacts.map((contact, i) => (i === index ? updatedContact : contact)));
  };

  const addAccess = (access: AccessType) => {
    setAccesses([...accesses, access])
    setIsCreateAccessModalOpen(false)
  }
  const removeAccess = (index: number) => {
    setAccesses(accesses.filter((_, i) => i !== index))
  }

  const editAccess = (index: number, updatedAccess: AccessType) => {
    setAccesses(accesses.map((access, i) => (i === index ? updatedAccess : access)));
  };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      contacts: [],
      accesses: []
    }
  })

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const client = { ...form.getValues(), contacts, accesses }
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await insertClient(client);
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
        loading: 'Registrando cliente',
        success: 'Cliente registrado satisfactoriamente',
        error: 'No se pudo registrar el cliente correctamente.'
      }
    )
  }


  return (
    <div className="bg-gradient-to-b from-gray-50 dark:from-gray-900 to-gray-100/50 dark:to-gray-800 p-4 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold text-2xl"><User />Registro de Cliente</CardTitle>
          <CardDescription>
            Complete el formulario para registrar un nuevo cliente. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre del cliente" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamaño <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name='size'>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tamaño" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: HACER DINÁMICO */}
                        <SelectItem value="Chico">Chico</SelectItem>
                        <SelectItem value="Medio">Medio</SelectItem>
                        <SelectItem value="Grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locality.id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      const selectedLocality = localities.find((locality) => locality.id.toString() === value);
                      if (selectedLocality) {
                        form.setValue("locality.name", selectedLocality.name);
                      }
                    }} defaultValue={field.value} name='locality'>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la localidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          localities.map((locality) => (
                            <SelectItem key={locality.name} value={locality.id.toString()}>{locality.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex items-center gap-5">
                  <span className='peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'>Contactos</span>
                  <Button
                    aria-labelledby="button-label"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateContactModalOpen(true);
                    }}
                    className='rounded-full w-8 h-8'
                  >
                    <Plus />
                  </Button>
                </div>
                <FormControl>
                  <>
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                      {contacts.map((contact, index) => (
                        <Contact key={contact.email} contact={contact} index={index} removeContact={removeContact} editContact={editContact} contactSchema={getContactSchema(index)} />
                      ))}
                    </div>
                    <ResponsiveDialog open={isCreateContactModalOpen} onOpenChange={setIsCreateContactModalOpen} title='Agregar contacto' description='Agregue los datos correspondientes al contacto.'>
                      <CreateContactForm onSave={addContact} contactSchema={getContactSchema(null)} />
                    </ResponsiveDialog>
                  </>
                </FormControl>
              </FormItem>

              <FormItem>
                <div className="flex items-center gap-8">
                  <span className='peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'>Accesos</span>
                  <Button
                    aria-labelledby="button-label"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateAccessModalOpen(true);
                    }}
                    className='rounded-full w-8 h-8'
                  >
                    <Plus />
                  </Button>
                </div>
                <FormControl>
                  <>
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                      {accesses.map((access, index) => (
                        <Access key={index} access={access} index={index} removeAccess={removeAccess} editAccess={editAccess} accessSchema={getAccessSchema(index)} providers={providers} />
                      ))}
                    </div>
                    <ResponsiveDialog open={isCreateAccessModalOpen} onOpenChange={setIsCreateAccessModalOpen} title='Agregar acceso' description='Agregue los datos correspondientes al acceso.'>
                      <CreateAccessForm onSave={addAccess} accessSchema={getAccessSchema(null)} providers={providers} />
                    </ResponsiveDialog>
                  </>
                </FormControl>
              </FormItem>


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
                        <SelectItem value="Activo">
                          <Badge variant="outline" className="bg-green-500">Activo</Badge>
                        </SelectItem>
                        <SelectItem value="Inactivo">
                          <Badge variant="outline">Inactivo</Badge>
                        </SelectItem>
                        <SelectItem value="Suspendido">
                          <Badge variant="outline" className="bg-red-500">Suspendido</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end'>
                <Button
                  className="gap-2"
                  size="lg"
                  disabled={isSubmitting}
                  type='submit'>
                  {isSubmitting ? (
                    <div className='flex items-center gap-1'>
                      <Loader2 className='animate-spin' />
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
          </Form >
        </CardContent>
      </Card>
      <ResponsiveDialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen} title='Confirmar registro' description='Revise que los datos sean correctos y confirme el registro.' className='sm:max-w-[700px]'>
        <ConfirmationModal handleSubmit={handleFinalSubmit} contacts={contacts} form={form} accesses={accesses} />
      </ResponsiveDialog>
    </div>
  )
}
