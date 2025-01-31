"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { z } from "zod"

export const providerSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string()
})
type Provider = z.infer<typeof providerSchema>

export const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <div className="w-[500px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => (
      <div className="w-[500px]">
        {row.getValue("url")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true
  }
]
