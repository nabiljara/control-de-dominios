"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Box, ExternalLink } from "lucide-react";
import { Provider } from "@/db/schema";

export const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" icon={<Box />} />
    ),
    cell: ({ row }) => <div className="w-[300px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="URL"
        icon={<ExternalLink />}
      />
    ),
    cell: ({ row }) => <div className="w-[500px]">{row.getValue("url")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
];
