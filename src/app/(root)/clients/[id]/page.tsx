import { decryptPassword } from "@/lib/utils"
import { getClient } from "@/actions/client-actions"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import {
  Calendar,
  Contact,
  Eye,
  Globe,
  Mail,
  Package,
  Phone,
  Shield,
  StickyNote,
  Tag,
  User
} from "lucide-react"
import Link from "next/link"
import { PasswordCell } from "../_components/password-cell"
import { UsernameCopy } from "../_components/username-copy"
import EditableClientCard from "../_components/editable-client-card"
import { ClientWithRelations } from "@/db/schema"
import { getLocalities } from "@/actions/locality-actions"
import { getContactsByClient } from "@/actions/contacts-actions"
import { getProviders } from "@/actions/provider-actions"

import { CreateContactModal } from "../../contacts/_components/create-contact-modal"
import { CreateAccessModal } from "../../../../components/access/create-access-modal"
import { accessesSchema } from "@/validators/client-validator"

export default async function ClientPage({
  params
}: {
  params: { id: number }
}) {
  const client = await getClient(params.id)
  const contacts = await getContactsByClient(params.id)

  // const saveAccess = async () => {
  //   console.log("SAVE")
  // }
  if (client) {
    const { access, contacts, ...clientWithoutRelations } = client
    const clientWithoutRelationsTyped = clientWithoutRelations as Omit<
      ClientWithRelations,
      "access" | "contacts"
    >
    const localities = await getLocalities()
    const providers = await getProviders()

    return (
      <div className="space-y-4 p-8">
        <EditableClientCard
          client={clientWithoutRelationsTyped}
          localities={localities}
          contacts={contacts}
        />
        <div className="md:grid-rows grid gap-6">
          <Card>
            <CardHeader className="flex">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contactos</CardTitle>
                  <CardDescription>
                    Información de los contactos del cliente
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <CreateContactModal
                    from="clients"
                    client={clientWithoutRelationsTyped}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Nombre</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Teléfono</TableHead>
                    <TableHead className="text-center">Tipo</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">
                      Fecha de registro
                    </TableHead>
                    <TableHead className="text-center">
                      Fecha de actualización
                    </TableHead>
                    <TableHead className="text-center">Ver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.contacts.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        {contact.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Mail className="mr-2 h-4 w-4 opacity-70" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Phone className="mr-2 h-4 w-4 opacity-70" />
                          {contact.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Tag className="mr-2 h-4 w-4 opacity-70" />
                          {contact.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Badge
                            variant={
                              contact.status === "Activo"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {contact.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          {formatDate(contact.updatedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Link
                          className="flex items-center justify-center text-center"
                          href={`/contacts/${contact.id}`}
                        >
                          <Eye className="mr-2 h-4 w-4 opacity-70" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Accesos</CardTitle>
                  <CardDescription>
                    Información de los accesos del cliente
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <CreateAccessModal
                    providers={providers}
                    client={clientWithoutRelationsTyped}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Proveedor</TableHead>
                    <TableHead className="text-center">URL Proveedor</TableHead>
                    <TableHead className="text-center">
                      Nombre de usuario
                    </TableHead>
                    <TableHead className="text-center">Contraseña</TableHead>
                    <TableHead className="text-center">Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.access.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay accesos
                      </TableCell>
                    </TableRow>
                  ) : (
                    client.access.map((access, index) => {
                      const password = decryptPassword(access.password)
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Package className="mr-2 h-4 w-4 opacity-70" />
                              {access.provider?.name}
                            </div>
                          </TableCell>
                          <TableCell className="flex justify-center">
                            <Link
                              href={`https://${access.provider?.url}`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="flex w-min items-center justify-center underline"
                            >
                              <Globe className="mr-2 h-4 w-4 opacity-70" />
                              {access.provider?.url}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <User className="mr-2 h-4 w-4 opacity-70" />
                              <UsernameCopy username={access.username} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <PasswordCell password={password ? password : ""} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <StickyNote className="mr-2 h-4 w-4 opacity-70" />
                              {access.notes}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dominios</CardTitle>
              <CardDescription>Dominios asociados al cliente</CardDescription>
            </CardHeader>
            <CardContent className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Dominio</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Proveedor</TableHead>
                    <TableHead className="text-center">
                      Fecha de expiración
                    </TableHead>
                    <TableHead className="text-center">
                      Ultima modificación
                    </TableHead>
                    <TableHead className="text-center">Ver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.domains.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay dominios asociados
                      </TableCell>
                    </TableRow>
                  ) : (
                    client.domains.map((domain, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          <div className="justify- flex items-center justify-center">
                            <Globe className="mr-2 h-4 w-4 opacity-70" />
                            <Link
                              className="cursor-pointer hover:underline"
                              href={`/domains/${domain.id}`}
                            >
                              {domain.name}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {domain.status}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            className="cursor-pointer hover:underline"
                            href={`/providers/${domain.provider.id}`}
                          >
                            {domain.provider.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(
                            domain.expirationDate as string
                          ).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: false
                          })}
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(domain.updatedAt as string).toLocaleString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false
                            }
                          )}
                        </TableCell>
                        <TableCell className="flex items-center justify-center">
                          <Link
                            className="flex items-center justify-center text-center"
                            href={`/domains/${domain.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4 opacity-70" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  // TODO: Mejorar
  return (
    <div>
      <h1>Cliente no encontrado</h1>
      <p>El cliente con el ID {params.id} no existe o no está disponible.</p>
    </div>
  )
}
