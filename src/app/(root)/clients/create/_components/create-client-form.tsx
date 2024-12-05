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
import { User, Plus, UserPlus } from "lucide-react"
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Contact } from '@/app/(root)/clients/create/_components/contacts/contact'
import { CreateContactForm } from '@/app/(root)/clients/create/_components/contacts/create-contact-form'
import { Access } from '@/app/(root)/clients/create/_components/accesses/access'
import { CreateAccessForm } from '@/app/(root)/clients/create/_components/accesses/create-access-form'
import { ConfirmationModal } from '@/app/(root)/clients/create/_components/confirmation-modal'
import { Provider } from '@/actions/provider-actions'

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

export const formSchema = z.object({
  name: z.string().max(50, { message: "El nombre debe tener como máximo 50 caracteres." }).min(2, { message: "El nombre debe tener al menos 2 caracteres." }).refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),
  contacts: z.array(z.object({
    name: z.string().max(50, { message: "El nombre debe tener como máximo 50 caracteres." }).min(2, { message: "El nombre debe tener al menos 2 caracteres." }).refine((value) => nameRegex.test(value), { message: "El nombre solo puede contener letras." }),
    email: z.string().email({ message: "El email no es válido." }).max(50, { message: "El email debe contener como máximo 50 caracteres." }),
    phone: z.string().max(11, { message: "El número no es válido." }).optional(),
    type: z.enum(["Técnico", "Administrativo"], { message: "El tipo del cliente es requerido." })
  })).optional(),
  size: z.enum(["small", "medium", "large"], { message: "El tamaño del cliente es requerido." }),
  state: z.enum(["active", "inactive", "suspended"], { message: "El estado del cliente es requerido." }),
  accesses: z.array(z.object({
    provider: z.object({
      id: z.string({ message: "El proveedor es requerido." }),
      name:z.string({ message: "El proveedor es requerido." }),
    }),
    username: z.string().max(50, { message: "El usuario o email debe tener como máximo 50 caracteres." }).min(1, { message: "El usuario o email es requerido." }),
    password: z.string().max(30, { message: "La contraseña debe tener como máximo 50 caracteres." }).min(1, { message: "La contraseña es requerida." }),
    notes: z.string().max(100, { message: "Máximo 100 caracteres" }).optional()
  })).optional()
})

export function CreateClientForm({
  providers
}: {
  providers: Provider[]
}
) {
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(false)
  const [isCreateAccessModalOpen, setIsCreateAccessModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [contacts, setContacts] = useState<ContactType[]>([])
  const [accesses, setAccesses] = useState<AccessType[]>([])

  const getContactSchema = (editingIndex: number | null) => {
    return formSchema.shape.contacts.unwrap().element.extend({
      email: z.string().email({ message: "El email no es válido." }).max(50, { message: "El email debe contener como máximo 50 caracteres." }).refine(
        (email) => !contacts.some((c, i) => i !== editingIndex && c.email === email),
        { message: "El correo ya está en uso." }
      ),
      phone: z.string().max(11, { message: "El número no es válido." }).optional().refine(
        (phone) => !contacts.some((c, i) => i !== editingIndex && c.phone === phone),
        { message: "El número de teléfono ya está en uso." }
      ),
    });
  };

  const getAccessSchema = (editingIndex: number | null) => {
    return formSchema.shape.accesses.unwrap().element.superRefine((data, ctx) => {
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
    });
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
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

  const handleFinalSubmit = () => {
    const formData = { ...form.getValues(), contacts, accesses }
    console.log(formData)
    //TODO: Acá enviar los datos al backend
    setIsConfirmationModalOpen(false)
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contacts: [],
      accesses: []
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold gap-2 flex items-center"><User />Registro de Cliente</CardTitle>
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
                        <SelectItem value="small">Pequeño</SelectItem>
                        <SelectItem value="medium">Mediano</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex items-center gap-5">
                  <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Contactos</span>
                  <Button
                    aria-labelledby="button-label"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateContactModalOpen(true);
                    }}
                    className='h-8 w-8 rounded-full'
                  >
                    <Plus />
                  </Button>
                </div>
                <FormControl>
                  <>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Accesos</span>
                  <Button
                    aria-labelledby="button-label"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateAccessModalOpen(true);
                    }}
                    className='h-8 w-8 rounded-full'
                  >
                    <Plus />
                  </Button>
                </div>
                <FormControl>
                  <>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {accesses.map((access, index) => (
                        <Access key={index} access={access} index={index} removeAccess={removeAccess} editAccess={editAccess} accessSchema={getAccessSchema(index)} providers={providers} />
                      ))}
                    </div>
                    <ResponsiveDialog open={isCreateAccessModalOpen} onOpenChange={setIsCreateAccessModalOpen} title='Agregar acceso' description='Agregue los datos correspondientes al acceso.'>
                      <CreateAccessForm onSave={addAccess} accessSchema={getAccessSchema(null)} providers={providers}/>
                    </ResponsiveDialog>
                  </>
                </FormControl>
              </FormItem>


              <FormField
                control={form.control}
                name="state"
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
                        <SelectItem value="active">
                          <Badge variant="default" className="bg-green-500">Activo</Badge>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <Badge variant="secondary">Inactivo</Badge>
                        </SelectItem>
                        <SelectItem value="suspended">
                          <Badge variant="destructive">Suspendido</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end'>
                <Button className="gap-2" size="lg">
                  <UserPlus className="h-5 w-5" />
                  Registrar Cliente
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

export type FormValues = z.infer<typeof formSchema>
export type ContactType = NonNullable<FormValues['contacts']>[number];
export type AccessType = NonNullable<FormValues['accesses']>[number];
