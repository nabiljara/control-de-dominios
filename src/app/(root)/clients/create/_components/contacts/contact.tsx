'use client';

import { useState } from 'react';
import { IconMenu } from '@/components/icon-menu';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContactType } from '@/validators/client-validator';
import { Circle, Mail, MoreVertical, Phone, SquarePen, Tag, Trash2, User } from 'lucide-react';
import { EditContactForm } from '@/app/(root)/clients/create/_components/contacts/edit-contact-form';
import { z } from 'zod';
import { DeleteForm } from '@/app/(root)/clients/create/_components/delete-form';
import { Badge } from '@/components/ui/badge';

export function Contact({
  contact,
  removeContact,
  index,
  editContact,
  contactSchema
}: {
  contact: ContactType;
  removeContact: (index: number) => void;
  editContact: (index: number, updatedContact: ContactType) => void;
  index: number
  contactSchema: z.Schema;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <>
      <ResponsiveDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Editar contacto"
        description='Edite los datos correspondientes al contacto.'
      >
        <EditContactForm setIsOpen={setIsEditOpen} editContact={editContact} index={index} contactSchema={contactSchema} contact={contact} />
      </ResponsiveDialog>
      <ResponsiveDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Eliminar contacto"
        description="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este contacto?"
      >
        <DeleteForm setIsOpen={setIsDeleteOpen} index={index} remove={removeContact} />
      </ResponsiveDialog>
      <Card className="relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200">
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

        {/* Dropdown Menu */}
        <div className="top-4 right-4 z-10 absolute">
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex data-[state=open]:bg-muted p-0 w-8 h-8"
                >
                  <MoreVertical className="w-4 h-4" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 w-[160px]">
                <DropdownMenuItem className="flex justify-between items-center p-0 w-full font-base text-left text-neutral-500 text-sm group">
                  <button
                    onClick={() => {
                      setIsEditOpen(true);
                    }}
                    className="flex justify-start hover:bg-neutral-100 p-2 rounded-md w-full text-neutral-900 transition-all duration-75"
                  >
                    <IconMenu
                      text="Editar"
                      icon={<SquarePen className="w-4 h-4" />}
                    />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between items-center p-0 w-full font-base text-left text-neutral-500 text-sm group">
                  <button
                    onClick={() => {
                      setIsDeleteOpen(true);
                    }}
                    className="flex justify-start hover:bg-neutral-100 p-2 rounded-md w-full text-red-500 transition-all duration-75"
                  >
                    <IconMenu
                      text="Eliminar"
                      icon={<Trash2 className="w-4 h-4" />}
                    />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </div>
      </Card>
    </>
  );
}