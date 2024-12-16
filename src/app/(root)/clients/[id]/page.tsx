import { decryptPassword } from "@/lib/utils"
import { getClient } from "@/actions/client-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Calendar, Eye, Globe, Mail, Package, Phone, StickyNote, Tag, User } from 'lucide-react'
import Link from "next/link"
import { PasswordCell } from "../_components/password-cell"
import { UsernameCopy } from "../_components/username-copy"
import EditableClientCard from "../_components/editable-client-card"
import { ClientWithRelations } from "@/db/schema"
import { getLocalities } from "@/actions/locality-actions"

export default async function ClientPage({ params }: { params: { id: number } }) {
  const client = await getClient(params.id)

  if (client) {
    const { access, domains, contacts, ...clientWithoutRelations } = client;
    const clientWithoutRelationsTyped = clientWithoutRelations as Omit<ClientWithRelations, 'domains' | 'access' | 'contacts'>;
    const localities = await getLocalities()
    return (
      <div className="space-y-4 p-8">
        <EditableClientCard
          client={clientWithoutRelationsTyped}
          localities={localities}
        />
        <div className="gap-6 grid md:grid-rows">
          <Card>
            <CardHeader>
              <CardTitle>Contactos</CardTitle>
              <CardDescription>Información de los contactos del cliente</CardDescription>
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
                    <TableHead className="text-center">Fecha de registro</TableHead>
                    <TableHead className="text-center">Fecha de actualización</TableHead>
                    <TableHead className="text-center">Ver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.contacts.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{contact.name}</TableCell>
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
                          <Badge variant={contact.status === "Activo" ? "default" : "destructive"}>
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
                      <TableCell>
                        <Link href={`/contacts/${contact.id}`}>
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
            <CardHeader>
              <CardTitle>Accesos</CardTitle>
              <CardDescription>Información de los accesos del cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Proveedor</TableHead>
                    <TableHead className="text-center">URL Proveedor</TableHead>
                    <TableHead className="text-center">Nombre de usuario</TableHead>
                    <TableHead className="text-center">Contraseña</TableHead>
                    <TableHead className="text-center">Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.access.map((access, index) => {
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
                            href={`https://${access.provider?.url}`}
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
                          <PasswordCell password={password ? password : ''} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center">
                            <StickyNote className="opacity-70 mr-2 w-4 h-4" />
                            {access.notes}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* TODO : TABLA DE DOMINIOS */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Dominios</CardTitle>
              <CardDescription>Dominios asociados al cliente</CardDescription>
            </CardHeader>
            <CardContent className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Contraseña</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.domains.map((domain, index) => (
                    <TableRow key={index}>
                      <TableCell>{domain.clientId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Shield className="opacity-70 mr-2 w-4 h-4" />
                          {domain.name}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}
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