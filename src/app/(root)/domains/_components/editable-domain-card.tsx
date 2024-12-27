"use client"

import { useState } from "react"
import { CalendarIcon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { addDays, format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Client,
  DomainWithRelations,
  Provider
} from "@/db/schema"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  domainFormSchema,
  DomainFormValues
} from "@/validators/client-validator"
import { validateDomainName } from "@/actions/domains-actions"
import { z } from "zod"
import DomainInfoCard from "./domain-info-card"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"

interface EditableDomainCardProps {
  domain: DomainWithRelations
  clients: Client[]
  providers: Provider[]
}

export default function EditableDomainCard({
  domain,
  clients,
  providers
}: EditableDomainCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  // const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const statusOptions = domainFormSchema.shape.status.options;

  const getDomainSchema = () => {
    return domainFormSchema.superRefine(
      async (data, ctx) => {
        const { contactId, name } = data;
        if (contactId === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El contacto es requerido.",
            path: ["contactId"],
          });
        }

        const alreadyRegistered = await validateDomainName(name)
        if (!alreadyRegistered && name !== domain.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El nombre de dominio ya está registrado en el sistema.",
            path: ["name"],
          });
        }
      }
    )
  };

  const newDomainSchema = getDomainSchema()

  const form = useForm<z.infer<typeof newDomainSchema>>({
    resolver: zodResolver(newDomainSchema),
    defaultValues: {
      id: domain.id,
      name: domain.name,
      provider: { id: domain.provider.id.toString(), name: domain.provider.name },
      client: { id: domain.client.id.toString(), name: domain.client.name },
      expirationDate: new Date(domain.expirationDate),
      status: domain.status,
      contactId: domain.contactId.toString(),
    },
  })

  const onSubmit: SubmitHandler<DomainFormValues> = () => {
    const data = form.getValues()
    console.log('DATA:', data);
    // setIsConfirmationModalOpen(true)
  }


  return (
    <>
      <div className="flex justify-end items-center space-x-2">
        <span>Editar</span>
        <Switch
          checked={isEditing}
          onCheckedChange={setIsEditing}
          aria-label="Habilitar edición"
        />
      </div>
      {isEditing ? (
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-row items-center gap-2">
                  <Globe className="w-8 h-8" />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ingrese el nombre del cliente"
                            autoComplete="name"
                            className="h-auto font-bold text-3xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-3">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="text-muted-foreground text-sm">
                          Estado:
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {
                              statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provider.id"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="text-muted-foreground text-sm">
                          Proveedor:
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            const selectedLocality = providers.find(
                              (provider) => provider.id.toString() === value
                            )
                            if (selectedLocality) {
                              form.setValue(
                                "provider.name",
                                selectedLocality.name
                              )
                            }
                          }}
                          defaultValue={field.value}
                          name="provider"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el proveedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {providers.map((provider) => (
                              <SelectItem
                                key={provider.name}
                                value={provider.id.toString()}
                              >
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client.id"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="text-muted-foreground text-sm">
                          Cliente:
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between m-0",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? clients.find(
                                    (client) => client.id.toString() === field.value
                                  )?.name
                                  : "Seleccionar cliente"}
                                <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[200px]">
                            <Command>
                              <CommandInput placeholder="Buscar cliente..." />
                              <CommandList>
                                <CommandEmpty>Ningún cliente encontrado.</CommandEmpty>
                                <CommandGroup>
                                  {clients.map((client) => (
                                    <CommandItem
                                      value={client.name}
                                      key={client.id}
                                      onSelect={() => {
                                        field.onChange(client.id.toString());
                                        form.setValue("client.name", client.name)
                                      }}
                                    >
                                      {client.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          client.id.toString() === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Vencimiento <span className="text-red-500">*</span></FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione una fecha</span>
                                )}
                                <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              mode="single"
                              fromDate={addDays(new Date(), 1)}
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              locale={es}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEditing && form.formState.isDirty && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          form.reset()
                          setIsEditing(false)
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          {/* <ResponsiveDialog
    open={isConfirmationModalOpen}
    onOpenChange={setIsConfirmationModalOpen}
    title="Confirmar edición del cliente"
    description="Revise si los datos modificados son correctos y confirme el cambio."
    className="sm:max-w-[700px]"
  >
    <EditConfirmationModal
      handleSubmit={handleFinalSubmit}
      form={form}
      client={client}
      contacts={contacts}
    />
  </ResponsiveDialog> */}
        </Card >
      ) : (
        <DomainInfoCard domain={domain} />
      )}
    </>
  )
}
