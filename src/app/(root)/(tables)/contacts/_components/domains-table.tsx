import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DomainWithRelations } from "@/db/schema";

type DomainTableProps = {
  domains: Omit<
    DomainWithRelations,
    "history" | "domainAccess" | "contact" | "accessData"
  >[];
};

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
  );
}
