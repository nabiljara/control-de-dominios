import React, { useState } from 'react'
import { AccessType } from "@/validators/client-validator";
import { Card, CardContent, CardDescription} from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { Box, Eye, EyeOff, Lock, StickyNote, User } from "lucide-react";

export default function NewClientAccessConfirmationModal(
  {
    access,
    handleSubmit,
  }: {
    access: AccessType;
    handleSubmit: () => void;
  }
) {

  const [showPasswords, setShowPasswords] = useState(false);

  return (
    <>
      <div className="gap-4 grid py-4">
        <div className="flex flex-col gap-2">
          <Card>
            <CardDescription></CardDescription>
            <CardContent className='flex flex-col gap-3 pt-4'>
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
              <div className='flex items-center gap-2'>
                <Lock className="w-4 h-4" />
                <span className="text-neutral-500 text-sm">
                  {showPasswords ? access.password : '•'.repeat(access.password.length)}
                </span>
                <Button
                  onClick={() => setShowPasswords(!showPasswords)}
                  aria-label={showPasswords ? 'Esconder contraseña' : 'Mostrar contraseña'}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent px-3 py-2 h-full"
                >
                  {showPasswords ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
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
          </Card>
        </div>

        <Button type="button" onClick={handleSubmit}>Confirmar Registro</Button>
      </div>
    </>
  )
}
