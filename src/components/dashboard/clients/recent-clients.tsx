import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../../ui/badge";
import { sizeConfig } from "@/constants";
import Link from "next/link";
import { getLatestClients } from "@/actions/client-actions";

export async function RecentClients() {
  const clients = await getLatestClients();
  return (
    <div className="spcae-y-2">
      <div className="h-fit">
        <div className="h-fit rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="rounded-tl-lg">Cliente</TableHead>
                <TableHead className="text-center">Tamaño</TableHead>
                <TableHead className="text-center">
                  Dominios Registrados
                </TableHead>
                <TableHead className="rounded-tr-lg text-center">
                  Fecha de Registro
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={client.id}>
                  <TableCell
                    className={`flex items-center gap-2 ${index === clients.length - 1 ? "rounded-bl-lg" : ""}`}
                  >
                    <Link
                      href={`/clients/${client.id}`}
                      className="hover:underline"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={sizeConfig[client.size].color}
                    >
                      {client.size}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {client.domainCount}
                  </TableCell>
                  <TableCell
                    className={`text-center ${index === clients.length - 1 ? "rounded-bl-lg" : ""}`}
                  >
                    {new Date(client.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
