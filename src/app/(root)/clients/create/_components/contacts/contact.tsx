'use client';

import { useState } from 'react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContactFormValues } from '@/validators/zod-schemas';
import { Mail, Phone, SquarePen, Tag, Trash2, User } from 'lucide-react';
import { EditContactForm } from '@/app/(root)/clients/create/_components/contacts/edit-contact-form';
import { z } from 'zod';
import { DeleteForm } from '@/app/(root)/clients/create/_components/delete-form';
import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/constants';

export function Contact({
  contact,
  removeContact,
  index,
  editContact,
  contactSchema
}: {
  contact: ContactFormValues;
  removeContact: (index: number) => void;
  editContact: (index: number, updatedContact: ContactFormValues) => void;
  index: number
  contactSchema: z.Schema;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditOpen(true)
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleteOpen(true)
  }

  return (
    <>
      <ResponsiveDialog
        open={isEditOpen}
        onOpenChange={() => setIsEditOpen(false)}
        title="Editar contacto"
        description='Edite los datos correspondientes al contacto.'
        className="md:max-w-fit"
      >
        <EditContactForm onClose={() => setIsEditOpen(false)} editContact={editContact} index={index} contactSchema={contactSchema} contact={contact} />
      </ResponsiveDialog>
      <ResponsiveDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        title="Eliminar contacto"
        description="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este contacto?"
      >
        <DeleteForm onClose={() => setIsDeleteOpen(false)} index={index} remove={removeContact} />
      </ResponsiveDialog>
      <Card className="relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200">
        {/* Card Content */}
        <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
          <div className='flex items-center gap-2'>
            <User className="w-4 h-4" />
            <h2 className="font-bold text-md">
              {contact.name}
            </h2>
            <Badge
              variant='outline'
              className={statusConfig[contact.status].color}
            >
              {contact.status}
            </Badge>
          </div>
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
          <div className="top-2 right-3 z-10 absolute flex justify-between">
            <Button
              onClick={handleEdit}
              className="flex justify-start hover:bg-neutral-100 p-2 rounded-md w-full text-neutral-900 transition-all duration-75"
              variant='ghost'
            >
              <SquarePen className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              className="flex justify-start hover:bg-neutral-100 p-2 rounded-md w-full text-red-500 hover:text-red-500 transition-all duration-75"
              variant='ghost'
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card >
    </>
  );
}