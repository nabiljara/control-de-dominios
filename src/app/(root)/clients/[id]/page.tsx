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
  Eye,
  Globe,
  Mail,
  Package,
  Phone,
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
import { getProviders } from "@/actions/provider-actions"
import { CreateContactModal } from "../../contacts/_components/create-contact-modal"
import { CreateAccessModal } from "../../../../components/access/create-access-modal"
import { DeleteAccessModal } from "@/components/access/delete-access-modal"
import { EntityNotFound } from "@/components/entity-not-found"

export default async function ClientPage({
  params
}: {
  params: { id: number }
}) {
  const clientId = Number(params.id)
  const entityNotFound =
    <EntityNotFound
      icon={<User className="w-12 h-12 text-gray-400" />}
      title="Cliente no encontrado"
      description="Lo sentimos, no pudimos encontrar el cliente que estás buscando. Es posible que la URL proporcionada no sea válida o que el cliente haya sido eliminado."
      href="/clients"
      linkText="Volver al listado de clientes"
    />

  if (isNaN(clientId)) {
    return entityNotFound
  }
  const client = await getClient(params.id)

  if (!client) {
    return entityNotFound
  }

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
      <div className="gap-6 grid md:grid-rows">
        <Card>
          <CardHeader className="flex">
            <div className="flex justify-between items-center">
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
                      <div className="flex justify-center items-center">
                        <Mail className="opacity-70 mr-2 w-4 h-4" />
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Phone className="opacity-70 mr-2 w-4 h-4" />
                        {contact.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Tag className="opacity-70 mr-2 w-4 h-4" />
                        {contact.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
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
                      <div className="flex justify-center items-center">
                        <Calendar className="opacity-70 mr-2 w-4 h-4" />
                        {formatDate(contact.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Calendar className="opacity-70 mr-2 w-4 h-4" />
                        {formatDate(contact.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Link
                        className="flex justify-center items-center text-center"
                        href={`/contacts/${contact.id}`}
                      >
                        <Eye className="opacity-70 mr-2 w-4 h-4" />
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
            <div className="flex justify-between items-center">
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
                  <TableHead className="text-center">Acción</TableHead>
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
                          <div className="flex justify-center items-center">
                            <Package className="opacity-70 mr-2 w-4 h-4" />
                            {access.provider?.name}
                          </div>
                        </TableCell>
                        <TableCell className="flex justify-center">
                          <Link
                            href={
                              access.provider?.url.startsWith("http://") ||
                                access.provider?.url.startsWith("https://")
                                ? access.provider?.url
                                : `https://${access.provider?.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="flex justify-center items-center w-min underline"
                          >
                            <Globe className="opacity-70 mr-2 w-4 h-4" />
                            {access.provider?.url}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center">
                            <User className="opacity-70 mr-2 w-4 h-4" />
                            <UsernameCopy username={access.username} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <PasswordCell password={password ? password : ""} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center">
                            <StickyNote className="opacity-70 mr-2 w-4 h-4" />
                            {access.notes}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center">
                            <DeleteAccessModal access={access} />
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
                        <div className="flex justify- justify-center items-center">
                          <Globe className="opacity-70 mr-2 w-4 h-4" />
                          <Link
                            className="hover:underline cursor-pointer"
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
                          className="hover:underline cursor-pointer"
                          href={`/providers/${domain.provider.id}`}
                        >
                          {domain.provider.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(domain.expirationDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(domain.updatedAt)}
                      </TableCell>
                      <TableCell className="flex justify-center items-center">
                        <Link
                          className="flex justify-center items-center text-center"
                          href={`/domains/${domain.id}`}
                        >
                          <Eye className="opacity-70 mr-2 w-4 h-4" />
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
