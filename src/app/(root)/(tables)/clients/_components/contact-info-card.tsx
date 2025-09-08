import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { statusConfig } from '@/constants'
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

export function ContactInfoCard({
  contact,
  isSelected = false,
  onSelect,
  readOnly = false,
}: ContactInfoCardProps) {

  return (
    <Card
      className={`relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200
        ${isSelected ? 'border-green-500 border' : ''}
        ${readOnly ? '' : 'cursor-pointer'}
      `}
      onClick={() => {
        if (contact?.id && onSelect && contact.status !== 'Inactivo') {
          onSelect(contact.id.toString(), contact);
        }
        if (contact?.status !== 'Activo' && !readOnly) {
          toast.warning('Solo puede seleccionar contactos activos.')
        }
      }}
      role={!readOnly ? 'button' : undefined}
      tabIndex={!readOnly ? 0 : undefined}
      onKeyDown={(e) => {
        if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          if (contact?.id && onSelect && contact.status !== 'Inactivo') {
            onSelect(contact.id.toString(), contact);
          }
          if (contact?.status !== 'Activo') {
            toast.warning('Solo puede seleccionar contactos activos.');
          }
        }
      }}
    >
      <CardContent className='flex flex-col justify-between items-start gap-3 p-0 overflow-hidden'>
        <div className='flex items-center gap-2 w-full overflow-hidden'>
          <User className="w-4 h-4 shrink-0" />
          <h2 className="font-bold text-md truncate">
            {contact?.name}
          </h2>
          <Badge
            variant='outline'
            className={contact ? statusConfig[contact.status].color : ''}
          >
            {contact?.status}
          </Badge>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className="w-4 h-4 shrink-0" />
          <span className="text-neutral-500 text-sm">
            {contact?.email}
          </span>
        </div>
        {contact?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0" />
            <span className="text-neutral-500 text-sm">
              {contact?.phone}
            </span>
          </div>
        )}
        <div className='flex items-center gap-2'>
          <Tag className="w-4 h-4 shrink-0" />
          <Badge variant={'outline'} className='truncate'>
            {contact?.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}