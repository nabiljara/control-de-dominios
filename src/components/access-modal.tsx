'use client'
import React, { cloneElement, useState } from 'react'
import { useForm, } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccessFormValues, accessFormSchema as defaultAccessSchema } from '@/validators/zod-schemas'
import { Textarea } from '@/components/ui/textarea'
import { PasswordInput } from '@/components/password-input'
import { AccessWithRelations } from '@/db/schema'
import { createAccess, updateAccess, validateAccess } from '@/actions/accesses-actions'
import { toast } from 'sonner'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { KeySquare, Loader2 } from 'lucide-react'
import { NewAccessConfirmationModal } from '@/components/new-access-confirmation-modal'
import useSWR from 'swr'
import { getProviders } from '@/actions/provider-actions'
import { EditAccessConfirmationModal } from './edit-access-confirmation-modal'

export function AccessModal({
  accessFormSchema,
  setAccess,
  children,
  notification,
  accessArray,
  provider,
  client,
  pathToRevalidate,
  access,
}: {
  accessFormSchema?: z.Schema;
  accessArray?: AccessFormValues[]; //Indica que trata al registro como un acceso temporal
  setAccess?: React.Dispatch<React.SetStateAction<AccessFormValues[]>>;
  children?: React.ReactElement
  provider?: { id: number | undefined; name: string; };
  client?: { id: number | undefined; name: string; },
  notification?: React.Dispatch<React.SetStateAction<boolean>>;
  pathToRevalidate?: string;
  access?: Omit<AccessWithRelations, "client">
}) {

  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false)
  const [isNewAccessConfirmationModalOpen, setIsNewAccessConfirmationModalOpen] = useState(false)
  const [isEditAccessConfirmationModalOpen, setIsEditAccessConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProviderName, setSelectedProviderName] = useState<undefined | string>(undefined);
  const { data: providers, error } = useSWR("providers", getProviders);

  const form = useForm<AccessFormValues>({
    resolver: zodResolver(accessFormSchema ?? defaultAccessSchema),
    defaultValues: {
      id: access?.id ?? undefined,
      provider: { id: provider?.id?.toString() ?? '', name: provider ? provider.name : '' },
      client: { id: client?.id ? client.id.toString() : '', name: client ? client.name : '' },
      username: access?.username ?? '',
      password: access?.password ?? '',
      notes: access?.notes ?? '',
    },
    mode: 'onSubmit'
  })

  if (provider && !access) {
    form.setValue('provider', { id: provider?.id ? provider.id.toString() : '', name: provider.name }) // Se setea manualmente por si cambia el provider en createDomain
  }

  const addAccess = (access: AccessFormValues) => { //Función para agregar el acceso temporal del nuevo cliente
    if (setAccess) {
      setAccess([...(accessArray ?? []), access])
    }
    setIsAccessModalOpen(false)
    form.reset({
      id: access?.id ?? undefined,
      username: '',
      password: '',
      notes: '',
      client: { id: client?.id ? client.id.toString() : '', name: client ? client.name : '' },
      provider: { id: provider?.id?.toString() ?? undefined, name: provider ? provider.name : '' },
    })

  }

  const handleSubmit = async (e: React.FormEvent) => { //Primer submit para validar el formulario
    try {
      e.preventDefault(); //Previene que el formulario de cliente o dominio se valide también
      e.stopPropagation();
      setIsSubmitting(true)
      const isValid = await form.trigger() //ejecuto validación manual
      if (isValid) {
        const errorList = access ?
          await validateAccess(form.getValues('username'), parseInt(form.getValues('provider.id')), access?.username, access?.providerId)
          :
          await validateAccess(form.getValues('username'), parseInt(form.getValues('provider.id')), undefined, undefined); // valido el acceso en la base de datos manualmente

        if (errorList.length > 0) {
          errorList.forEach((error) => {
            form.setError(error.field, {
              type: "manual",
              message: error.message,
            });
          });
          setIsSubmitting(false)
          return
        }

        if (accessArray) {
          addAccess(form.getValues());
        } else if (access) {
          setIsEditAccessConfirmationModalOpen(true);
        } else {
          setIsNewAccessConfirmationModalOpen(true);
        }
        setIsAccessModalOpen(false)
      }
      setIsSubmitting(false)
    } catch (error) {
      toast.error('No se pudo validar el acceso correctamente.')
      console.log(error);
    }
  }

  const handleNewDBAccessSubmit = () => { //submit para subir el acceso a base de datos
    setIsSubmitting(true)
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await createAccess(form.getValues(), pathToRevalidate)
          resolve();
          if (notification) {
            notification(true);
          }
          setIsNewAccessConfirmationModalOpen(false)
          setIsAccessModalOpen(false)
          setSelectedProviderName('')
          form.reset({
            id: access?.id ?? undefined,
            username: '',
            password: '',
            notes: '',
            client: { id: client?.id ? client.id.toString() : '', name: client ? client.name : '' },
            provider: { id: provider?.id?.toString() ?? '', name: provider ? provider.name : '' }
          })
        } catch (error) {
          console.error(error)
          reject(error)
          setIsAccessModalOpen(true)
          setIsNewAccessConfirmationModalOpen(false);
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: "Registrando acceso...",
        success: "Acceso registrado satisfactoriamente",
        error: "No se pudo registrar el acceso correctamente."
      }
    )
  }

  const handleEditDBAccessSubmit = (selectedProviders?: Record<number, boolean>) => { //submit para editar el acceso en la base de datos
    setIsSubmitting(true)
    const changedAccessProvider = selectedProviders && Object.keys(selectedProviders).length > 0
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          if (changedAccessProvider) {
            await updateAccess(form.getValues(), pathToRevalidate, selectedProviders)
          } else {
            await updateAccess(form.getValues(), pathToRevalidate)
          }
          resolve();
          setIsAccessModalOpen(false)
          setIsEditAccessConfirmationModalOpen(false)
          setSelectedProviderName('')
          form.reset({
            id: access?.id ?? undefined,
            username: form.getValues('username'),
            password: form.getValues('password'),
            notes: form.getValues('notes'),
            client: { id: client?.id ? client.id.toString() : '', name: client ? client.name : '' },
            provider: { id: form.getValues('provider.id'), name: form.getValues('provider.name') }
          })
        } catch (error) {
          console.error(error)
          reject(error)
          setIsAccessModalOpen(true)
          setIsEditAccessConfirmationModalOpen(false)
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: changedAccessProvider ? 'Editando acceso y dominios...' : 'Editando acceso...',
        success: changedAccessProvider ? 'Acceso y dominios editados satisfactoriamente.' : 'Acceso editado correctamente.',
        error: changedAccessProvider ? 'No se pudo editar el acceso y los dominios correctamente.' : 'No se pudo editar el acceso correctamente.'
      }
    )
  }

  const isDirty = Object.keys(form.formState.dirtyFields).length !== 0

  return (
    <>
      {children && cloneElement(children, { onClick: () => setIsAccessModalOpen(true) })}
      <ResponsiveDialog
        open={isAccessModalOpen}
        onOpenChange={() => setIsAccessModalOpen(false)}
        title={access ? "Editar acceso." : "Agregar nuevo acceso"}
        description={access ? "Editar los datos correspondientes del acceso." : 'Agregue los datos correspondientes al acceso.'}
        className="md:max-w-fit"
      >

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="provider.id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    const selectedProvider = providers?.find((provider) => provider.id.toString() === value)?.name;
                    if (selectedProvider) {
                      form.setValue('provider.name', selectedProvider);
                      setSelectedProviderName(selectedProvider);
                    }
                  }}
                    value={field.value}
                    disabled={provider?.id && !access ? true : false}
                    name='provider'
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {error ? (
                        <span className='p-2 text-destructive text-sm'>No se pudo recuperar correctamente los proveedores.</span>
                      ) :
                        providers && providers.map((provider) => (
                          <SelectItem
                            key={provider.url}
                            value={provider.id.toString()}
                            className="hover:bg-muted cursor-pointer"
                          >
                            {provider.name}
                          </SelectItem>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario o email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese el usuario o email del cliente" autoComplete="off" />
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
                  <FormLabel>Contraseña <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="Ingrese la contraseña" autoComplete="off" />
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
                    <Textarea
                      {...field}
                      className='min-h-[100px] resize-none' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              isDirty && access ? (
                <div className='flex gap-2'>
                  <Button
                    type="button"
                    variant='destructive'
                    onClick={() => {
                      setIsAccessModalOpen(false)
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
                        Editando acceso
                      </div>
                    ) : (
                      <>
                        <KeySquare className="w-5 h-5" />
                        Editar acceso
                      </>
                    )}
                  </Button>
                </div>
              ) : !access && (
                <div className='flex gap-2'>
                  <Button
                    type="button"
                    variant='destructive'
                    onClick={() => {
                      setIsAccessModalOpen(false)

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
                        Agregando acceso
                      </div>
                    ) : (
                      <>
                        <KeySquare className="w-5 h-5" />
                        Agregar acceso
                      </>
                    )}
                  </Button>
                </div>
              )
            }
          </form>
        </Form>
      </ResponsiveDialog>

      {/* NUEVO ACCESO */}
      <ResponsiveDialog
        open={isNewAccessConfirmationModalOpen}
        onOpenChange={() => setIsNewAccessConfirmationModalOpen(false)}
        title="Confirmar registro de nuevo acceso."
        description="Revise que los datos sean correctos y confirme el registro."
        className="md:max-w-fit"
      >
        <NewAccessConfirmationModal
          setIsCreateAccessModalOpen={setIsAccessModalOpen}
          setIsConfirmationModalOpen={setIsNewAccessConfirmationModalOpen}
          access={form.getValues()}
          provider={selectedProviderName ? selectedProviderName : provider?.name}
          handleSubmit={accessArray ? addAccess : handleNewDBAccessSubmit} //Envía una función u otra dependiendo si es temporal o no
          isSubmitting={isSubmitting}
          client={client?.name}
        />
      </ResponsiveDialog>

      {/* EDICION DE ACCESO */}

      <ResponsiveDialog
        open={isEditAccessConfirmationModalOpen}
        onOpenChange={
          () => {
            setIsEditAccessConfirmationModalOpen(false)
            setIsAccessModalOpen(true)
          }
        }
        title="Confirmar la edición del acceso"
        description="Revise que los datos sean correctos y confirme la edición."
        className="md:max-w-fit"
      >
        <EditAccessConfirmationModal
          setIsAccessModalOpen={setIsAccessModalOpen}
          form={form}
          setIsEditConfirmationModalOpen={setIsEditAccessConfirmationModalOpen}
          oldAccess={access ?? undefined}
          handleSubmit={handleEditDBAccessSubmit}
          isSubmitting={isSubmitting}
          provider={selectedProviderName ?? access?.provider?.name}
          providerId={provider?.id}
        />
      </ResponsiveDialog>
    </>

  )
}