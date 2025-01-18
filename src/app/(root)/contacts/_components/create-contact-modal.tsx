"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/high-res.css"
import { getClients } from "@/actions/client-actions"
import { Client, ClientWithRelations, ContactInsert } from "@/db/schema"
import { toast } from "sonner"
import { insertContact } from "@/actions/contacts-actions"
import { contactSchema } from "@/validators/contacts-validator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Contact } from "lucide-react"
import { useRouter } from "next/navigation"
import Plus from "@/components/plus"
//TODO: cambiarlo a el de schema
interface CreateContactModalProps {
  from: string
  client?: Omit<ClientWithRelations, "access" | "contacts">
  // domain?: Domain
  // onSuccess?: () => void
}
export function CreateContactModal({
  from,
  client
  // domain
  // onSuccess
}: CreateContactModalProps) {
  const [isPending, setIsPending] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const form = useForm<ContactInsert>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      clientId: from === "clients" ? client?.id : null,
      status: "Activo",
      type: undefined
    }
  })
  const [clients, setClients] = useState<Client[]>([])
  const fetchClients = async () => {
    try {
      const clients = await getClients()
      setClients(clients)
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Error al obtener clientes", { description: e.message })
      }
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const route = useRouter()
  const onSubmit = async (data: ContactInsert) => {
    setIsPending(true)
    try {
      await insertContact(data)
      form.reset()
      setIsPending(false)
      toast.success("Contacto ingresado correctamente")
      if (from === "contacts") {
        route.push("/contacts")
      } else if (from === "clients") {
        route.push("/clients/" + client?.id)
      }
      // else if (from === "domains") {
      //   route.push("/domains/" + domain?.id)
      // }
      setIsModalOpen(false)
    } catch (error) {
      setIsPending(false)
      if (error instanceof z.ZodError) {
        toast.error("Error al ingresar los datos ", {
          description: error.message
        })
      } else if (error instanceof Error) {
        toast.error("Error al registrar proveedor ", {
          description: error.message
        })
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="gap-3 px-2 lg:px-3 h-8"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative">
            <Contact />
            <Plus />
          </div>
          Nuevo contacto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Nuevo contacto{" "}
            {client ? (
              <>
                del cliente <span className="underline">{client.name}</span>
              </>
            ) : (
              ""
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Ingrese el nombre del contacto"
                      autoComplete="name"
                      {...field}
                    />
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
                      {...field}
                    />
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
                  <FormLabel htmlFor="phone">Teléfono</FormLabel>
                  <FormControl>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "2.5rem",
                        borderRadius: "0.375rem",
                        borderColor: "rgb(226 232 240)",
                        paddingLeft: "60px"
                      }}
                      buttonStyle={{
                        backgroundColor: "rgb(255 255 255)",
                        borderColor: "rgb(226 232 240)"
                      }}
                      country={"ar"}
                      preferredCountries={["ar", "us", "br"]}
                      countryCodeEditable={false}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value.toString())
                      }}
                      inputProps={{
                        name: "phone",

                        id: "phone",
                        placeholder: "Escribe tu número",
                        autoComplete: "phone"
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          event.stopPropagation()
                        }
                      }}
                      autoFormat={false}
                      enableSearch={true}
                      disableSearchIcon={true}
                      searchPlaceholder={"Buscar"}
                      searchNotFound={"No hay resultados"}
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
                  <FormLabel>
                    Tipo <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} name="type">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tecnico">Técnico</SelectItem>
                      <SelectItem value="Administrativo">
                        Administrativo
                      </SelectItem>
                      <SelectItem value="Financiero">Financiero</SelectItem>
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
                  <FormLabel>
                    Estado <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    name="status"
                    defaultValue={field.value || "Activo"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value, 10))
                    }}
                    name="clientId"
                    defaultValue={
                      from === "clients" ? client?.id.toString() : undefined
                    }
                    disabled={from === "clients" || from === "domains"}
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
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Agregando..." : "Agregar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
