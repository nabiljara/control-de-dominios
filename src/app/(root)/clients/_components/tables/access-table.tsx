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

import {
  Globe,
  KeySquare,
  Package,
  StickyNote,
  User
} from "lucide-react"
import Link from "next/link"
import { DeleteAccessModal } from "@/components/access/delete-access-modal"
import { AccessWithRelations, Provider } from "@/db/schema"
import { CreateAccessModal } from "@/components/create-access-modal"
import { Button } from "@/components/ui/button"
import Plus from "@/components/plus"
import { UsernameCopy } from "../username-copy"
import { PasswordCell } from "../password-cell"
import { decryptPassword } from "@/actions/accesses-actions"

export default function AccessTable({
  access,
  providers,
  client
}: {
  access: Omit<AccessWithRelations, 'client'>[];
  providers: Provider[];
  client: { id: number, name: string }
}) {

  return (
    <Card>
      <CardHeader className="flex">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10">
                <KeySquare className="w-6 h-6 text-primary" />
              </div>
              Accesos
            </CardTitle>
            <CardDescription>
              Información de los accesos del cliente
            </CardDescription>
          </div>
          <CreateAccessModal
            providers={providers}
            client={client}
            pathToRevalidate={`/clients/${client.id}`}
          >
            <Button
              variant="default"
              className="gap-3 px-2 lg:px-3 h-8"
            >
              <div className="relative">
                <KeySquare />
                <Plus />
              </div>
              Nuevo acceso
            </Button>
          </CreateAccessModal>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proveedor</TableHead>
              <TableHead>URL Proveedor</TableHead>
              <TableHead>
                Usuario / Email
              </TableHead>
              <TableHead>Contraseña</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {access.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay accesos asociados al cliente.
                </TableCell>
              </TableRow>
            ) : (
              access.map(async (access, index) => {
                try {
                  access.password = await decryptPassword(access.password)
                } catch (error) {
                  console.error("Error al desencriptar la contraseña")
                  access.password = "Contraseña mal generada"
                }                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Package className="opacity-70 mr-2 w-4 h-4" />
                        {access.provider?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={access.provider?.url ? access.provider?.url : '#'}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex justify-center items-center w-min h-full underline"
                      >
                        <Globe className="opacity-70 mr-2 w-4 h-4" />
                        {access.provider?.url}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="opacity-70 mr-2 w-4 h-4" />
                        <UsernameCopy username={access.username} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <PasswordCell password={access.password} show={access.password === 'Contraseña mal generada'} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <StickyNote className="opacity-70 mr-2 w-4 h-4" />
                        {access.notes ? access.notes : "Sin notas"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center ml-3">
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
  )
}
