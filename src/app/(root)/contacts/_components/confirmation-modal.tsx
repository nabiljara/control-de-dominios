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
                    <p className="text-sm font-medium leading-none">
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

          <Card>
            <CardContent className="pt-6">
              <CardTitle className="mb-2">Dominios afectados</CardTitle>
              <CardDescription className="mb-4">
                Los siguientes dominios se verán afectados por los cambios
                realizados:
              </CardDescription>
              <ul className="space-y-1">
                {domains.map((domain, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-sm">{domain.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

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
