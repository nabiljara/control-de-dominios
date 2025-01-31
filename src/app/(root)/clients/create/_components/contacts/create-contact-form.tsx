'use client'
import { useState } from 'react'
import { useForm, } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { ContactType } from '@/validators/client-validator'
import { Badge } from '@/components/ui/badge'
import { contactStatus, contactTypes, statusConfig } from '@/constants'

export function CreateContactForm({
  onSave,
  contactSchema,
  onClose,
}: {
  onSave: (contact: ContactType) => void;
  contactSchema: z.Schema;
  onClose?: () => void;
}) {

  const [isPending, setIsPending] = useState(false)

  const form = useForm<ContactType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: undefined,
      type: undefined
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre del contacto" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ingrese el email del contacto" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor='phone'
              >
                Teléfono
              </FormLabel>
              <FormControl>
                <PhoneInput
                  inputStyle={{
                    width: '100%',
                    height: '2.5rem',
                    borderRadius: '0.375rem',
                    borderColor:
                      'rgb(226 232 240)',
                    paddingLeft: '60px'
                  }}
                  buttonStyle={{
                    backgroundColor:
                      'rgb(255 255 255)',
                    borderColor:
                      'rgb(226 232 240)'
                  }}
                  country={'ar'}
                  preferredCountries={[
                    'ar',
                    'us',
                    'br'
                  ]}
                  countryCodeEditable={true}
                  value={field.value}
                  onChange={(value) => {
                    if (value.length <= 0) {
                      field.onChange(undefined);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  inputProps={{
                    name: 'phone',
                    id: 'phone',
                    placeholder:
                      'Escribe tu número',
                    autoComplete: "phone"
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }}
                  autoFormat={false}
                  enableSearch={true}
                  disableSearchIcon={true}
                  searchPlaceholder={'Buscar'}
                  searchNotFound={
                    'No hay resultados'
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} name='type'>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    contactTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} name='state'>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contactStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={statusConfig[status].color}>
                          {status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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