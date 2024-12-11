import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

type Domain = {
  id: number
  name: string
  status: "Activo" | "Inactivo" | "Suspendido"
  createdAt: string
  updatedAt: string
  clientId: number
  providerId: number
  contactId: number
  providerRegistrationDate: string
  expirationDate: string
  client: {
    name: string
  }
  provider: {
    name: string
  }
}

type DomainTableProps = {
  domains: Domain[]
}

export function DomainTable({ domains }: DomainTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dominio</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Proveedor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.length > 0 ? (
          domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>{domain.name}</TableCell>
              <TableCell>{domain.status}</TableCell>
              <TableCell>{domain.client.name}</TableCell>
              <TableCell>{domain.provider.name}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No hay dominios asociados a este contacto.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
