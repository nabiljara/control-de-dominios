'use client'

import { useState } from 'react'
import { User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {  ClientInsert, ClientWithRelations, Locality } from '@/db/schema'
import { formatDate } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFormSchema, ClientFormValues } from '@/validators/client-validator'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { EditConfirmationModal } from './edit-confirmation-modal'
import { toast } from 'sonner'
import { updateClient } from '@/actions/client-actions'

interface EditableClientCardProps {
  client: Omit<ClientWithRelations, 'domains' | 'access' | 'contacts'>
  localities: Locality[]
}

export default function EditableClientCard({ client, localities }: EditableClientCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const form = useForm<Omit<ClientFormValues, "accesses" | "contacts">>({
    resolver: zodResolver(clientFormSchema.omit({
      accesses: true,
      contacts: true
    })),
    defaultValues: {
      name: client.name,
      status: client.status,
      size: client.size,
      locality: { id: client.localityId ? client.localityId.toString() : undefined, name: client.locality.name }
    },
  })  

  const onSubmit: SubmitHandler<ClientFormValues> = () => {
    setIsConfirmationModalOpen(true)
  }

  const handleFinalSubmit = async () => {
    const modifiedClient: ClientInsert = {
      name: form.getValues().name,
      status: form.getValues().status,
      size: form.getValues().size,
      localityId: parseInt(form.getValues().locality.id, 10),
      id: client.id
    }
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          setIsConfirmationModalOpen(false);
          setIsEditing(false)
          await updateClient(modifiedClient);
          resolve();
        } catch (error) {
          console.error(error)
          reject(error);
        }
      }),
      {
        loading: 'Editando cliente',
        success: 'Cliente editado satisfactoriamente',
        error: 'No se pudo editar el cliente correctamente.'
      }
    )
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <User className="w-8 h-8" />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      {isEditing ? (
                        <FormControl>
                          <Input {...field} placeholder="Ingrese el nombre del cliente" autoComplete="name" className="h-auto font-bold text-3xl" />
                        </FormControl>
                      ) : (
                        <CardTitle className="font-bold text-3xl">{client.name}</CardTitle>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>Editar</span>
                <Switch
                  checked={isEditing}
                  onCheckedChange={setIsEditing}
                  aria-label="Habilitar edición"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col items-start gap-3">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-muted-foreground text-sm">Estado:</FormLabel>
                      {isEditing ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={client.status === "Activo" ? "default" : "destructive"}>
                          {client.status}
                        </Badge>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-muted-foreground text-sm">Tamaño:</FormLabel>
                      {isEditing ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Chico">Chico</SelectItem>
                            <SelectItem value="Medio">Medio</SelectItem>
                            <SelectItem value="Grande">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{client.size}</span>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locality.id"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-muted-foreground text-sm">Localidad:</FormLabel>
                      {isEditing ? (
                        <>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedLocality = localities.find((locality) => locality.id.toString() === value);
                              if (selectedLocality) {
                                form.setValue("locality.name", selectedLocality.name);
                              }
                            }}
                            defaultValue={field.value} name='locality'>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione la localidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                localities.map((locality) => (
                                  <SelectItem key={locality.name} value={locality.id.toString()}>{locality.name}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </>
                      ) : (
                        <span>{client.locality.name}</span>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground text-sm">
                  Fecha de registro: {formatDate(client.createdAt)}
                </span>
                <span className="text-muted-foreground text-sm">
                  Fecha de última actualización: {formatDate(client.updatedAt)}
                </span>
                {isEditing && form.formState.isDirty && (
                  <div className="flex gap-2 mt-4">
                    <Button type="submit">Guardar</Button>
                    <Button variant="outline" onClick={() => {
                      form.reset()
                      setIsEditing(false)
                    }}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <ResponsiveDialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen} title='Confirmar edición del cliente' description='Revise si los datos modificados son correctos y confirme el cambio.' className='sm:max-w-[700px]'>
        <EditConfirmationModal handleSubmit={handleFinalSubmit} form={form} client={client} />
      </ResponsiveDialog>
    </>
  )
}