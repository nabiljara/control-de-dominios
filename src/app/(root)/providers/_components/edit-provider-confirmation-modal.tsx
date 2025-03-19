"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Box, Link2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProviderFormValues } from "@/validators/zod-schemas"
import { UseFormReturn } from "react-hook-form"
import { Provider } from "@/db/schema"
import { changedField } from "@/components/changed-field"

export function EditProviderConfirmationModal({
  handleSubmit,
  form,
  provider,
  setIsOpen,
  isSubmitting
}: {
  handleSubmit: () => void
  form: UseFormReturn<ProviderFormValues>
  provider: Provider
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean
}) {
  const { name, url } = form.getValues()
  const nameState = form.getFieldState("name")
  const urlState = form.getFieldState("url")

  return (
    <Card className="border-none">
      <CardContent className="space-y-4 p-0">
        {changedField(
          <Box className="w-4 h-4 text-primary" />,
          "Nombre",
          provider.name,
          name,
          nameState.isDirty
        )}
        {changedField(
          <Link2 className="w-4 h-4 text-primary" />,
          "URL",
          provider.url,
          url,
          urlState.isDirty
        )}
        <div className='flex gap-2'>
          <Button
            type="button"
            variant='destructive'
            onClick={() => {
              setIsOpen(false)
            }}
            disabled={isSubmitting}
            className='w-full'
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
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
      </CardContent>
    </Card>
  )
}
