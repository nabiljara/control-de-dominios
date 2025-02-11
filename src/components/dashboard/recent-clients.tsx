import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { sizeConfig } from "@/constants";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Button } from "../ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface RecentClientsProps {
  clients: {
    id: number;
    name: string;
    size: "Chico" | "Mediano" | "Grande";
    domainCount: number;
    createdAt: string;
  }[];
  loading: boolean;
}
export function RecentClients({ clients, loading }: RecentClientsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  const indexOfLastDomain = currentPage * itemsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstDomain, indexOfLastDomain);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="spcae-y-2">
      <div className="h-[300px]">
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
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : currentClients.map((client, index) => (
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
                        <Badge className={sizeConfig[client.size].color}>
                          {client.size}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {client.domainCount}
                      </TableCell>
                      <TableCell
                        className={`text-center ${index === clients.length - 1 ? "rounded-bl-lg" : ""}`}
                      >
                        {new Date(client.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {!loading && (
        <div className="flex items-center justify-between pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <p className="text-sm text-muted-foreground">
                {currentPage} de {totalPages}
              </p>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
