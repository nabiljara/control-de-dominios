'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
// import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, PlusCircle, Loader2, Eye, User, Users, Building } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import SearchableSelect from '@/components/searchable-select'

// Tipos para manejar la información extendida
type ClienteInfo = {
  id: string
  nombre: string
  email: string
  estado: 'activo' | 'inactivo'
  tamaño: 'chico' | 'medio' | 'grande'
}

type ContactoInfo = {
  id: string
  nombre: string
  email: string
}

type AccesoInfo = {
  id: string
  cliente: string
  proveedor: string
}

// Esquema Zod para validación del formulario
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  cliente: z.string().min(1, { message: "Debe seleccionar un cliente." }),
  proveedor: z.string().min(1, { message: "Debe seleccionar un proveedor." }),
  tieneAcceso: z.boolean(),
  acceso: z.string().optional(),
  fechaRegistro: z.date({ required_error: "La fecha de registro es requerida." }),
  fechaVencimiento: z.date({ required_error: "La fecha de vencimiento es requerida." }),
  estado: z.enum(["activo", "inactivo", "vencido"]),
  contactoCliente: z.boolean(),
  contacto: z.string().optional(),
}).refine((data) => {
  if (data.tieneAcceso && !data.acceso) {
    return false;
  }
  if (data.contactoCliente && !data.contacto) {
    return false;
  }
  return true;
}, {
  message: "Campos requeridos faltantes",
  path: ["acceso", "contacto"],
});

// Función simulada para obtener datos
const fetchData = async (type: string): Promise<ClienteInfo[] | ContactoInfo[] | AccesoInfo[] | string[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  switch (type) {
    case 'clientes':
      return [
        { id: '1', nombre: 'Cliente 1', email: 'cliente1@example.com', estado: 'activo', tamaño: 'chico' },
        { id: '2', nombre: 'Cliente 2', email: 'cliente2@example.com', estado: 'inactivo', tamaño: 'medio' },
        { id: '3', nombre: 'Cliente 3', email: 'cliente3@example.com', estado: 'activo', tamaño: 'grande' },
      ] as ClienteInfo[]
    case 'contactos':
      return [
        { id: '1', nombre: 'Contacto 1', email: 'contacto1@example.com' },
        { id: '2', nombre: 'Contacto 2', email: 'contacto2@example.com' },
        { id: '3', nombre: 'Contacto 3', email: 'contacto3@example.com' },
      ] as ContactoInfo[]
    case 'accesos':
      return [
        { id: '1', cliente: 'Cliente 1', proveedor: 'Proveedor 1' },
        { id: '2', cliente: 'Cliente 2', proveedor: 'Proveedor 2' },
        { id: '3', cliente: 'Cliente 3', proveedor: 'Proveedor 3' },
      ] as AccesoInfo[]
    case 'proveedores':
      return ["Proveedor 1", "Proveedor 2", "Proveedor 3", "Proveedor 4", "Proveedor 5"]
    default:
      return []
  }
}

export default function CreateDomainForm() {
  const [clientes, setClientes] = useState<ClienteInfo[]>([])
  const [proveedores, setProveedores] = useState<string[]>([])
  const [accesos, setAccesos] = useState<AccesoInfo[]>([])
  const [contactos, setContactos] = useState<ContactoInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      cliente: "",
      proveedor: "",
      tieneAcceso: false,
      acceso: undefined,
      fechaRegistro: new Date(),
      fechaVencimiento: new Date(),
      estado: "activo",
      contactoCliente: true,
      contacto: undefined,
    },
  })

  useEffect(() => {
    const loadInitialData = async () => {
      setClientes(await fetchData('clientes') as ClienteInfo[])
      setProveedores(await fetchData('proveedores') as string[])
      setAccesos(await fetchData('accesos') as AccesoInfo[])
      setContactos(await fetchData('contactos') as ContactoInfo[])
    }
    loadInitialData()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    // Simular envío al servidor
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log(values)
    // toast({
    //   title: "Formulario enviado",
    //   description: "Los datos del dominio han sido guardados exitosamente.",
    // })
  }

  // Componente para el ícono de tamaño del cliente
  const TamañoIcon = ({ tamaño }: { tamaño: 'chico' | 'medio' | 'grande' }) => {
    switch (tamaño) {
      case 'chico':
        return <User className="h-4 w-4" />
      case 'medio':
        return <Users className="h-4 w-4" />
      case 'grande':
        return <Building className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Formulario de Dominio</CardTitle>
        <CardDescription>Ingrese los detalles del dominio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Dominio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre del dominio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <SearchableSelect/>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {proveedores.length > 0 ? proveedores.map((proveedor) => (
                          <SelectItem key={proveedor} value={proveedor}>{proveedor}</SelectItem>
                        )) : <SelectItem value='asasd'>Cargando proveedores...</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
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
                        <SelectItem value="activo">
                          <Badge variant="default" className="bg-green-500">Activo</Badge>
                        </SelectItem>
                        <SelectItem value="inactivo">
                          <Badge variant="secondary">Inactivo</Badge>
                        </SelectItem>
                        <SelectItem value="vencido">
                          <Badge variant="destructive">Vencido</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fechaRegistro"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Registro</FormLabel>
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
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaVencimiento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Vencimiento</FormLabel>
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
            </div>

            <Separator />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="tieneAcceso"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Tiene acceso</FormLabel>
                      <FormDescription>
                        Activar si el dominio tiene acceso asociado
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

              {form.watch("tieneAcceso") && (
                <FormField
                  control={form.control}
                  name="acceso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acceso</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value
                                ? accesos.find((acceso) => acceso.id === field.value)?.cliente || "Acceso no encontrado"
                                : "Seleccione un acceso"}
                              <PlusCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar acceso..." />
                            <CommandEmpty>No se encontraron accesos.</CommandEmpty>
                            <CommandGroup>
                              {accesos.length > 0 ? (
                                accesos.map((acceso) => (
                                  <CommandItem
                                    value={acceso.id}
                                    key={acceso.id}
                                    onSelect={() => {
                                      form.setValue("acceso", acceso.id)
                                    }}
                                  >
                                    <div>
                                      <p>{acceso.cliente}</p>
                                      <p className="text-sm text-muted-foreground">{acceso.proveedor}</p>
                                    </div>
                                  </CommandItem>
                                ))
                              ) : (
                                <CommandItem>Cargando accesos...</CommandItem>
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="contactoCliente"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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

              {form.watch("contactoCliente") && (
                <FormField
                  control={form.control}
                  name="contacto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value
                                ? contactos.find((contacto) => contacto.id === field.value)?.nombre || "Contacto no encontrado"
                                : "Seleccione un contacto"}
                              <PlusCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar contacto..." />
                            <CommandEmpty>No se encontraron contactos.</CommandEmpty>
                            <CommandGroup>
                              {contactos.length > 0 ? (
                                contactos.map((contacto) => (
                                  <CommandItem
                                    value={contacto.id}
                                    key={contacto.id}
                                    onSelect={() => {
                                      form.setValue("contacto", contacto.id)
                                    }}
                                  >
                                    <div>
                                      <p>{contacto.nombre}</p>
                                      <p className="text-sm text-muted-foreground">{contacto.email}</p>
                                    </div>
                                  </CommandItem>
                                ))
                              ) : (
                                <CommandItem>Cargando contactos...</CommandItem>
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Dominio
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}