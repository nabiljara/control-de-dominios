"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { ConfirmationModal } from "../_components/confirmation-modal"
import { DomainTable } from "../_components/domains-table"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "@/components/ui/switch"
import { getDomains, getDomainsByContact } from "@/actions/domains-actions"
import { getContact, updateContact } from "@/actions/contacts-actions"
import { toast } from "sonner"
import { getClients } from "@/actions/client-actions"
import { Client } from "@/db/schema"
import { ContactType, contactSchema } from "@/validators/contacts-validator"

export type Domain = {
  id: number
  name: string
  status: "Activo" | "Inactivo" | "Suspendido"
  createdAt: string
  updatedAt: string
  clientId: number
  providerId: number
  contactId: number
  providerRegistrationDate: string
  expirationDate: string
  client: {
    name: string
  }
  provider: {
    name: string
  }
}
export default function ContactDetailsPage({
  params
}: {
  params: { id: number }
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [contact, setContact] = useState<ContactType | undefined>(undefined)
  const [domains, setDomains] = useState<Domain[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [editedContact, setEditedContact] = useState<ContactType | undefined>(
    undefined
  )
  const [hasChanges, setHasChanges] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError
  } = useForm<ContactType>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fecthDomains = async () => {
    try {
      const data = await getDomainsByContact(params.id)
      setDomains(data)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        toast.error("Error al obtener los dominios", { description: e.message })
      }
    }
  }
  const fetchContact = async () => {
    try {
      const con = await getContact(params.id)
      setContact(con)
      setEditedContact(con)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        toast.error("Error al obtener el contacto", { description: e.message })
      }
    }
  }
  const fetchClients = async () => {
    try {
      const cli = await getClients()
      setClients(cli)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        toast.error("Error al obtener los clientes", { description: e.message })
      }
    }
  }
  useEffect(() => {
    fetchContact()
    fecthDomains()
    fetchClients()
  }, [])

  useEffect(() => {
    if (contact) {
      reset(contact)
    }
  }, [contact, reset])

  if (!contact) return <div>Cargando...</div>

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ContactType
  ) => {
    if (editedContact) {
      setValue(field, e.target.value)
      setEditedContact({ ...editedContact, [e.target.name]: e.target.value })
      setHasChanges(true)
    }
  }
  const handleChangeSelect = (value: string, field: keyof ContactType) => {
    if (editedContact) {
      if (field === "clientId") {
        const selectedClient = clients.find(
          (client) => client.id?.toString() === value
        )

        setEditedContact({
          ...editedContact,
          clientId:
            selectedClient && selectedClient.id ? selectedClient.id : null,
          client:
            selectedClient && selectedClient.id !== undefined
              ? { id: selectedClient.id, name: selectedClient.name ?? null }
              : null
        })
      } else {
        setEditedContact({ ...editedContact, [field]: value })
      }
      setValue(field, value)
      setHasChanges(true)
    }
  }
  const handleApply = async (data: ContactType) => {
    if (Object.keys(errors).length === 0) {
      setIsModalOpen(true)
    } else {
      console.log("Errores en el formulario:", errors)
    }
  }
  const applyChanges = async () => {
    if (editedContact) {
      const toastId = toast.loading("Guardando cambios...")
      try {
        const response = await updateContact(editedContact)
        const updatedContact = await getContact(response.id)
        setEditedContact(updatedContact)
        setIsEditing(false)
        setHasChanges(false)
        toast.success("Cambios guardados exitosamente", { id: toastId })
      } catch (e) {
        if (e instanceof Error) {
          if (e.message.includes("email")) {
            setError("email", { type: "server", message: e.message })
          }
          if (e.message.includes("teléfono")) {
            setError("phone", { type: "server", message: e.message })
          }
          toast.error("Error al guardar los datos", {
            description: e.message,
            id: toastId
          })
        }
      }
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleApply)}>
        <Card className="mx-2 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Información del Contacto</CardTitle>
            <div className="flex items-center space-x-2">
              <span>Habilitar edición</span>
              <Switch checked={isEditing} onCheckedChange={setIsEditing} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    {...register("name")}
                    defaultValue={contact.name}
                    onChange={(e) => handleChange(e, "name")}
                  />
                ) : (
                  <span
                    id="nameValue"
                    className="block w-full cursor-default rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    {contact.name}
                  </span>
                )}
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    onChange={(e) => handleChange(e, "email")}
                    defaultValue={contact.email}
                  />
                ) : (
                  <span
                    id="emailValue"
                    className="block w-full cursor-default rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    {contact.email}
                  </span>
                )}
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    {...register("phone")}
                    onChange={(e) => handleChange(e, "phone")}
                    defaultValue={contact.phone?.toString()}
                  />
                ) : (
                  <span
                    id="phoneValue"
                    className="block w-full cursor-default rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    {contact.phone}
                  </span>
                )}
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) => handleChangeSelect(value, "type")}
                    defaultValue={contact.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnico">Técnico</SelectItem>
                      <SelectItem value="Administrativo">
                        Administrativo
                      </SelectItem>
                      <SelectItem value="Financiero">Financiero</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    id="typeValue"
                    className="block w-full cursor-default rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    {contact.type}
                  </span>
                )}
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) =>
                      handleChangeSelect(value, "status")
                    }
                    defaultValue={contact.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    id="statusValue"
                    className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    {contact.status || "\u00A0"}
                  </span>
                )}
                {errors.status && (
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) =>
                      handleChangeSelect(value, "clientId")
                    }
                    defaultValue={contact.client?.id.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
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
                ) : (
                  <span
                    id="clientValue"
                    className="block min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    {contact.client?.name || "\u00A0"}
                  </span>
                )}
                {errors.clientId && (
                  <p className="text-sm text-red-500">
                    {errors.clientId.message}
                  </p>
                )}
              </div>
            </div>
            <CardContent className="flex justify-end space-x-4">
              {isEditing && (
                <>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={!hasChanges}
                  >
                    Guardar
                  </Button>
                  <Button type="button" variant="outline" onClick={toggleEdit}>
                    Cancelar
                  </Button>
                </>
              )}
            </CardContent>
            <Card>
              <CardHeader>
                <CardTitle>Dominios Asociados</CardTitle>
              </CardHeader>
              <CardContent>
                <DomainTable domains={domains} />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        domains={domains}
        onConfirm={applyChanges}
        updatedContact={editedContact}
      />
    </>
  )
}
