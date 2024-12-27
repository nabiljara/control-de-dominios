"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { AccessType } from "@/validators/client-validator"
import { Textarea } from "@/components/ui/textarea"
import { PasswordInput } from "@/components/password-input"
import { ClientWithRelations, Provider } from "@/db/schema"
import { ResponsiveDialog } from "../responsive-dialog"
import { accessesSchema } from "@/validators/client-validator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog"
import { KeySquare, Plus } from "lucide-react"
import { insertAccess } from "@/actions/accesses-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CreateAccessModalProps {
  onSave?: (access: AccessType) => void
  accessSchema?: z.Schema
  providers: Provider[]
  onClose?: () => void
  provider?: { id: string; name: string } | undefined
  client?: Omit<ClientWithRelations, "access" | "contacts">
  from?: string
}

export function CreateAccessModal({
  onSave,
  accessSchema,
  providers,
  onClose,
  provider,
  client,
  from
}: CreateAccessModalProps) {
  const [isPending, setIsPending] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const form = useForm<AccessType>({
    resolver: zodResolver(accessSchema ? accessSchema : accessesSchema),
    defaultValues: {
      provider: { id: provider?.id, name: provider?.name },
      username: "",
      password: "",
      notes: ""
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsPending(true)
    const isValid = await form.trigger()
    if (isValid) {
      const data = form.getValues()
      if (onSave) {
        onSave(data)
        form.reset()
      } else if (client) {
        try {
          const response = await insertAccess(data, client.id)
          if (response) {
            toast.success("Acceso agregado correctamente.")
            setIsModalOpen(false)
            router.push("/clients/" + client.id)
          }
        } catch (error) {
          toast.error("Error al agregar el acceso.")
          throw error
        }
      }
      setIsModalOpen(false)
    }
    setIsPending(false)
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {from === "clients-create" ? (
          <div className="flex items-center gap-8">
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Accesos
            </span>
            <Button
              aria-labelledby="button-label"
              type="button"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus />
            </Button>
          </div>
        ) : from === "domains-create" ? (
          <Button
            aria-labelledby="button-label"
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="h-36 w-full [&_svg]:size-9"
          >
            <Plus className="text-gray-700" />
          </Button>
        ) : (
          <Button
            variant="default"
            className="h-8 px-2 lg:px-3"
            onClick={() => setIsModalOpen(true)}
          >
            Nuevo Acceso
            <KeySquare className="ml-2 h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo acceso</DialogTitle>
          <DialogDescription>
            Agregue los datos correspondientes al acceso.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="provider.id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Proveedor <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      const selectedProvider = providers.find(
                        (provider) => provider.id.toString() === value
                      )
                      if (selectedProvider) {
                        form.setValue("provider.name", selectedProvider.name)
                      }
                    }}
                    defaultValue={provider ? provider.id : undefined}
                    disabled={provider !== undefined}
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
                          key={provider.url}
                          value={provider.id.toString()}
                        >
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre de usuario o email{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese el usuario o email del cliente"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Ingrese la contraseña"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Agregando..." : "Agregar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
