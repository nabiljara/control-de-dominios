import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Globe, CalendarArrowDown, Handshake, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { DomainFormValues } from "@/validators/zod-schemas";
import { UseFormReturn } from "react-hook-form";
import { Badge } from '@/components/ui/badge';
import { ContactInfoCard } from '@/app/(root)/clients/_components/contact-info-card';
import { Access, Contact } from '@/db/schema';
import { AccessInfoCard } from '@/app/(root)/clients/_components/access-info-card';
import { format } from "date-fns"
import { statusConfig } from '@/constants';

export function CreateDomainConfirmationModal(
  {
    handleSubmit,
    form,
    selectedContact,
    selectedAccess,
    provider,
    isSubmitting,
    setIsConfirmationDomainModalOpen
  }: {
    handleSubmit: () => void;
    form: UseFormReturn<DomainFormValues>
    selectedContact: Contact | undefined,
    selectedAccess: Access | undefined,
    provider: string | undefined,
    isSubmitting: boolean,
    setIsConfirmationDomainModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
) {
  return (
    <>
      <div className="gap-4 grid py-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Datos del dominio</h4>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="font-medium">Nombre:</span> {form.getValues('name')}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarArrowDown className="w-4 h-4 shrink-0" />
                  <p className='flex gap-2 truncate'>
                    <span className="font-medium">Fecha de vencimiento:</span>
                    {format(form.getValues('expirationDate'), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">Estado:</span>
                  <Badge
                    variant='outline'
                    className={`${statusConfig[form.getValues('status')].color}`}
                  >
                    {form.getValues('status')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake className="w-4 h-4 shrink-0" />
                  <span className="font-medium">Cliente:</span>
                  {form.getValues('client.name')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex sm:flex-row flex-col gap-4">
          <div className="flex flex-col gap-2 w-full">
            <h4 className="font-medium">Contacto</h4>
            <div className="gap-2 grid">
              {
                <ContactInfoCard contact={selectedContact ? selectedContact : undefined} readOnly />
              }
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h4 className="font-medium">Acceso</h4>
            <div className="gap-2 grid">
              {selectedAccess ? (
                <AccessInfoCard access={selectedAccess} readOnly index={1} provider={provider} />
              ) : (
                <div className="py-4 text-neutral-500 text-left">
                  Sin información
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button
            type="button"
            variant='destructive'
            onClick={() => {
              setIsConfirmationDomainModalOpen(false)
            }}
            disabled={isSubmitting}
            className='w-full'
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
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
