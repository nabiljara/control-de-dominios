"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Save, Building, Loader2 } from "lucide-react"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { insertProvider } from "@/actions/provider-actions"
import { toast } from "sonner"
import { ProviderInsert } from "@/db/schema"

const formSchema = z.object({
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  url: z.string().refine((url) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url), {
    message: "URL inválida"
  })
})

// type FormValues = z.infer<typeof formSchema>;

interface CreateProviderFormProps {
  onSuccess: () => void
}

export function CreateProviderForm({ onSuccess }: CreateProviderFormProps) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ProviderInsert>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: ""
    }
  })

  const onSubmit = () => {
    setIsConfirmationModalOpen(true)
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    const toastLoading = toast.loading("Cargando...")
    try {
      const formData = form.getValues()
      await insertProvider(formData)
      setIsConfirmationModalOpen(false)
      form.reset()
      toast.dismiss(toastLoading)
      setIsLoading(false)
      toast.success("Proveedor ingresado correctamente")
      onSuccess()
    } catch (error) {
      if (error instanceof Error) {
        toast.dismiss(toastLoading)
        setIsLoading(false)
        if (error instanceof z.ZodError) {
          toast.error("Error al ingresar los datos ", {
            description: error.message
          })
        } else {
          toast.error("Error al registrar proveedor ", {
            description: error.message
          })
        }
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del proveedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL *</FormLabel>
                <FormControl>
                  <Input placeholder="URL. (Ej: ejemplo.com)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Registrar Proveedor
          </Button>
        </form>
      </Form>

      <Dialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          {/* <Toaster /> */}
          <DialogHeader>
            <DialogTitle>Confirmar Registro de Proveedor</DialogTitle>
            <DialogDescription>
              Por favor, revise la información del proveedor antes de confirmar
              el registro.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">Nombre:</span>{" "}
                    {form.getValues().name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">URL:</span>{" "}
                    {form.getValues().url}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsConfirmationModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Confirmar Registro"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
