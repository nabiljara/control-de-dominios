"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Domain } from "@/db/schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { formatDate } from "@/lib/utils";
import { domainStatus, statusConfig } from "@/constants";
import { Badge } from "@/components/ui/badge";

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
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" />
    ),
    cell: ({ row }) => {
      const provider: { id: number; name: string } = row.getValue("provider");
      return (
        <>
          <span className="max-w-[500px] truncate font-medium">
            {provider.name || "Sin proveedor"}
          </span>
        </>
      );
    },
    filterFn: (row, id, value) => {
      const provider: { id: number; name: string } = row.getValue(id);
      return value.includes(provider.id.toString());
    },
    enableSorting: false,
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const client: { id: number; name: string } = row.getValue("client");
      return (
        <span className="max-w-[500px] truncate font-medium">
          {client.name || "Sin cliente"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      const client: { id: number; name: string } = row.getValue(id);
      return value.includes(client.id.toString());
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
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
          className={
            statusConfig[row.getValue("status") as keyof typeof statusConfig]
              .color
          }
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de registro" />
    ),
    cell: ({ row }) => <span>{formatDate(row.getValue("createdAt"))}</span>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de vencimiento" />
    ),
    cell: ({ row }) => (
      <span>{formatDate(row.getValue("expirationDate"))}</span>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];
