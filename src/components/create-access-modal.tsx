'use client'
import React, { cloneElement, useState } from 'react'
import { useForm, } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccessFormValues, accessFormSchema as defaultAccessSchema } from '@/validators/client-validator'
import { Textarea } from '@/components/ui/textarea'
import { PasswordInput } from '@/components/password-input'
import { Provider } from '@/db/schema'
import { createAccess, validateAccess } from '@/actions/accesses-actions'
import { toast } from 'sonner'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { KeySquare, Loader2 } from 'lucide-react'
import { NewAccessConfirmationModal } from '@/components/new-access-confirmation-modal'


export function CreateAccessModal({
  accessFormSchema,
  providers,
  setAccess,
  children,
  notification,
  accessArray,
  provider,
  client,
  pathToRevalidate
}: {
  accessFormSchema?: z.Schema;
  accessArray?: AccessFormValues[]; //Indica que trata al registro como un acceso temporal
  setAccess?: React.Dispatch<React.SetStateAction<AccessFormValues[]>>;
  providers: Provider[];
  children?: React.ReactElement
  provider?: { id: number; name: string; };
  client?: { id: number; name: string; },
  notification?: React.Dispatch<React.SetStateAction<boolean>>;
  pathToRevalidate?: string;
}) {

  const [isCreateAccessModalOpen, setIsCreateAccessModalOpen] = useState(false)
  const [isNewAccessConfirmationModalOpen, setIsNewAccessConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProviderName, setSelectedProviderName] = useState<undefined | string>(undefined);

  const form = useForm<AccessFormValues>({
    resolver: zodResolver(accessFormSchema ?? defaultAccessSchema),
    defaultValues: {
      username: '',
      password: '',
      notes: '',
      client: { id: client ? client.id.toString() : undefined, name: client ? client.name : undefined }
    },
    mode: 'onSubmit'
  })

  if (provider) {
    form.setValue('provider', { id: provider.id.toString(), name: provider.name }) // Se setea manualmente por si cambia el provider en createDomain
  }
  
  const addAccess = (access: AccessFormValues) => { //Función para agregar el acceso temporal del nuevo cliente
    if (setAccess) {
      setAccess([...(accessArray ?? []), access])
    }
    setIsCreateAccessModalOpen(false)
    form.reset({
      username: '',
      password: '',
      notes: '',
      client: { id: client ? client.id.toString() : undefined, name: client ? client.name : '' }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => { //Primer submit para validar el formulario
    try {
      e.preventDefault(); //Previene que el formulario de cliente o dominio se valide también
      e.stopPropagation();
      setIsSubmitting(true)
      const isValid = await form.trigger() //ejecuto validación manual
      if (isValid) {
        const errorList = await validateAccess(form.getValues('username'), parseInt(form.getValues('provider.id')), undefined, undefined); // valido el acceso en la base de datos manualmente
        if (errorList.length > 0) {
          errorList.forEach((error) => {
            form.setError(error.field, {
              type: "manual",
              message: error.message,
            });
          });
        } else if (accessArray) {
          addAccess(form.getValues());
        } else {
          setIsNewAccessConfirmationModalOpen(true);
          setIsCreateAccessModalOpen(false)
        }
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
          setIsCreateAccessModalOpen(false)
          setSelectedProviderName('')
          form.reset({
            provider: { id: provider ? provider.id.toString() : undefined, name: provider ? provider.name : '' },
            username: '',
            password: '',
            notes: '',
            client: { id: client ? client.id.toString() : undefined, name: client ? client.name : '' }
          })
        } catch (error) {
          console.error(error)
          reject(error)
          setIsCreateAccessModalOpen(true)
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

  return (
    <>
      {children && cloneElement(children, { onClick: () => setIsCreateAccessModalOpen(true) })}
      <ResponsiveDialog
        open={isCreateAccessModalOpen}
        onOpenChange={() => setIsCreateAccessModalOpen(false)}
        title="Agregar nuevo acceso."
        description="Agregue los datos correspondientes al acceso."
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
                    const selectedProvider = providers.find((provider) => provider.id.toString() === value)?.name;
                    if (selectedProvider) {
                      form.setValue('provider.name', selectedProvider);
                      setSelectedProviderName(selectedProvider);
                    }
                  }}
                    defaultValue={provider ? provider.id.toString() : undefined}
                    value={provider ? provider.id.toString() : field.value}
                    disabled={provider?.id ? true : false}
                    name='provider'
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        providers.map((provider) => (
                          <SelectItem key={provider.url} value={provider.id.toString()}>{provider.name}</SelectItem>
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
                    <Input {...field} placeholder="Ingrese el usuario o email del cliente" autoComplete="email" />
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
                    <PasswordInput {...field} placeholder="Ingrese la contraseña" autoComplete="new-password" />
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
            <div className='flex gap-2'>
              <Button
                type="button"
                variant='destructive'
                onClick={() => {
                  setIsCreateAccessModalOpen(false)
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
                    Agregando acceso...
                  </div>
                ) : (
                  <>
                    <KeySquare className="w-5 h-5" />
                    Agregar acceso
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={isNewAccessConfirmationModalOpen}
        onOpenChange={() => setIsNewAccessConfirmationModalOpen(false)}
        title="Confirmar registro de nuevo acceso."
        description="Revise que los datos sean correctos y confirme el registro."
        className="sm:max-w-[420px]"
      >
        <NewAccessConfirmationModal
          setIsCreateAccessModalOpen={setIsCreateAccessModalOpen}
          setIsConfirmationModalOpen={setIsNewAccessConfirmationModalOpen}
          access={form.getValues()}
          provider={selectedProviderName ? selectedProviderName : provider?.name}
          handleSubmit={accessArray ? addAccess : handleNewDBAccessSubmit} //Envía una función u otra dependiendo si es temporal o no
          isSubmitting={isSubmitting}
          client={client?.name}
        />
      </ResponsiveDialog>
    </>

  )
}