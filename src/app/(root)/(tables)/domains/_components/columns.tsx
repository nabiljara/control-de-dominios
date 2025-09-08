"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Domain } from "@/db/schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { domainStatus, statusConfig } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Box, CalendarArrowDown, CheckCircle, Globe, Handshake } from "lucide-react";

export const columns: ColumnDef<Domain>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N°" className="w-8" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" icon={<Globe className="w-4 h-4" />} />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" icon={<Box className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const provider: { id: number; name: string } = row.getValue("provider");
      return (
        <>
          <span className="max-w-[500px] font-medium truncate">
            {provider.name || "Sin proveedor"}
          </span>
        </>
      );
    },
    filterFn: (row, id, value) => {
      const provider: { id: number; name: string } = row.getValue(id);
      return value.includes(provider.name);
    },
    enableSorting: false,
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" icon={<Handshake className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const client: { id: number; name: string } = row.getValue("client");
      return (
        <span className="max-w-[500px] font-medium truncate">
          {client.name || "Sin cliente"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      const client: { id: number; name: string } = row.getValue(id);
      return value.includes(client.name);
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" icon={<CheckCircle className="w-4 h-4" />} />
    ),
    cell: ({ row }) => {
      const status = domainStatus.find(
        (status) => status === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <Badge
          variant='outline'
          className=
          {`${statusConfig[row.getValue("status") as keyof typeof statusConfig].color} truncate`}

        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de vencimiento" icon={<CalendarArrowDown className="w-4 h-4" />} />
    ),
    cell: ({ row }) => (
      <span>{formatDate(row.getValue("expirationDate"))}</span>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];
