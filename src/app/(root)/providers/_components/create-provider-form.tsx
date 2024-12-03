"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as z from "zod";
import { useState } from "react";
import { insertProvider } from "@/actions/provider-actions";
const formSchema = z.object({
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  url: z.string().refine((url) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url), {
    message: "URL inválida",
  }),
});
type FormValues = z.infer<typeof formSchema>;

export const CreateProviderForm = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsConfirmationModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const formData = { ...form.getValues() };
      await insertProvider(formData);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Errores de validación:", error.errors);
      } else {
        console.error("Error al insertar proveedor:", error);
      }
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-4xl space-y-8"
        >
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
            <Save className="h-4 w-4" />
            Registrar Proveedor
          </Button>

          <Dialog
            open={isConfirmationModalOpen}
            onOpenChange={setIsConfirmationModalOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirmar Registro de Cliente</DialogTitle>
                <DialogDescription>
                  Por favor, revise la información del cliente antes de
                  confirmar el registro.
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
                <Button type="button" onClick={handleFinalSubmit}>
                  Confirmar Registro
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
};
