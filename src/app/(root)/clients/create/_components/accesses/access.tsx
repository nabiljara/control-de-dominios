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
import { AccessType } from '@/validators/client-validator';
import { Box, MoreVertical, SquarePen, StickyNote, Trash2, User } from 'lucide-react';
import { z } from 'zod';
import { EditAccessForm } from '@/app/(root)/clients/create/_components/accesses/edit-access-form';
import { DeleteForm } from '@/app/(root)/clients/create/_components/delete-form';
import { Provider } from '@/actions/provider-actions';

export function Access({
  access,
  removeAccess,
  index,
  editAccess,
  accessSchema,
  providers
}: {
  access: AccessType;
  removeAccess: (index: number) => void;
  editAccess: (index: number, updatedAccess: AccessType) => void;
  index: number
  accessSchema: z.Schema;
  providers: Provider[]
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <>
      <ResponsiveDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Editar acceso"
        description='Edite los campos correspondientes al acceso.'
      >
        <EditAccessForm setIsOpen={setIsEditOpen} editAccess={editAccess} index={index} accessSchema={accessSchema} access={access} providers={providers}/>
      </ResponsiveDialog>
      <ResponsiveDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Eliminar accesso"
        description="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este accesso?"
      >
        <DeleteForm setIsOpen={setIsDeleteOpen} index={index} remove={removeAccess} />
      </ResponsiveDialog>
      <Card className="relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200">
        {/* Card Content */}
        <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
          <div className='flex items-center gap-2'>
            <Box className="w-4 h-4" />
            <h2 className="font-bold text-md">
              {access.provider.name}
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <User className="w-4 h-4" />
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