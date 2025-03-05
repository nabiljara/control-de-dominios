'use client'
import { Card, CardContent, CardDescription, CardTitle, } from '@/components/ui/card'
import { Mail, Phone, User, Tag, Loader2, Handshake, CheckCircle, ArrowRight, Globe, Contact2, AtSign, Box, KeySquare, StickyNote, } from "lucide-react"
import { Button } from "@/components/ui/button";
import { AccessFormValues, ContactFormValues } from "@/validators/client-validator";
import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/constants';
import { UseFormReturn } from 'react-hook-form';
import { AccessWithRelations, Client, Contact, ContactWithRelations } from '@/db/schema';
import { changedField } from './changed-field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateDomainContact } from '@/actions/domains-actions';
import { ContactModal } from './contact-modal';
import Plus from './plus';

export function EditAccessConfirmationModal(
  {
    setIsAccessModalOpen,
    form,
    setIsEditConfirmationModalOpen,
    oldAccess,
    handleSubmit,
    isSubmitting,
    provider
  }: {
    setIsAccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    form: UseFormReturn<AccessFormValues>
    setIsEditConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    oldAccess?: Omit<AccessWithRelations, "client">
    handleSubmit: () => void
    isSubmitting: boolean
    provider?: string
  }
) {

  if (!oldAccess) return
  const { username, password, notes, } = form.getValues()
  const usernameState = form.getFieldState("username")
  const passwordState = form.getFieldState("password")
  const notesState = form.getFieldState("notes")
  const providerState = form.getFieldState("provider.id")

  // const shouldShowInactiveWarning = providerState.isDirty && oldAccess && oldAccess.domainAccess.length > 0 //Si cambia el proveedor y tiene dominios asociados


  // const handleConfirm = async () => {
  //   const hasNullSelectedContact = Object.values(selectedContacts).some(value => value === null);
  //   if (hasNullSelectedContact) {
  //     toast.warning("Seleccione un nuevo contacto para cada dominio.");
  //     return
  //   }
  //   const filteredContacts = Object.fromEntries(
  //     Object.entries(selectedContacts).filter(([_, value]) => value !== null)
  //   ) as Record<number, number>;

  //   handleSubmit()
  //   await updateDomainContact(filteredContacts);
  // }

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
              className="p-4">
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
      {/* {shouldShowInactiveWarning && (
        <Card className='border-none'>
          <CardTitle className='text-lg'>Dominios afectados</CardTitle>
          <CardDescription className="mb-4">
            Los siguientes dominios se verán afectados por la modificación del proveedor
            en el acceso, deberá seleccionar un nuevo proveedor para cada  para cada uno. Puede crear uno nuevo si lo desea.
          </CardDescription>
          <CardContent className="flex flex-col gap-4 border-none">
            <ul className='space-y-4'>
              {
                oldAccess.domainAccess.map((d) => (
                  <li key={d.domain.name} className='flex justify-between items-center gap-4'>
                    <div className="flex items-center space-x-2">
                      <Globe size={18} />
                      <span>{d.domain.name}</span>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        setSelectedContacts((prev) => ({
                          ...prev,
                          [domain.id]: parseInt(value, 10),
                        }))
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Seleccione un contacto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <div className="px-2 font-semibold text-gray-500 text-sm">
                            Contactos de {domain.client?.name}
                          </div>
                          {domain.client.contacts.filter((contact) => contact.id !== oldContact.id && domain.clientId === contact.clientId).length > 0 ? (
                            <SelectGroup>
                              {
                                domain.client.contacts
                                  ?.filter((contact) => contact.id !== oldContact.id && domain.clientId === contact.clientId)
                                  .map((contact) => (
                                    <SelectItem
                                      key={contact.id}
                                      value={contact.id.toString()}
                                      className='hover:bg-muted hover:cursor-pointer'
                                    >
                                      <div>
                                        <p className="font-medium text-sm text-left">{contact.name}</p>
                                        <p className="flex items-center text-gray-500 text-xs">
                                          <Mail className="mr-1 w-3 h-3 shrink-0" />
                                          {contact.email}
                                        </p>
                                      </div>
                                    </SelectItem>
                                  )
                                  )
                              }
                            </SelectGroup>
                          ) : (
                            <span className='ml-2 text-destructive text-xs'>No hay contactos activos.</span>
                          )}
                        </SelectGroup>
                        {
                          domain.clientId !== 1 &&
                          <>
                            <div className="my-2 border-gray-200 border-t" />
                            <div className="px-2 font-semibold text-gray-500 text-sm">
                              Contactos de Kernel SAS
                            </div>
                            {kernelContacts && kernelContacts.filter((contact) => contact.id !== oldContact.id).length > 0 ? (
                              <SelectGroup>
                                {
                                  kernelContacts
                                    ?.filter((contact) => contact.id !== oldContact.id)
                                    .map((contact) => (
                                      <SelectItem
                                        key={contact.id}
                                        value={contact.id.toString()}
                                        className='hover:bg-muted hover:cursor-pointer'
                                      >
                                        <div>
                                          <p className="font-medium text-sm text-left">{contact.name}</p>
                                          <p className="flex items-center text-gray-500 text-xs">
                                            <Mail className="mr-1 w-3 h-3 shrink-0" />
                                            {contact.email}
                                          </p>
                                        </div>
                                      </SelectItem>
                                    )
                                    )
                                }
                              </SelectGroup>
                            ) : (
                              <span className='ml-2 text-destructive text-xs'>No hay contactos activos.</span>
                            )}
                          </>
                        }
                        <div className="my-2 border-gray-200 border-t" />
                        <div className="px-2 font-semibold text-gray-500 text-sm">
                          Contactos individuales
                        </div>
                        {individualContacts && individualContacts.filter((contact) => contact.id !== oldContact.id).length > 0 ? (
                          <SelectGroup>
                            {
                              individualContacts
                                ?.filter((contact) => contact.id !== oldContact.id)
                                .map((contact) => (
                                  <SelectItem
                                    key={contact.id}
                                    value={contact.id.toString()}
                                    className='hover:bg-muted hover:cursor-pointer'
                                  >
                                    <div>
                                      <p className="font-medium text-sm text-left">{contact.name}</p>
                                      <p className="flex items-center text-gray-500 text-xs">
                                        <Mail className="mr-1 w-3 h-3 shrink-0" />
                                        {contact.email}
                                      </p>
                                    </div>
                                  </SelectItem>
                                )
                                )
                            }
                          </SelectGroup>
                        ) : (
                          <span className='ml-2 text-destructive text-xs'>No hay contactos activos.</span>
                        )}
                      </SelectContent>
                    </Select>
                  </li>
                ))
              }
            </ul>
            <div className='flex justify-end'>
              <ContactModal
                pathToRevalidate={`/contacts/${oldContact.id}`}
                clients={clients}
              >
                <Button
                  variant="default"
                  className="gap-3 px-2 lg:px-3 w-[200px] h-8"
                >
                  <div className="relative">
                    <Contact2 />
                    <Plus />
                  </div>
                  Nuevo contacto
                </Button>
              </ContactModal>
            </div>
          </CardContent>
        </Card>
      )} */}
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
            // if (shouldShowInactiveWarning) {
            //   handleConfirm()
            // } else {
            handleSubmit()
          }
            // }
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
