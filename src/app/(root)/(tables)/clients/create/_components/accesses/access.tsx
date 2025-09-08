'use client';

import { useState } from 'react';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { AccessFormValues } from '@/validators/zod-schemas';
import { AtSign, Box, SquarePen, StickyNote, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Provider } from '@/db/schema';
import { EditAccessForm } from './edit-access-form';
import { DeleteForm } from '../delete-form';

export function Access({
  access,
  removeAccess,
  index,
  editAccess,
  accessSchema,
  providers
}: {
  access: AccessFormValues;
  removeAccess: (index: number) => void;
  editAccess: (index: number, updatedAccess: AccessFormValues) => void;
  index: number
  accessSchema: z.Schema;
  providers: Provider[]
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
        onOpenChange={setIsEditOpen}
        title="Editar acceso"
        description='Edite los campos correspondientes al acceso.'
        className="md:max-w-fit"
      >
        <EditAccessForm setIsOpen={setIsEditOpen} editAccess={editAccess} index={index} accessSchema={accessSchema} access={access} providers={providers} />
      </ResponsiveDialog>
      <ResponsiveDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Eliminar acceso"
        description="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este acceso?"
      >
        <DeleteForm onClose={() => setIsDeleteOpen(false)} index={index} remove={removeAccess} />
      </ResponsiveDialog>
      <Card className="relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200">
        {/* Card Content */}
        <CardContent className='flex flex-col items-start gap-3 p-0 h-full'>
          <div className='flex items-center gap-2'>
            <Box className="w-4 h-4" />
            <h2 className="font-bold text-md">
              {access.provider.name}
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <AtSign className="w-4 h-4" />
            <span className="text-neutral-500 text-sm">
              {access.username}
            </span>
          </div>
          {access.notes && (
            <div className="flex items-start gap-2">
              <StickyNote className="w-4 h-4 shrink-0" />
              <span className="text-neutral-500 text-sm">
                {access.notes}
              </span>
            </div>
          )}
          <div className="top-4 right-4 z-10 absolute flex justify-between">
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
      </Card>
    </>
  );
}