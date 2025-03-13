import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Client, ClientWithRelations, Contact } from "@/db/schema"
import {
  clientUpdateFormSchema,
  ClientUpdateValues,
  domainFormSchema
} from "@/validators/client-validator"
import { useEffect, useState } from "react"
// import { getContactsByClient } from "@/actions/contacts-actions"
import {
  Controller,
  Form,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn
} from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import { domainStatus, statusConfig } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Globe, Mail } from "lucide-react"
import { getActiveContactsByClientId } from "@/actions/contacts-actions"

interface UpdateDomainProps {
  clients: Client[]
  contacts: Contact[]
  individualContacts: Contact[]
  clientId: number
  form: UseFormReturn<Omit<ClientUpdateValues, "accesses" | "contacts">>
}

export function UpdateDomain({
  contacts,
  individualContacts,
  clients,
  clientId,
  form
}: UpdateDomainProps) {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [activeClientContacts, setActiveContactsClient] = useState<{ [key: number]: Contact[] }>(
    { [clientId]: contacts.filter((contact) => contact.status === 'Activo') }
  )

  const { control, setValue, formState } = form
  const domains = form.getValues('domains')

  const fetchActiveClientContacts = async (id: number) => {
    try {
      const activeContacts = await getActiveContactsByClientId(id)
      setActiveContactsClient((prevState) => ({
        ...prevState,
        [id]: activeContacts
      }))
    } catch (error) {
      console.error('Error al traer los contactos activos del cliente: ', error)
    }
  }

  useEffect(() => {
    if (selectedClientId !== null) {
      fetchActiveClientContacts(selectedClientId)
    }
  }, [selectedClientId])

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="space-y-2 w-full">
        {domains && domains.map((domain, index) => {
          const hasError = formState.errors.domains?.[index]
          return (
            <AccordionItem
              key={domain.id}
              value={domain.id?.toString() || ''}
              className={`rounded-lg border px-2 ${hasError ? "border-red-500" : "border-gray-300"}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center gap-4 w-full">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span className="font-normal text-sm">{domain.name}</span>
                  </div>
                  <Badge
                    variant='outline'
                    className={statusConfig[domain.status].color}
                  >
                    {domain.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-4">
                <div className="-mx-4 mb-4 border-gray-200 border-t" />
                <div className="gap-4 grid">
                  {/* ESTADO */}
                  <Controller
                    control={control}
                    name={`domains.${index}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.trigger()
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {domainStatus.map((status) => (
                              <SelectItem key={status} value={status} className="hover:bg-muted cursor-pointer">
                                <Badge 
                                variant='outline'
                                className={statusConfig[status].color}
                                >
                                  {status}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {/* CLIENTES */}
                  <Controller
                    control={control}
                    name={`domains.${index}.client.id`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedClientId(parseInt(value))
                            const selectedClient = clients.find(
                              (cl) => cl.id.toString() === value
                            )
                            if (selectedClient) {
                              setValue(
                                `domains.${index}.client.name`,
                                selectedClient.name
                              )
                              setValue(
                                `domains.${index}.contactId`,
                                ''
                              )
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((cl) => (
                              <SelectItem
                                key={cl.id}
                                value={cl.id.toString()}
                                className="hover:bg-muted cursor-pointer"
                              >
                                {cl.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <p className="mt-1 text-red-500 text-sm">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  {/* CONTACTO */}
                  <Controller
                    control={control}
                    name={`domains.${index}.contactId`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Contacto</FormLabel>
                        <Select
                          defaultValue={`domains.${index}.contactId`}
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar contacto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <div className="px-2 font-semibold text-gray-500 text-sm">
                                Contactos de {domain.client.name}
                              </div>
                              {activeClientContacts[Number(domain.client.id)]?.length > 0 ? (
                                <SelectGroup>
                                  {
                                    activeClientContacts[Number(domain.client.id)].map((contact) => (
                                      <SelectItem
                                        key={contact.id}
                                        value={contact.id.toString()}
                                        className="hover:bg-muted cursor-pointer"
                                      >
                                        <div>
                                          <p className="font-medium text-sm text-left">{contact.name}</p>
                                          <p className="flex items-center text-gray-500 text-xs">
                                            <Mail className="mr-1 w-3 h-3 shrink-0" />
                                            {contact.email}
                                          </p>
                                        </div>
                                      </SelectItem>
                                    )
                                    )
                                  }
                                </SelectGroup>
                              ) : (
                                <span className='ml-2 text-destructive text-xs'>No hay contactos activos.</span>
                              )}
                            </SelectGroup>
                            <div className="my-2 border-gray-200 border-t" />
                            <div className="px-2 font-semibold text-gray-500 text-sm">
                              Contactos individuales
                            </div>
                            {individualContacts && individualContacts.length > 0 ? (
                              <SelectGroup>
                                {
                                  individualContacts
                                    .map((contact) => (
                                      <SelectItem
                                        key={contact.id}
                                        value={contact.id.toString()}
                                        className="hover:bg-muted cursor-pointer"
                                      >
                                        <div>
                                          <p className="font-medium text-sm text-left">{contact.name}</p>
                                          <p className="flex items-center text-gray-500 text-xs">
                                            <Mail className="mr-1 w-3 h-3 shrink-0" />
                                            {contact.email}
                                          </p>
                                        </div>
                                      </SelectItem>
                                    )
                                    )
                                }
                              </SelectGroup>
                            ) : (
                              <span className='ml-2 text-destructive text-xs'>No hay contactos activos.</span>
                            )}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <p className="mt-1 text-red-500 text-sm">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
