import { getProvider } from "@/actions/provider-actions"
import { EntityNotFound } from "@/components/entity-not-found"
import { Box, Eye, Globe } from "lucide-react"
import EditableProviderCard from "../_components/editable-provider-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default async function ProviderDetailsPage({
  params
}: {
  params: { id: number }
}) {
  const providerId = Number(params.id)
  const entityNotFound =
    <EntityNotFound
      icon={<Box className="w-12 h-12 text-gray-400" />}
      title="Proveedor no encontrado"
      description="Lo sentimos, no pudimos encontrar el proveedor que estás buscando. Es posible que la URL proporcionada no sea válida o que el proveedor haya sido eliminado."
      href="/providers"
      linkText="Volver al listado de proveedores"
    />

  if (isNaN(providerId)) {
    return entityNotFound
  }

  const provider = await getProvider(providerId)
  if (!provider) {
    return entityNotFound
  }

  return (
    <div className="space-y-4 p-8">
      <EditableProviderCard provider={provider}/>
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
                {provider.domains.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No hay dominios asociados
                    </TableCell>
                  </TableRow>
                ) : (
                  provider.domains.map((domain, index) => (
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
  )
}
