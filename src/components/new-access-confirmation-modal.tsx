'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Handshake, Box, StickyNote, KeySquare, EyeOff, Eye, AtSign, } from "lucide-react"
import { Button } from "@/components/ui/button";
import { AccessFormValues, } from "@/validators/zod-schemas";
import { useState } from 'react';

export function NewAccessConfirmationModal(
  {
    access,
    handleSubmit,
    isSubmitting,
    setIsCreateAccessModalOpen,
    setIsConfirmationModalOpen,
    client,
    provider
  }: {
    access: AccessFormValues;
    handleSubmit?: (() => void) | ((access: AccessFormValues) => void);
    isSubmitting: boolean
    setIsCreateAccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    client?: string
    provider?: string
  }
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="gap-4 grid py-4">
        <div className="flex flex-col gap-2">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-4">
              {
                client &&
                <div className='flex items-center gap-2'>
                  <Handshake className="w-4 h-4" />
                  <span className="overflow-hidden text-neutral-500 text-sm">
                    {client}
                  </span>
                </div>
              }
              <div className='flex items-center gap-2'>
                <Box className="w-4 h-4" />
                <span className="overflow-hidden text-neutral-500 text-sm">
                  {provider}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <AtSign className="w-4 h-4" />
                <span className="overflow-hidden text-neutral-500 text-sm">
                  {access.username}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className="flex items-center gap-2">
                  <KeySquare className="w-4 h-4" />
                  <span className="text-neutral-500 text-sm">
                    {showPassword
                      ? access.password
                      : "•".repeat(
                        access?.password.length ? 8 : 0,
                      )}
                  </span>
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Esconder contraseña"
                        : "Mostrar contraseña"
                    }
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent px-3 py-2 h-full"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              {access?.notes && (
                <div className="flex items-start gap-2">
                  <StickyNote className="w-4 h-4 shrink-0" />
                  <span className="text-neutral-500 text-sm">{access.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className='flex gap-2'>
          <Button
            type="button"
            variant='destructive'
            onClick={() => {
              setIsCreateAccessModalOpen(true)
              setIsConfirmationModalOpen(false)
            }}
            disabled={isSubmitting}
            className='w-full'
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit && handleSubmit(access)}
            disabled={isSubmitting}
            className='w-full'
          >
            {isSubmitting ? (
              <>
                <div className='flex items-center gap-1'>
                  <Loader2 className='animate-spin' />
                  Confirmando
                </div>
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
