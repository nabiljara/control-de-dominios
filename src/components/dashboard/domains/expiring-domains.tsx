import { getLastExpiringDomains } from "@/actions/domains-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export async function ExpiringDomains() {
  const domains = await getLastExpiringDomains();
  return (
    <div className="space-y-2">
      <div className="h-fit">
        <div className="h-fit rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="rounded-tl-lg">Dominio</TableHead>
                <TableHead className="text-center">Cliente</TableHead>
                <TableHead className="text-center">Vence</TableHead>
                <TableHead className="rounded-tr-lg text-center">
                  Días Restantes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain, index) => (
                <TableRow key={domain.id}>
                  <TableCell
                    className={`font-medium ${index === domains.length - 1 ? "rounded-bl-lg" : ""}`}
                  >
                    <Link
                      href={`/domains/${domain.id}`}
                      className="hover:underline"
                    >
                      {domain.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {domain.client.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(domain.expirationDate).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-center ${index === domains.length - 1 ? "rounded-br-lg" : ""}`}
                  >
                    {(() => {
                      const expirationDate = new Date(domain.expirationDate);
                      const today = new Date();
                      expirationDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);

                      const diffInMs =
                        expirationDate.getTime() - today.getTime();
                      const daysLeft = Math.ceil(
                        diffInMs / (1000 * 60 * 60 * 24),
                      );

                      return (
                        <span
                          className={`font-medium ${daysLeft <= 10 ? "text-red-500" : ""}`}
                        >
                          {daysLeft}
                        </span>
                      );
                    })()}
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
