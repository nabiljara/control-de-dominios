'use client'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Mail, Phone, User, Tag, Loader2, Handshake, } from "lucide-react"
import { Button } from "@/components/ui/button";
import { ContactFormValues } from "@/validators/zod-schemas";
import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/constants';

export function NewContactConfirmationModal(
  {
    contact,
    handleSubmit,
    isSubmitting,
    setIsContactModalOpen,
    setIsConfirmationModalOpen,
    client
  }: {
    contact: ContactFormValues;
    handleSubmit?: (() => void) | ((contact: ContactFormValues) => void);
    isSubmitting: boolean
    setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    client?: string
  }
) {

  return (
    <>
      <div className="gap-4 grid py-4">
        <div className="flex flex-col gap-2">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-4">
              <CardDescription></CardDescription>
              <div className='flex items-center gap-2'>
                <User className="w-4 h-4" />
                <h2 className="font-bold text-md">
                  {contact.name}
                </h2>
                <Badge variant='outline' className={statusConfig[contact.status].color}>
                  {contact.status}
                </Badge>
              </div>
              {
                client &&
                <div className='flex items-center gap-2'>
                  <Handshake className="w-4 h-4" />
                  <span className="overflow-hidden text-neutral-500 text-sm">
                    {client}
                  </span>
                </div>
              }
              <div className='flex items-center gap-2'>
                <Mail className="w-4 h-4" />
                <span className="overflow-hidden text-neutral-500 text-sm">
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
                <Badge variant='outline' className='truncate'>
                  {contact.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='flex gap-2'>
          <Button
            type="button"
            variant='destructive'
            onClick={() => {
              setIsContactModalOpen(true)
              setIsConfirmationModalOpen(false)
            }}
            disabled={isSubmitting}
            className='w-full'
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit && handleSubmit(contact)}
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
      </div>
    </>
  )
}
