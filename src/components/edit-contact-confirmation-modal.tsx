'use client'
import { Card, CardContent, CardDescription, CardTitle, } from '@/components/ui/card'
import { Mail, Phone, User, Tag, Loader2, Handshake, CheckCircle, ArrowRight, Globe, Contact2, } from "lucide-react"
import { Button } from "@/components/ui/button";
import { ContactFormValues } from "@/validators/client-validator";
import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/constants';
import { UseFormReturn } from 'react-hook-form';
import { Client, Contact, ContactWithRelations } from '@/db/schema';
import { changedField } from './changed-field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateDomainContact } from '@/actions/domains-actions';
import { ContactModal } from './contact-modal';
import Plus from './plus';

export function EditContactConfirmationModal(
  {
    handleSubmit,
    form,
    oldContact,
    isSubmitting,
    setIsContactModalOpen,
    setIsEditConfirmationModalOpen,
    client,
    individualContacts,
    kernelContacts,
    clients
  }: {
    form: UseFormReturn<ContactFormValues>
    oldContact?: ContactWithRelations;
    handleSubmit: () => void
    isSubmitting: boolean
    setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    client?: string
    individualContacts?: Contact[]
    kernelContacts?: Contact[]
    clients?: Client[]
  }
) {

  const { name, email, status, type, phone } = form.getValues()
  const nameState = form.getFieldState("name")
  const emailState = form.getFieldState("email")
  const statusState = form.getFieldState("status")
  const typeState = form.getFieldState("type")
  const phoneState = form.getFieldState("phone")
  const clientState = form.getFieldState("clientId")
  const shouldShowInactiveWarning = statusState.isDirty && status === 'Inactivo' && oldContact && oldContact.domains.length > 0 //Si cambia a inactivo y tiene dominios activos asociados

  const [selectedContacts, setSelectedContacts] = useState<Record<number, number | null>>(() => {
    const selectedContacts: Record<number, number | null> = {};
    oldContact?.domains.forEach((domain) => {
      selectedContacts[domain.id] = null;
    });
    return selectedContacts;
  });

  if (!oldContact) return

  const handleConfirm = async () => {
    const hasNullSelectedContact = Object.values(selectedContacts).some(value => value === null);
    if (hasNullSelectedContact) {
      toast.warning("Seleccione un nuevo contacto para cada dominio.");
      return
    }
    const filteredContacts = Object.fromEntries(
      Object.entries(selectedContacts).filter(([_, value]) => value !== null)
    ) as Record<number, number>;

    handleSubmit()
    await updateDomainContact(filteredContacts);
  }

  return (
    <>
      <Card className='border-none'>
        <CardContent className="space-y-4 p-0">
          {changedField(
            <User className="w-4 h-4 text-primary" />,
            "Nombre",
            oldContact.name,
            name,
            nameState.isDirty
          )}
          {changedField(
            <Mail className="w-4 h-4 text-primary" />,
            "Email",
            oldContact.email,
            email,
            emailState.isDirty
          )}
          {statusState.isDirty && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">Estado</span>
              </div>
              <div className="items-center gap-4 grid grid-cols-[1fr,auto,1fr]">
                <Badge
                  variant='outline'
                  className={`${statusConfig[oldContact.status].color} justify-self-center w-fit`}
                >
                  {oldContact.status}
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Badge
                  variant='outline'
                  className={`${statusConfig[status].color} justify-self-center w-fit`}
                >
                  {status}
                </Badge>
              </div>
            </div>
          )}
          {changedField(
            <Tag className="w-4 h-4 text-primary" />,
            "Tipo",
            oldContact.type,
            type,
            typeState.isDirty
          )}
          {changedField(
            <Phone className="w-4 h-4 text-primary" />,
            "Teléfono",
            oldContact.phone ? oldContact?.phone : '',
            phone ? phone : '',
            phoneState.isDirty
          )}

          {changedField(
            <Handshake className="w-4 h-4 text-primary" />,
            "Cliente",
            oldContact.client ? oldContact.client.name : 'Sin cliente',
            client ? client : '',
            clientState.isDirty
          )}
        </CardContent>
      </Card>
      {shouldShowInactiveWarning && (
        <Card className='border-none'>
          <CardTitle className='text-lg'>Dominios afectados</CardTitle>
          <CardDescription className="mb-4">
            Los siguientes dominios se verán afectados por la baja del
            contacto, deberá seleccionar un nuevo contacto (del cliente
            del dominio, de Kernel o un contacto individual) para cada uno. Puede crear uno nuevo si lo desea.
          </CardDescription>
          <CardContent className="flex flex-col gap-4 border-none">
            <ul className='space-y-4'>
              {
                oldContact.domains.map((domain) => (
                  <li key={domain.name} className='flex justify-between items-center gap-4'>
                    <div className="flex items-center space-x-2">
                      <Globe size={18} />
                      <span>{domain.name}</span>
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
      )}
      <div className='flex gap-2'>
        <Button
          type="button"
          variant='destructive'
          onClick={() => {
            setIsContactModalOpen(true)
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
            if (shouldShowInactiveWarning) {
              handleConfirm()
            } else {
              handleSubmit()
            }
          }}
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
