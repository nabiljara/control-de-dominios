import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ContactType } from '@/validators/client-validator'
import { Mail, Phone, Tag, User } from 'lucide-react'
import React from 'react'

interface ContactInfoCardProps extends ContactType {
  isSelected?: boolean;
  readOnly?: boolean;
  onSelect?: (contactId: string) => void;
}

export default function ContactInfoCard({
  id,
  name,
  email,
  status,
  type,
  phone,
  isSelected = false,
  onSelect,
  readOnly = false
}: ContactInfoCardProps) {

  return (
    <Card
      className={`relative flex p-4 w-full transition-colors
        ${isSelected ? 'bg-green-100 hover:bg-green-200' : ''}
        ${readOnly ? '' : 'cursor-pointer hover:bg-gray-100'}
      `}
      onClick={() => {
        if (id && onSelect) {
          onSelect(id);
        }
      }}
    >
      <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
        <div className='flex items-center gap-2'>
          <User className="w-4 h-4" />
          <h2 className="font-bold text-md">
            {name}
          </h2>
          <Badge variant='outline' className={status === 'Activo' ? 'bg-green-500' : ''}>
            {status}
          </Badge>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className="w-4 h-4" />
          <span className="text-neutral-500 text-sm overflow-hidden">
            {email}
          </span>
        </div>
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="text-neutral-500 text-sm">
              {phone}
            </span>
          </div>
        )}
        <div className='flex items-center gap-2'>
          <Tag className="w-4 h-4" />
          <span className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors focus:outline-none">
            {type}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}