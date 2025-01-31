"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Box, Check, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProviderFormValues } from "@/validators/client-validator"
import { UseFormReturn } from "react-hook-form"
import { Provider } from "@/db/schema"

export function EditProviderConfirmationModal({
  handleSubmit,
  form,
  provider,
  setIsOpen
}: {
  handleSubmit: () => void
  form: UseFormReturn<ProviderFormValues>
  provider: Provider
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { name, url } = form.getValues()
  const nameState = form.getFieldState("name")
  const urlState = form.getFieldState("url")

  const renderField = (
    icon: React.ReactNode,
    label: string,
    oldValue: string,
    newValue: string,
    isDirty: boolean
  ) => {
    if (!isDirty) return null
    return (
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex flex-row justify-start items-center gap-4">
          <span className="w-min max-w-[400px] text-muted-foreground text-sm truncate">{oldValue}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="max-w-[400px] font-medium text-primary text-sm truncate">{newValue}</span>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-0">
        {renderField(
          <Box className="w-4 h-4 text-primary" />,
          "Nombre",
          provider.name,
          name,
          nameState.isDirty
        )}
        {renderField(
          <Link2 className="w-4 h-4 text-primary" />,
          "URL",
          provider.url,
          url,
          urlState.isDirty
        )}
        <div className="flex justify-end gap-3 p-4">
          <Button variant="destructive" onClick={() => {
            setIsOpen(false)
          }}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleSubmit()
              form.reset({
                name: form.getValues("name"),
                url: form.getValues('url')
              })
            }}
            autoFocus
            className="w-full sm:w-auto"
          >
            <Check className="w-4 h-4" />
            Confirmar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
