'use client'
import { useState } from 'react'
import { useForm, } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccessType } from '@/validators/client-validator'
import { Textarea } from '@/components/ui/textarea'
import { PasswordInput } from '@/components/password-input'
import { Provider } from '@/db/schema'

export function CreateAccessForm({
  onSave,
  accessSchema,
  providers,
  onClose,
  providerId
}: {
  onSave: (access: AccessType) => void;
  accessSchema: z.Schema;
  providers: Provider[]
  onClose?: () => void;
  providerId?: string | undefined
}) {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<AccessType>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      provider: { id: undefined, name: undefined },
      username: '',
      password: '',
      notes: ''
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsPending(true)
    const isValid = await form.trigger()
    if (isValid) {
      const data = form.getValues()
      onSave(data)
      if (onClose) {
        onClose()
      }
    }
    setIsPending(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="provider.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                const selectedProvider = providers.find((provider) => provider.id.toString() === value);
                if (selectedProvider) {
                  form.setValue("provider.name", selectedProvider.name);
                }
              }}
                defaultValue={providerId ? providerId : undefined}
                disabled={providerId !== undefined}
                name='provider'
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el proveedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    providers.map((provider) => (
                      <SelectItem key={provider.url} value={provider.id.toString()}>{provider.name}</SelectItem>
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario o email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese el usuario o email del cliente" autoComplete="email" />
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
              <FormLabel>Contraseña <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Ingrese la contraseña" autoComplete="new-password" />
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
                  className='min-h-[100px] resize-none' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className='w-full'>
          {isPending ? 'Agregando...' : 'Agregar'}
        </Button>
      </form>
    </Form>
  )
}