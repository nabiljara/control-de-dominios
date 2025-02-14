"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DomainWithRelations } from "@/db/schema";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useState } from "react";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";

interface ExpiringDomainsProps {
  domains: Omit<DomainWithRelations, "contact" | "accessData" | "history">[];
  loading: boolean;
}

export function ExpiringDomains({
  domains = [],
  loading,
}: ExpiringDomainsProps) {
  // const safeDomains = Array.isArray(domains) ? domains : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(domains.length / itemsPerPage);

  const indexOfLastDomain = currentPage * itemsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - itemsPerPage;
  const currentDomains = domains.slice(indexOfFirstDomain, indexOfLastDomain);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-2">
      <div className="h-[300px]">
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
                : currentDomains.map((domain, index) => (
                    <TableRow key={domain.id}>
                      <TableCell
                        className={`font-medium ${index === currentDomains.length - 1 ? "rounded-bl-lg" : ""}`}
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
                        className={`text-center ${index === currentDomains.length - 1 ? "rounded-br-lg" : ""}`}
                      >
                        {(() => {
                          const expirationDate = new Date(
                            domain.expirationDate,
                          );
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
