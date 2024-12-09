"use client"
import { getContact } from "@/actions/contacts-actions"
import { Toaster, toast } from "sonner"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

interface Contact {
  id: number
  name: string
  status: "active" | "inactive" | null
  createdAt: string
  updatedAt: string
  type: "technical" | "administrative" | "financial" | null
  clientId: number | null
  email: string
  phone: string
  domains: {
    name: string
    expirationDate: string
    provider: {
      name: string
    }
  }[]
  client: {
    name: string
  } | null
}
export default function ContactDetailsPage({
  params
}: {
  params: { id: number }
}) {
  const [contact, setContact] = useState<Contact | undefined>(undefined)
  const fetchContact = async () => {
    try {
      const con = await getContact(params.id)
      setContact(con)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        toast.error("Error al obtener proveedor", { description: e.message })
      }
    }
  }

  useEffect(() => {
    fetchContact()
  }, [])

  return (
    <>
      <Toaster richColors />
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Contacto</h2>
          </div>
        </div>
        {contact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-md block font-medium text-gray-700"
                >
                  Nombre
                </label>
                <div>{contact.name}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Email
                </label>
                <div>{contact.email}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <div>{contact.phone}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Tipo
                </label>
                <div>{contact.type}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Estado
                </label>
                <div>{contact.status}</div>
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="text-md block font-medium text-gray-700"
                >
                  Cliente
                </label>
                <div>{contact.client?.name ?? "Sin cliente asociado"}</div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Dominios asociados</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dominio</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Fecha de expiración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contact.domains.length === 0 ? (
                    <TableRow>
                      <TableCell>No hay dominios asociados</TableCell>
                    </TableRow>
                  ) : (
                    contact.domains.map((con) => (
                      <TableRow key={con.name}>
                        <TableCell>{con.name}</TableCell>
                        <TableCell>{con.provider.name}</TableCell>
                        <TableCell>
                          {new Date(
                            con.expirationDate as string
                          ).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
