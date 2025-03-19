"use client"
import { updateProvider, validateProvider } from "@/actions/provider-actions"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Provider } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ProviderFormValues, providerSchema } from "@/validators/zod-schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Box, ExternalLink, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { EditProviderConfirmationModal } from "./edit-provider-confirmation-modal"
import Link from "next/link"

interface EditableProviderCardProps {
  provider: Provider
}

export default function EditableProviderCard({
  provider
}: EditableProviderCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: provider.name,
      url: provider.url,
      id: provider.id
    },
  })

  const onSubmit = async () => { //Primer submit para validar el formulario
    try {
      setIsSubmitting(true)
      const isValid = await form.trigger() //ejecuto validación manual
      if (isValid) {
        const errorList = await validateProvider(form.getValues('name'), form.getValues('url'), provider.name, provider.url);
        if (errorList.length > 0) {
          errorList.forEach((error) => {
            form.setError(error.field, {
              type: "manual",
              message: error.message,
            });
          });
          return;
        }
        setIsConfirmationModalOpen(true)
        setIsSubmitting(false)
      }
    } catch (error) {
      toast.error('No se pudo registrar el proveedor correctamente.')
      console.log(error);
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          setIsConfirmationModalOpen(false);
          setIsEditing(false)
          await updateProvider(form.getValues());
          resolve();
          form.reset({
            name: form.getValues("name"),
            url: form.getValues("url"),
          })
        } catch (error) {
          console.error(error)
          reject(error);
        } finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: 'Editando proveedor.',
        success: 'Proveedor editado satisfactoriamente.',
        error: 'No se pudo editar el proveedor correctamente.'
      }
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Box className="w-8 h-8 shrink-0" />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      {isEditing ? (
                        <FormControl>
                          <Input {...field} placeholder="Ingrese el nombre del proveedor" autoComplete="name" className="h-auto font-bold text-3xl" />
                        </FormControl>
                      ) : (
                        <CardTitle className="font-bold text-3xl">{provider.name}</CardTitle>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>Editar</span>
                <Switch
                  checked={isEditing}
                  onCheckedChange={setIsEditing}
                  aria-label="Habilitar edición"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col items-start gap-3">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem
                      className="flex items-center w-72 col">
                      {isEditing ? (
                        <FormControl>
                          <div className="flex flex-col items-center gap-3 w-full">
                            <div className="flex items-center w-full">
                              <ExternalLink className="mr-2 text-blue-500" />
                              <Input {...field} placeholder="Ingrese el nombre del proveedor" autoComplete="name" className="text-blue-500" />
                            </div>
                            <FormMessage />
                          </div>
                        </FormControl>
                      ) : (
                        <Link href={provider.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                          <ExternalLink className="mr-2 shrink-0" />
                          {provider.url}
                        </Link>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            {isEditing && form.formState.isDirty && (
              <div className="flex justify-end gap-2 m-4">
                <Button type="reset" variant="destructive" onClick={() => {
                  form.reset()
                  setIsEditing(false)
                }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </Button>
              </div>
            )}
          </Card>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem
                className="flex items-center w-72 col">
                <Input type="hidden" {...field} />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <ResponsiveDialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
        title='Confirmar edición del proveedor'
        description='Revise si los datos modificados son correctos y confirme el cambio.'
        className="md:max-w-fit"
      >
        <EditProviderConfirmationModal
          handleSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          form={form}
          provider={provider}
          setIsOpen={setIsConfirmationModalOpen}
        />
      </ResponsiveDialog>
    </>
  )
}
