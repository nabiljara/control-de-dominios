import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, User, BarChart2, CheckCircle, Box, StickyNote, Tag, Lock, EyeOff, Eye } from "lucide-react"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AccessType, ContactType, ClientFormValues } from "@/validators/client-validator";
import { UseFormReturn } from "react-hook-form";
import { Badge } from '@/components/ui/badge';

export function ConfirmationModal(
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
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const toggleShowPassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
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
                contacts.map((contact, index) => (
                  <Card key={index} className="relative flex p-4 w-full">
                    {/* Card Content */}
                    <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
                      <div className='flex items-center gap-2'>
                        <User className="w-4 h-4" />
                        <h2 className="font-bold text-md">
                          {contact.name}
                        </h2>
                        <Badge variant='outline' className={contact.status === 'Activo' ? 'bg-green-500' : ''}>
                          {contact.status}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Mail className="w-4 h-4" />
                        <span className="text-neutral-500 text-sm overflow-hidden">
                          {contact.email}
                        </span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-neutral-500 text-sm">
                            {contact.phone}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center gap-2'>
                        <Tag className="w-4 h-4" />
                        <span className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors focus:outline-none">
                          {contact.type}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
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
                accesses.map((access, index) => (
                  <Card key={index} className="relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200">
                    {/* Card Content */}
                    <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
                      <div className='flex items-center gap-2'>
                        <Box className="w-4 h-4" />
                        <h2 className="font-bold text-md">
                          {access.provider.name}
                        </h2>
                      </div>
                      <div className='flex items-center gap-2'>
                        <User className="w-4 h-4" />
                        <span className="text-neutral-500 text-sm">
                          {access.username}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Lock className="w-4 h-4" />
                        <span className="text-neutral-500 text-sm">
                          {showPasswords[index] ? access.password : '•'.repeat(access.password.length)}
                        </span>
                        <Button
                          onClick={() => toggleShowPassword(index)}
                          aria-label={showPasswords[index] ? 'Esconder contraseña' : 'Mostrar contraseña'}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent px-3 py-2 h-full"
                        >
                          {showPasswords[index] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {access.notes && (
                        <div className="flex items-start gap-2">
                          <StickyNote className="w-4 h-4 shrink-0" />
                          <span className="text-neutral-500 text-sm">
                            {access.notes}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
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
