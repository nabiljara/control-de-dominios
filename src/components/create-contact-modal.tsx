'use client'
import React, { useState, cloneElement, useEffect } from "react";
import { useForm, } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { contactFormSchema as defaultContactFormSchema, ContactFormValues } from '@/validators/client-validator'
import { Badge } from '@/components/ui/badge'
import { contactStatus, contactTypes, statusConfig } from '@/constants'
import { Client, Contact } from '@/db/schema'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { NewContactConfirmationModal } from '@/app/(root)/domains/create/_components/new-contact-confirmation-modal'
import { createContact, validateContact } from '@/actions/contacts-actions'
import { toast } from 'sonner'
import { Contact2, Loader2 } from "lucide-react";


export function CreateContactModal({
  contactFormSchema,
  contacts,
  setContacts,
  clients,
  children,
  client,
  notification,
  pathToRevalidate,
  command,
  contact,
  isOpen,
  setIsOpen
}: {
  contactFormSchema?: z.Schema;
  contacts?: ContactFormValues[]; //Indica que trata al registro como un contacto temporal
  setContacts?: React.Dispatch<React.SetStateAction<ContactFormValues[]>>;
  clients?: Client[];
  children?: React.ReactElement
  client?: { id: number | undefined; name: string | undefined; },
  notification?: React.Dispatch<React.SetStateAction<boolean>>;
  pathToRevalidate?: string;
  command?: boolean
  contact?: Contact
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>; //Permite controlar el estado de abierto y cerrado desde afuera
  isOpen?: boolean
}) {
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(isOpen ?? false)
  const [isNewContactConfirmationModalOpen, setIsNewContactConfirmationModalOpen] = useState(false)
  const [isEditContactConfirmationModalOpen, setIsEditContactConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedClientName, setSelectedClientName] = useState<undefined | string>(undefined);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema ?? defaultContactFormSchema),
    defaultValues: {
      clientId: client ? client.id : undefined,
      name: contact ? contact.name : '',
      email: contact ? contact.email : '',
      phone: contact?.phone ? contact.phone : undefined,
      type: contact ? contact.type : undefined,
      status: contact ? contact?.status : 'Activo'
    },
    mode: 'onSubmit'
  })

  const addContact = (contact: ContactFormValues) => { //Función para agregar el contacto temporal del nuevo cliente
    if (setContacts) {
      setContacts([...(contacts ?? []), contact])
    }
    setIsCreateContactModalOpen(false)
    form.reset({
      clientId: client ? client.id : undefined,
      name: '',
      email: '',
      phone: undefined,
      type: undefined,
      status: 'Activo'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => { //Primer submit para validar el formulario
    try {
      e.preventDefault(); //Previene que el formulario de cliente o dominio se valide también
      e.stopPropagation();
      setIsSubmitting(true)
      const isValid = await form.trigger() //ejecuto validación manual
      if (isValid) {
        const errorList = contact ?

          await validateContact(form.getValues('phone'), form.getValues('email'), contact.phone ? contact.phone : undefined, contact.email) // para Editar
          :
          await validateContact(form.getValues('phone'), form.getValues('email'), undefined, undefined); // Para un nuevo registro

        if (errorList.length > 0) {
          errorList.forEach((error) => {
            form.setError(error.field, {
              type: "manual",
              message: error.message,
            });
            toast.warning(error.message)
          });
        } else if (contacts) {
          addContact(form.getValues());
        } else if (contact) {
          setIsEditContactConfirmationModalOpen(true);
        } else {
          setIsNewContactConfirmationModalOpen(true);
          setIsCreateContactModalOpen(false)
        }
      }
      setIsSubmitting(false)
    } catch (error) {
      toast.error('No se pudo validar el contacto correctamente.')
      console.log(error);
    }
  }

  const handleNewDBContactSubmit = () => { //submit para subir contacto a base de datos
    setIsSubmitting(true)
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await createContact(form.getValues(), pathToRevalidate)
          resolve();
          if (notification) {
            notification(true);
          }
          setIsNewContactConfirmationModalOpen(false)
          setIsCreateContactModalOpen(false)
          setSelectedClientName('')
          form.reset({
            clientId: client ? client.id : undefined,
            name: '',
            email: '',
            phone: undefined,
            type: undefined,
            status: 'Activo'
          })
        } catch (error) {
          console.error(error)
          reject(error)
          setIsCreateContactModalOpen(true)
          setIsNewContactConfirmationModalOpen(false);
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

  useEffect(() => {
    if (command) {
      const down = (e: KeyboardEvent) => {
        if (e.key === "n" && (e.metaKey || e.altKey)) {
          e.preventDefault()
          setIsCreateContactModalOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }
  }, [command])

  return (
    <>
      {children && cloneElement(children, { onClick: () => setIsCreateContactModalOpen(true) })}
      <ResponsiveDialog
        open={isCreateContactModalOpen}
        onOpenChange={() => {
          setIsCreateContactModalOpen(false)
          if (setIsOpen) {
            setIsOpen(false)
          }
        }}
        title="Agregar nuevo contacto."
        description="Agregue los datos correspondientes al contacto."
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el nombre del contacto" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ingrese el email del contacto"
                      autoComplete="email"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor='phone'
                  >
                    Teléfono
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      inputStyle={{
                        width: '100%',
                        height: '2.5rem',
                        borderRadius: '0.375rem',
                        borderColor:
                          'rgb(226 232 240)',
                        paddingLeft: '60px'
                      }}
                      buttonStyle={{
                        backgroundColor:
                          'rgb(255 255 255)',
                        borderColor:
                          'rgb(226 232 240)'
                      }}
                      country={'ar'}
                      preferredCountries={[
                        'ar',
                        'us',
                        'br'
                      ]}
                      countryCodeEditable={true}
                      value={field.value}
                      onChange={(value) => {
                        if (value.length <= 0) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      inputProps={{
                        name: 'phone',
                        id: 'phone',
                        placeholder:
                          'Escribe tu número',
                        autoComplete: "phone"
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          event.stopPropagation();
                        }
                      }}
                      autoFormat={false}
                      enableSearch={true}
                      disableSearchIcon={true}
                      searchPlaceholder={'Buscar'}
                      searchNotFound={
                        'No hay resultados'
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} name='type' value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        contactTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
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
                      {contactStatus.map((status) => (
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
            {clients &&
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(parseInt(value))
                        const clientName = clients.find((client) => client.id === parseInt(value))?.name;
                        if (clientName) {
                          setSelectedClientName(clientName);
                        }

                      }}
                      name="clientId"
                      defaultValue={field.value ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id ? client.id.toString() : ""}
                          >
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />}
            <div className='flex gap-2'>
              <Button
                type="button"
                variant='destructive'
                onClick={() => {
                  setIsCreateContactModalOpen(false)
                  if (setIsOpen) {
                    setIsOpen(false)
                  }
                }}
                disabled={isSubmitting}
                className='w-full'
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className='w-full'>
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="animate-spin" />
                    Agregando contacto
                  </div>
                ) : (
                  <>
                    <Contact2 className="w-5 h-5" />
                    Agregar contacto
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>

      {/* CONFIRMACIÓN NUEVO CONTACTO */}
      <ResponsiveDialog
        open={isNewContactConfirmationModalOpen}
        onOpenChange={() => setIsNewContactConfirmationModalOpen(false)}
        title="Confirmar registro de nuevo contacto"
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[420px]"
      >
        <NewContactConfirmationModal
          setIsCreateContactModalOpen={setIsCreateContactModalOpen}
          setIsConfirmationModalOpen={setIsNewContactConfirmationModalOpen}
          contact={form.getValues()}
          handleSubmit={contacts ? addContact : handleNewDBContactSubmit} //Envía una función u otra dependiendo si es temporal o no
          isSubmitting={isSubmitting}
          client={selectedClientName ? selectedClientName : client?.name}
        />
      </ResponsiveDialog>

      {/* EDICIÓN DE CONTACTO */}
      <ResponsiveDialog
        open={isEditContactConfirmationModalOpen}
        onOpenChange={() => setIsEditContactConfirmationModalOpen(false)}
        title="Confirmar la edición del contacto"
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[420px]"
      >
        <NewContactConfirmationModal
          setIsCreateContactModalOpen={setIsCreateContactModalOpen}
          setIsConfirmationModalOpen={setIsNewContactConfirmationModalOpen}
          contact={form.getValues()}
          handleSubmit={contacts ? addContact : handleNewDBContactSubmit} //Envía una función u otra dependiendo si es temporal o no
          isSubmitting={isSubmitting}
          client={selectedClientName ? selectedClientName : client?.name}
        />
      </ResponsiveDialog>
    </>

  )
}