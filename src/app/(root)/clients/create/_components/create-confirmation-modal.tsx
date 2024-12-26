import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, User, BarChart2, CheckCircle, Box, StickyNote, Tag, Lock, EyeOff, Eye } from "lucide-react"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AccessType, ContactType, ClientFormValues } from "@/validators/client-validator";
import { UseFormReturn } from "react-hook-form";
import { Badge } from '@/components/ui/badge';
import ContactInfoCard from '../../_components/contact-info-card';
import { Access, Contact } from '@/db/schema';
import { AccessInfoCard } from '../../_components/access-info-card';

export function CreateConfirmationModal(
  {
    handleSubmit,
    contacts,
    accesses,
    form
  }: {
    handleSubmit: () => void;
    contacts: ContactType[];
    accesses: AccessType[];
    form: UseFormReturn<ClientFormValues>
  }
) {
  return (
    <>
      <div className="gap-4 grid py-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Datos del cliente</h4>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Nombre:</span> {form.getValues().name}
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  <span className="font-medium">Tamaño:</span> {form.getValues().size}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Estado:</span>
                  <Badge variant='outline' className={form.getValues().status === 'Activo' ? 'bg-green-500' : ''}>
                    {form.getValues().status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="gap-4 grid sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Contactos</h4>
            <div className="gap-2 grid">
              {contacts.length > 0 ? (
                contacts.map((contact) => {
                  const newContact: Contact = {
                    id: 0,
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone ? contact.phone : null,
                    status: contact.status,
                    type: contact.type,
                    createdAt: '',
                    updatedAt: '',
                    clientId: null
                  }
                  return <ContactInfoCard key={contact.email} contact={newContact} readOnly />
                })
              ) : (
                <div className="py-4 text-left text-neutral-500">
                  Sin información
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Accesos</h4>
            <div className="gap-2 grid">
              {accesses.length > 0 ? (
                accesses.map((access, index) => {
                  const newAccess: Access = {
                    id: 0,
                    username: access.username,
                    password: access.password,
                    createdAt: '',
                    updatedAt: '',
                    notes: access.notes ? access.notes : null,
                    clientId: null,
                    providerId: null
                  }
                  return <AccessInfoCard key={access.username} access={newAccess} readOnly index={index} provider={access.provider.name} />
                })
              ) : (
                <div className="py-4 text-left text-neutral-500">
                  Sin información
                </div>
              )}
            </div>
          </div>
        </div>
        <Button type="button" onClick={handleSubmit}>Confirmar Registro</Button>
      </div>
    </>
  )
}
