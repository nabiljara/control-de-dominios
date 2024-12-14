import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card"
import { Mail, Phone, User, Activity, CheckCircle } from "lucide-react"
import { ContactType } from "@/validators/contacts-validator"
import { DomainWithRelations } from "@/db/schema"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ContactWithRelations } from "@/db/schema"
import {
  getContacts,
  getContactsByClient,
  getContactsWithoutClient
} from "@/actions/contacts-actions"
import { toast } from "sonner"
import { ContactPerDomain } from "../../../../../types/contact-types"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  domains: Omit<DomainWithRelations, "history" | "domainAccess" | "contact">[]
  onConfirm: (contactSelections: ContactPerDomain[]) => void //Pruebas con contactId en nulo, acomodar cuando definamos el contacto default(propio de kernel)
  updatedContact: Omit<ContactWithRelations, "domains"> | undefined
}

export function ConfirmationModal({
  isOpen,
  onClose,
  domains,
  onConfirm,
  updatedContact
}: ConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<
    Record<number, number | null>
  >({})

  const [contactsByDomain, setContactsByDomain] = useState<
    Record<number, Omit<ContactWithRelations, "domains">[]>
  >({})

  useEffect(() => {
    const fetchContacts = async () => {
      const result = await fetchContactsByDomain(domains)
      setContactsByDomain(result)
    }
    fetchContacts()
  }, [updatedContact, domains])

  const fetchContactsByDomain = async (
    domains: Omit<DomainWithRelations, "history" | "domainAccess" | "contact">[]
  ) => {
    try {
      const contactsByDomain = await Promise.all(
        domains.map(async (domain) => {
          const contacts = domain.clientId
            ? await getContactsByClient(domain.clientId)
            : await getContactsWithoutClient()
          return { domainId: domain.id, contacts }
        })
      )
      return contactsByDomain.reduce<
        Record<number, Omit<ContactWithRelations, "domains">[]>
      >((acc, curr) => {
        acc[curr.domainId] = curr.contacts
        return acc
      }, {})
    } catch (error) {
      console.error("Error al obtener contactos por dominio:", error)
      throw error
    }
  }

  const handleConfirm = async () => {
    const missingContacts = domains.some(
      (domain) => !selectedContacts[domain.id]
    )
    if (missingContacts) {
      toast.error("No se selecciono un nuevo contacto para cada dominio")
      return
    }
    //Error cuando no selecciona un nuevo contacto para c/u de los dominios
    //TODO: Mejorarlo para que cuando no se tenga tenga dominios asociados

    const contactSelections: ContactPerDomain[] = Object.entries(
      selectedContacts
    ).map(([domainId, contactId]) => ({
      domainId: Number(domainId),
      contactId: contactId as number
    }))
    setIsSubmitting(true)
    try {
      await onConfirm(contactSelections)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Información del Contacto
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="text-sm font-medium leading-none">
                      {updatedContact?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium leading-none">
                      {updatedContact?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium leading-none">
                      {updatedContact?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p
                      className={`text-sm font-medium leading-none ${
                        updatedContact?.status === "Inactivo"
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {updatedContact?.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium leading-none">
                      {updatedContact?.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="text-sm font-medium leading-none">
                      {updatedContact?.client?.name}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {updatedContact?.status === "Inactivo" ? (
            <Card>
              <CardContent className="pt-6">
                <CardTitle className="mb-2">Dominios afectados</CardTitle>
                <CardDescription className="mb-4">
                  Los siguientes dominios se verán afectados por la baja del
                  dominio, deberá seleccionar un nuevo contacto(del cliente del
                  dominio o individual) para cada uno.
                </CardDescription>
                {domains.length > 0 ? (
                  <ul className="space-y-4">
                    {domains.map((domain, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-sm font-medium">
                          {domain.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Select
                            onValueChange={(value) =>
                              setSelectedContacts((prev) => ({
                                ...prev,
                                [domain.id]: parseInt(value, 10)
                              }))
                            }
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Seleccione un contacto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <div className="px-2 text-sm font-semibold text-gray-500">
                                  Cliente {domain.client?.name}
                                </div>
                                {contactsByDomain[domain.id]
                                  ?.filter(
                                    (contact) => contact.clientId !== null
                                  )
                                  .map((contact) => (
                                    <SelectItem
                                      key={contact.id}
                                      value={contact.id.toString()}
                                    >
                                      {contact.name}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                              <div className="my-2 border-t border-gray-200" />
                              <SelectGroup>
                                <div className="px-2 text-sm font-semibold text-gray-500">
                                  Individuales
                                </div>
                                {contactsByDomain[domain.id]
                                  ?.filter(
                                    (contact) => contact.clientId === null
                                  )
                                  .map((contact) => (
                                    <SelectItem
                                      key={contact.id}
                                      value={contact.id.toString()}
                                    >
                                      {contact.name}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" asChild>
                            <a href="/contacts/new">Crear</a>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        No hay dominios asociados a este contacto.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <CardTitle className="mb-2">Dominios afectados</CardTitle>
                <CardDescription className="mb-4">
                  Los siguientes dominios se verán afectados por los cambios
                  realizados:
                </CardDescription>
                {domains.length > 0 ? (
                  <ul className="space-y-4">
                    {domains.map((domain, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-sm font-medium">
                          {domain.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        No hay dominios asociados a este contacto.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Aplicando..." : "Aplicar Cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
