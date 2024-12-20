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
import { ClientWithRelations, Contact } from "@/db/schema"
import {
  clientUpdateFormSchema,
  domainFormSchema
} from "@/validators/client-validator"
import { useEffect, useState } from "react"
import { getContactsByClient } from "@/actions/contacts-actions"
import {
  Controller,
  Form,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext
} from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"

interface DomainAccordionProps {
  client: Omit<ClientWithRelations, "access" | "contacts">
  clients: Omit<
    ClientWithRelations,
    "locality" | "domains" | "access" | "contacts"
  >[]
  contacts: Contact[]
  //   onUpdate: (domainId: string, data: Partial<Domain>) => void
}

export default function UpdateDomain({
  client,
  contacts,
  clients
  //   onUpdate
}: DomainAccordionProps) {
  const domainStatusOptions = domainFormSchema.shape.status.options
  const [selectedClientId, setSelectedClientId] = useState<number>(client.id)
  const [contactsClient, setContactsClient] = useState<Contact[]>(contacts)
  const activeDomains = client.domains.filter(
    (domain) => domain.status === "Activo"
  )

  const { control, register, setValue, formState } =
    useFormContext<z.infer<typeof clientUpdateFormSchema>>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "domains"
  })

  const fetchContacts = async (clientId: number) => {
    const contactsData = await getContactsByClient(clientId)
    setContactsClient(contactsData)
  }

  useEffect(() => {
    fetchContacts(selectedClientId)
  }, [selectedClientId])

  // const onSubmit = (data: z.infer<typeof domainArray>) => {
  //   console.log("Formulario enviado:", data)
  // }

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {fields.map((domain, index) => {
          const hasError = formState.errors.domains?.[index]
          return (
            <AccordionItem
              key={domain.id}
              value={domain.id}
              className={`mx-2 rounded-lg border px-2 ${hasError ? "border-red-500" : "border-gray-300"}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <span className="text-md font-medium">{domain.name}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      domain.status === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {domain.status}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 px-4">
                <div className="-mx-4 mb-4 border-t border-gray-200" />
                <div className="grid gap-4">
                  <Controller
                    control={control}
                    name={`domains.${index}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {domainStatusOptions.map((opt) => (
                              <SelectItem
                                key={opt}
                                value={opt}
                                className="hover:bg-gray-100"
                              >
                                {opt}
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
                            const selectedClient = clients.find(
                              (cl) => cl.id.toString() === value
                            )
                            setSelectedClientId(selectedClient?.id as number)
                            if (selectedClient) {
                              setValue(
                                `domains.${index}.client.name`,
                                selectedClient.name
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
                                className="hover:bg-gray-100"
                              >
                                {cl.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <p className="mt-1 text-sm text-red-500">
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
                            const selectedContact = contactsClient.find(
                              (contact) => contact.id.toString() === value
                            )
                            if (selectedContact) {
                              setValue(
                                `domains.${index}.contact.name`,
                                selectedContact.name
                              )
                              setValue(
                                `domains.${index}.contact.id`,
                                selectedContact.id.toString()
                              )
                              setValue(
                                `domains.${index}.contact.clientId`,
                                selectedContact.clientId as number
                              )
                              setValue(
                                `domains.${index}.contactId`,
                                selectedContact.id.toString()
                              )
                            }
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
                              <div className="px-2 text-sm font-semibold text-gray-500">
                                Contactos del cliente
                              </div>
                              {contactsClient
                                ?.filter((contact) => contact.clientId !== null)
                                .map((contact) => (
                                  <SelectItem
                                    key={contact.id}
                                    value={contact.id.toString()}
                                  >
                                    {contact.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                            <div className="my-2 border-t border-gray-200" />
                            <SelectGroup>
                              <div className="px-2 text-sm font-semibold text-gray-500">
                                Contactos individuales
                              </div>
                              {contactsClient
                                ?.filter((contact) => contact.clientId === null)
                                .map((contact) => (
                                  <SelectItem
                                    key={contact.id}
                                    value={contact.id.toString()}
                                  >
                                    {contact.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <p className="mt-1 text-sm text-red-500">
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
