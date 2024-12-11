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
import { Domain } from "../[id]/page"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  domains: Domain[]
  onConfirm: () => void
  updatedContact: ContactType | undefined
}

export function ConfirmationModal({
  isOpen,
  onClose,
  domains,
  onConfirm,
  updatedContact
}: ConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm()
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
                  dominio, deberá seleccionar un nuevo contacto para cada uno.
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
                          <Select>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Seleccione un contacto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="contacto1">
                                  contacto1
                                </SelectItem>
                                <SelectItem value="contacto2">
                                  contacto2
                                </SelectItem>
                                <SelectItem value="contacto3">
                                  contacto3
                                </SelectItem>
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
