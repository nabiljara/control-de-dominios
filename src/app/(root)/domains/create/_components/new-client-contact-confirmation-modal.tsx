import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Mail, Phone, User, Tag, } from "lucide-react"
import { Button } from "@/components/ui/button";
import { ContactType } from "@/validators/client-validator";
import { Badge } from '@/components/ui/badge';


export function NewClientContactConfirmationModal(
  {
    contact,
    handleSubmit,
  }: {
    contact: ContactType;
    handleSubmit: () => void;
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
                <Badge variant='outline' className={status === 'Activo' ? 'bg-green-500' : ''}>
                  {status}
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
        </div>

        <Button type="button" onClick={handleSubmit}>Confirmar Registro</Button>
      </div>
    </>
  )
}
