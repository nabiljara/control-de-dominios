"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, BarChart2, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ClientFormValues } from "@/validators/client-validator"
import { UseFormReturn } from "react-hook-form"
import { Badge } from '@/components/ui/badge'
import { Client } from '@/db/schema'

export function ConfirmationClientModal({
  handleSubmit,
  form,
  client
}: {
  handleSubmit: () => void
  form: UseFormReturn<ClientFormValues>
  client: Client
}) {
  const { name, size, status, locality } = form.getValues()
  const nameState = form.getFieldState('name')
  const sizeState = form.getFieldState('size')
  const statusState = form.getFieldState('status')
  const localityState = form.getFieldState('locality.id')

  const renderField = (
    icon: React.ReactNode,
    label: string,
    oldValue: string,
    newValue: string,
    isDirty: boolean
  ) => {
    if (!isDirty) return null;
    return (
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
          <span className="text-muted-foreground text-sm">{oldValue}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-primary text-sm">{newValue}</span>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-0">
        {renderField(
          <User className="w-4 h-4 text-primary" />,
          "Nombre",
          client.name,
          name,
          nameState.isDirty
        )}
        {renderField(
          <BarChart2 className="w-4 h-4 text-primary" />,
          "Tamaño",
          client.size,
          size,
          sizeState.isDirty
        )}
        {statusState.isDirty && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="font-medium">Estado</span>
            </div>
            <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
              <Badge variant="outline" className={client.status === 'Activo' ? 'bg-green-500/10 text-green-500' : ''}>
                {client.status}
              </Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge
                variant="outline"
                className={status === 'Activo' ? 'bg-green-500/10 text-green-500' : ''}
              >
                {status}
              </Badge>
            </div>
          </div>
        )}
        {renderField(
          <BarChart2 className="w-4 h-4 text-primary" />,
          "Localidad",
          client.localities.name,
          locality.name,
          localityState.isDirty
        )}
        <div className="flex justify-end pt-4">
          <Button onClick={() => {
            handleSubmit();
            form.reset();
          }} className="w-full sm:w-auto">
            Guardar cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

