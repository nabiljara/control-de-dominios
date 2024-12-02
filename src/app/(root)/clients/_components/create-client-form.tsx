'use client'

import { useState } from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, User, Trash2, Save, Building, BarChart2, CheckCircle, Box, KeyRound, StickyNote, Pencil } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// const formSchema = z.object({
//   name: z.string().max(30, { message: "Name must be 30 characters or less" }),
//   size: z.enum(["Pequeño", "Mediano", "Grande"]),
//   contacts: z.array(z.object({
//     name: z.string().max(30, { message: "Contact name must be 30 characters or less" }),
//     email: z.string().email().max(50, { message: "Email must be 50 characters or less" }),
//     phone: z.string().min(10, { message: "Phone must be at least 10 characters" }).max(20, { message: "Phone must be 20 characters or less" }).optional(),
//     type: z.enum(["Tecnico", "Otro"])
//   })).optional(),
//   state: z.enum(["Activo", "Inactivo", "Suspendido"]).default("Activo"),
//   accesses: z.array(z.object({
//     provider: z.string(),
//     username: z.string().max(50, { message: "Username must be 50 characters or less" }),
//     password: z.string().max(30, { message: "Password must be 30 characters or less" }),
//     notes: z.string().optional()
//   })).optional()
// })

const formSchema = z.object({
  name: z.string().max(30, { message: "El nombre debe tener como máximo 30 caracteres" }).min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  contacts: z.array(z.object({
    name: z.string().max(30, { message: "Contact name must be 30 characters or less" }),
    email: z.string().email().max(50, { message: "Email must be 50 characters or less" }),
    phone: z.string().min(10, { message: "Phone must be at least 10 characters" }).max(20, { message: "Phone must be 20 characters or less" }).optional(),
    type: z.enum(["technical", "administrative", "financial"])
  })).optional(),
  size: z.enum(["small", "medium", "large"], { message: "El tamaño del cliente es requerido" }),
  state: z.enum(["active", "inactive", "suspended"], { message: "El estado del cliente es requerido" }),
  accesses: z.array(z.object({
    provider: z.string(),
    username: z.string().max(50, { message: "El usuario o email debe tener como máximo 50 caracteres" }).min(1, { message: "El usuario o email es requerido" }),
    password: z.string().max(30, { message: "La contraseña debe tener como máximo 50 caracteres" }).min(1, { message: "La contraseña es requerida" }),
    notes: z.string().optional()
  })).optional()
})


type FormValues = z.infer<typeof formSchema>

export default function ClientRegistrationForm() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [contacts, setContacts] = useState<ContactType[]>([])
  const [accesses, setAccesses] = useState<AccessType[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contacts: [],
      accesses: []
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsConfirmationModalOpen(true)
  }

  const addContact = (contact: ContactType) => {
    setContacts([...contacts, contact])
    setIsContactModalOpen(false)
  }
  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const addAccess = (access: AccessType) => {
    setAccesses([...accesses, access])
    setIsContactModalOpen(false)
  }
  const removeAccess = (index: number) => {
    setAccesses(accesses.filter((_, i) => i !== index))
  }

  const handleFinalSubmit = () => {
    const formDataWithContacts = { ...form.getValues(), contacts }
    console.log(formDataWithContacts)
    //TODO: Acá enviar los datos al backend
    setIsConfirmationModalOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-4xl mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente" {...field} />
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
              <FormLabel>Tamaño (*)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <FormLabel>Contactos</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-medium">
                        <User className="h-4 w-4" />
                        {contact.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {contact.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Contacto</DialogTitle>
                          </DialogHeader>
                          <ContactForm onSave={addContact} contact={contact}/>
                        </DialogContent>
                      </Dialog>
                      {/* <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider> */}
                      <TooltipProvider delayDuration={100}>
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar</p>
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar contacto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este contacto?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeContact(index)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">Agregar Contacto</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Contacto</DialogTitle>
                  </DialogHeader>
                  <ContactForm onSave={addContact} />
                </DialogContent>
              </Dialog>
            </div>
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Accesos</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {accesses.map((access, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-medium">
                        <Box className="h-4 w-4" />
                        {access.provider}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        {access.username}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <KeyRound className="h-4 w-4" />
                        {access.password}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <StickyNote className="h-4 w-4" />
                        {access.notes}
                      </div>
                    </div>
                    <div>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar Acceso?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este acceso?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeAccess(index)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                  </CardContent>
                </Card>
              ))}
              <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">Agregar Acceso</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Acceso</DialogTitle>
                  </DialogHeader>
                  <AccessForm onSave={addAccess} />
                </DialogContent>
              </Dialog>
            </div>
          </FormControl>
        </FormItem>


        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <Button type="submit">
          <Save className="h-4 w-4" />
          Registrar Cliente
        </Button>

        <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Registro de Cliente</DialogTitle>
              <DialogDescription>
                Por favor, revise la información del cliente antes de confirmar el registro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">Nombre:</span> {form.getValues().name}
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span className="font-medium">Tamaño:</span> {form.getValues().size}
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Estado:</span> {form.getValues().state}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div>
                <h4 className="mb-2 font-medium">Contactos:</h4>
                {contacts.map((contact, index) => (
                  <Card key={index} className="bg-card mb-2">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                          <User className="h-4 w-4" />
                          {contact.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {contact.phone}
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            {contact.type}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsConfirmationModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleFinalSubmit}>Confirmar Registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form >
  )
}

type ContactType = NonNullable<FormValues['contacts']>[number];
type AccessType = NonNullable<FormValues['accesses']>[number];

function ContactForm({ onSave, contact }: { onSave: (contact: ContactType) => void; contact?: ContactType; }) {
  const contactSchema = formSchema.shape.contacts.unwrap().element
  const [isPending, setIsPending] = useState(false)

  console.log(contact)

  const form = useForm<ContactType>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact? contact : {
      name: '',
      email: '',
      phone: '',
      type: 'technical'
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsPending(true)
    const isValid = await form.trigger()
    if (isValid) {
      const data = form.getValues()
      onSave(data)
      form.reset()
    }
    setIsPending(false)
  }


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Tipo (*)</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technical">Tecnico</SelectItem>
                  <SelectItem value="administrative">Administrativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Contacto'}
        </Button>
      </form>
    </Form>
  )
}

function AccessForm({ onSave }: { onSave: (access: AccessType) => void }) {
  const accessSchema = formSchema.shape.accesses.unwrap().element
  const [isPending, setIsPending] = useState(false)
  const [formData, setFormData] = useState<AccessType>({
    provider: '',
    username: '',
    password: '',
    notes: ''
  })

  const form = useForm<AccessType>({
    resolver: zodResolver(accessSchema),
    defaultValues: formData
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsPending(true)
    const isValid = await form.trigger()
    if (isValid) {
      const data = form.getValues()
      onSave(data)
      form.reset()
    }
    setIsPending(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor *</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el proveedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Proveedor1">Proveedor 1</SelectItem>
                  <SelectItem value="Proveedor2">Proveedor 2</SelectItem>
                  <SelectItem value="Proveedor3">Proveedor 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario o email *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña *</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar Acceso</Button>
      </form>
    </Form>
  )
}