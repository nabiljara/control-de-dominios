"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Save } from "lucide-react"
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
import { insertProvider, validateProvider } from "@/actions/provider-actions"
import { toast } from "sonner"
import { ProviderFormValues } from "@/validators/zod-schemas"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { CreateProviderConfirmationModal } from "./create-provider-confirmation-modal"
import { providerSchema } from "@/validators/zod-schemas"

interface CreateProviderFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function CreateProviderForm({
  setIsOpen
}: CreateProviderFormProps) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      url: ""
    },
    mode: "onSubmit",
  })

  const onSubmit = async () => {
    try {
      const errorList = await validateProvider(form.getValues('name'), form.getValues('url'), undefined, undefined);
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
    } catch (error) {
      toast.error('No se pudo validar el proveedor correctamente.')
      console.log(error);
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await insertProvider(form.getValues());
          resolve();
          setIsConfirmationModalOpen(false);
          setIsOpen(false)
        } catch (error) {
          console.error(error)
          reject(error);
        }
        finally {
          setIsSubmitting(false)
        }
      }),
      {
        loading: 'Registrando proveedor.',
        success: 'Proveedor registrado satisfactoriamente.',
        error: 'No se pudo registrar el proveedor correctamente.'
      }
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese el nombre del proveedor" {...field} />
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
                <FormLabel>URL <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="https://dominio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2 w-full">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              <Save className="w-5 h-5" />
              Registrar proveedor
            </Button>
          </div>
        </form>
      </Form>
      <ResponsiveDialog
        open={isConfirmationModalOpen}
        onOpenChange={setIsConfirmationModalOpen}
        title='Confirmar registro.'
        description='Revise que los datos sean correctos y confirme el registro.'
        className="md:max-w-fit"
      >
        <CreateProviderConfirmationModal
          handleSubmit={handleFinalSubmit}
          name={form.getValues('name')}
          url={form.getValues('url')}
          isSubmitting={isSubmitting}
          setIsConfirmationModalOpen={setIsConfirmationModalOpen} />
      </ResponsiveDialog>
    </>
  )
}
