import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, User, BarChart2, CheckCircle, Box, StickyNote, Tag, Lock, EyeOff, Eye } from "lucide-react"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AccessType, ContactType, FormValues } from "@/app/(root)/clients/create/_components/create-client-form";
import { UseFormReturn } from "react-hook-form";

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
    form: UseFormReturn<FormValues>
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
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Datos del cliente</h4>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Nombre:</span> {form.getValues().name}
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span className="font-medium">Tamaño:</span> {form.getValues().size}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Estado:</span> {form.getValues().state}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Contactos</h4>
            <div className="grid gap-2">
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <Card key={index} className="w-full p-4 flex relative">
                    {/* Card Content */}
                    <CardContent className='p-0 flex flex-col items-start gap-2 justify-between h-full'>
                      <div className='flex items-center gap-2'>
                        <User className="h-4 w-4" />
                        <h2 className="font-bold text-md">
                          {contact.name}
                        </h2>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Mail className="h-4 w-4" />
                        <span className="text-neutral-500 text-sm overflow-hidden">
                          {contact.email}
                        </span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span className="text-neutral-500 text-sm">
                            {contact.phone}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center gap-2'>
                        <Tag className="h-4 w-4" />
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {contact.type}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-left text-neutral-500 py-4">
                  Sin información
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Accesos</h4>
            <div className="grid gap-2">
              {accesses.length > 0 ? (
                accesses.map((access, index) => (
                  <Card key={index} className="w-full p-4 flex shadow-sm relative hover:shadow-md duration-200 transition-all">
                    {/* Card Content */}
                    <CardContent className='p-0 flex flex-col items-start gap-2 justify-between h-full'>
                      <div className='flex items-center gap-2'>
                        <Box className="h-4 w-4" />
                        <h2 className="font-bold text-md">
                          {access.provider}
                        </h2>
                      </div>
                      <div className='flex items-center gap-2'>
                        <User className="h-4 w-4" />
                        <span className="text-neutral-500 text-sm">
                          {access.username}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Lock className="h-4 w-4" />
                        <span className="text-neutral-500 text-sm">
                          {showPasswords[index] ? access.password : '•'.repeat(access.password.length)}
                        </span>
                        <Button
                          onClick={() => toggleShowPassword(index)}
                          aria-label={showPasswords[index] ? 'Esconder contraseña' : 'Mostrar contraseña'}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-full px-3 py-2 hover:bg-transparent"
                        >
                          {showPasswords[index] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {access.notes && (
                        <div className="flex items-start gap-2">
                          <StickyNote className="h-4 w-4 shrink-0" />
                          <span className="text-neutral-500 text-sm">
                            {access.notes}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-left text-neutral-500 py-4">
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
