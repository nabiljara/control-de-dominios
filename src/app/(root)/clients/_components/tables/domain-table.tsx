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
import { DomainWithRelations } from "@/db/schema"
import { formatDate } from "@/lib/utils"
import {
  Eye,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function DomainTable({
  domains
}:{
  domains: DomainWithRelations[]
}) {
  return (
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
          {domains.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay dominios asociados
              </TableCell>
            </TableRow>
          ) : (
            domains.map((domain, index) => (
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
  )
}
