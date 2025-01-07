import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Contact } from '@/db/schema'
import { Mail, Phone, Tag, User } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

interface ContactInfoCardProps {
  contact: Contact | undefined;
  isSelected?: boolean;
  readOnly?: boolean;
  onSelect?: (contactId: string, contact: Contact) => void;
}

export default function ContactInfoCard({
  contact,
  isSelected = false,
  onSelect,
  readOnly = false,
}: ContactInfoCardProps) {

  return (
    <Card
      className={`relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200
        ${isSelected ? 'bg-green-100 hover:bg-green-200' : ''}
        ${readOnly ? '' : 'cursor-pointer hover:bg-gray-100'}
      `}
      onClick={() => {
        if (contact?.id && onSelect && contact.status !== 'Inactivo') {
          onSelect(contact.id.toString(), contact);
        }
        if (contact?.status !== 'Activo' && !readOnly) {
          toast.warning('Solo puede seleccionar contactos activos.')
        }
      }}
    >
      <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
        <div className='flex items-center gap-2'>
          <User className="w-4 h-4" />
          <h2 className="font-bold text-md">
            {contact?.name}
          </h2>
          <Badge variant='outline' className={contact?.status === 'Activo' ? 'bg-green-500' : ''}>
            {contact?.status}
          </Badge>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className="w-4 h-4" />
          <span className="text-neutral-500 text-sm overflow-hidden">
            {contact?.email}
          </span>
        </div>
        {contact?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="text-neutral-500 text-sm">
              {contact?.phone}
            </span>
          </div>
        )}
        <div className='flex items-center gap-2'>
          <Tag className="w-4 h-4" />
          <span className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors focus:outline-none">
            {contact?.type}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}