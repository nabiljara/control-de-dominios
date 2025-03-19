'use client'
import { Card, CardContent, CardDescription, CardTitle, } from '@/components/ui/card'
import { Loader2, Globe, AtSign, Box, KeySquare, StickyNote, } from "lucide-react"
import { Button } from "@/components/ui/button";
import { AccessFormValues } from "@/validators/zod-schemas";
import { UseFormReturn } from 'react-hook-form';
import { AccessWithRelations } from '@/db/schema';
import { changedField } from './changed-field';
import { useState } from 'react';
import { Switch } from './ui/switch';

export function EditAccessConfirmationModal(
  {
    setIsAccessModalOpen,
    form,
    setIsEditConfirmationModalOpen,
    oldAccess,
    handleSubmit,
    isSubmitting,
    provider,
    providerId,
  }: {
    setIsAccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    form: UseFormReturn<AccessFormValues>
    setIsEditConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    oldAccess?: Omit<AccessWithRelations, "client">
    handleSubmit: (selectedProviders?: Record<number, boolean>) => void
    isSubmitting: boolean
    provider?: string,
    providerId?: number
  }
) {
  const { username, password, notes, } = form.getValues()
  const usernameState = form.getFieldState("username")
  const passwordState = form.getFieldState("password")
  const notesState = form.getFieldState("notes")
  const providerState = form.getFieldState("provider.id")

  const shouldShowInactiveWarning = providerState.isDirty && oldAccess && oldAccess.domainAccess.length > 0 //Si cambia el proveedor y tiene dominios asociados

  const [selectedProviders, setSelectedProviders] = useState<Record<number, boolean>>(() => {
    const selectedProviders: Record<number, boolean> = shouldShowInactiveWarning ?
    oldAccess?.domainAccess.reduce((acc, domain) => {
      acc[domain.domainId] = false;
      return acc;
    }, {} as Record<number, boolean>) : {}
    return selectedProviders;
  });

  if (!oldAccess || !providerId) return

  return (
    <>
      <Card className='border-none'>
        <CardContent className="space-y-4 p-0">
          {changedField(
            <AtSign className="w-4 h-4 text-primary" />,
            "Usuario / Email",
            oldAccess.username,
            username,
            usernameState.isDirty
          )}
          {changedField(
            <KeySquare className="w-4 h-4 text-primary" />,
            "Contraseña",
            oldAccess.password,
            password,
            passwordState.isDirty
          )}
          {changedField(
            <Box className="w-4 h-4 text-primary" />,
            "Proveedor",
            oldAccess.provider ? oldAccess.provider.name : 'Sin cliente',
            provider ? provider : '',
            providerState.isDirty
          )}
          {changedField(
            <StickyNote className="w-4 h-4 text-primary" />,
            "Notas",
            oldAccess.notes ?? '',
            notes ?? '',
            notesState.isDirty
          )}
        </CardContent>
      </Card>
      {
        oldAccess.domainAccess.length > 0 && (passwordState.isDirty || usernameState.isDirty) &&
        <>
          <h4 className="font-medium">Dominios asociados a este acceso.</h4>
          <Card className="shadow-sm hover:shadow-md">
            <CardDescription
              className="p-4 text-destructive">
              {`Los siguientes dominios se verán afectados por el cambio 
              ${passwordState.isDirty && usernameState.isDirty ?
                  'de la contraseña y el nombre de usuario o email:'
                  : usernameState.isDirty ? 'del nombre de usuario o email:'
                    : 'de la contraseña:'} `}
            </CardDescription>
            <CardContent>
              <ul>
                {oldAccess.domainAccess.map((a) => (
                  <li key={a.id}>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {a.domain?.name}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      }
      {shouldShowInactiveWarning && (
        <Card className='shadow-none border-none'>
          <CardTitle className='text-lg'>Dominios afectados</CardTitle>
          <CardDescription className="mb-4 text-destructive">
            Los siguientes dominios se verán afectados por la modificación del proveedor
            en el acceso, deberá seleccionar si desea quitar el acceso en los dominios
            o que se cambie el proveedor en cada uno. Si marca como verdadero, se cambiará el proveedor a {' '}
            <span className='font-bold'>
              {provider}
            </span>
            , de lo contrario, se eliminará el acceso para el dominio.
          </CardDescription>
          <CardContent className="flex flex-col gap-4 p-0 border-none">
            <ul className='space-y-4'>
              {
                oldAccess.domainAccess.map((d) => (
                  <li key={d.domain.name} className='flex justify-between items-center gap-4'>
                    <div className="flex items-center space-x-2">
                      <Globe size={18} />
                      <span>{d.domain.name}</span>
                    </div>
                    <div className='flex flex-row justify-between gap-2'>
                      <span className='text-muted-foreground'>Cambiar proveedor</span>
                      <Switch
                        onCheckedChange={(value) =>
                          setSelectedProviders((prev) => ({
                            ...prev,
                            [d.domainId]: value,
                          }))
                        }
                      />
                    </div>
                  </li>
                ))
              }
            </ul>
          </CardContent>
        </Card>
      )}
      <div className='flex gap-2'>
        <Button
          type="button"
          variant='destructive'
          onClick={() => {
            setIsAccessModalOpen(true)
            setIsEditConfirmationModalOpen(false)
          }}
          disabled={isSubmitting}
          className='w-full'
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => {
            if(shouldShowInactiveWarning){
              handleSubmit(selectedProviders)
            }else{
              handleSubmit()
            }
          }
          }
          disabled={isSubmitting}
          className='w-full'
        >
          {isSubmitting ? (
            <>
              <div className='flex items-center gap-1'>
                <Loader2 className='animate-spin' />
                Confirmando
              </div>
            </>
          ) : (
            'Confirmar'
          )}
        </Button>
      </div>
    </>
  )
}
