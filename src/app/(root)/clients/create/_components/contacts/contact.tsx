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
import { ContactType } from '../create-client-form';
import { Mail, MoreVertical, Phone, SquarePen, Tag, Trash2, User } from 'lucide-react';
import { EditContactForm } from '@/app/(root)/clients/create/_components/contacts/edit-contact-form';
import { z } from 'zod';
import { DeleteForm } from '@/app/(root)/clients/create/_components/delete-form';

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
      <Card className="w-full p-4 flex shadow-sm relative hover:shadow-md duration-200 transition-all">
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

        {/* Dropdown Menu */}
        <div className="absolute right-4 top-4 z-10">
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] z-50">
                <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                  <button
                    onClick={() => {
                      setIsEditOpen(true);
                    }}
                    className="w-full justify-start flex rounded-md p-2 transition-all text-neutral-900 duration-75 hover:bg-neutral-100"
                  >
                    <IconMenu
                      text="Editar"
                      icon={<SquarePen className="h-4 w-4" />}
                    />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                  <button
                    onClick={() => {
                      setIsDeleteOpen(true);
                    }}
                    className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                  >
                    <IconMenu
                      text="Eliminar"
                      icon={<Trash2 className="h-4 w-4" />}
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