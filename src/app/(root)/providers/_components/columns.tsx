"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        <a
          className="hover:underline"
          href={
            (row.getValue("url") as string).startsWith("http://") ||
            (row.getValue("url") as string).startsWith("https://")
              ? row.getValue("url")
              : `https://${row.getValue("url")}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.getValue("url")}
        </a>
      </div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Detalle" />
    ),
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        href={"providers/" + row.getValue("id")}
      />
    )
  }
]
