"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { formatDate } from "@/lib/utils"
import { Audit } from "@/db/schema"


export const columns: ColumnDef<Audit>[] = [
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
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      const user: { id: string, name: string } = row.getValue("user")
      if (user) {
        return (
          <span className="max-w-[500px] font-medium truncate">
            {user.name}
          </span>
        )
      } else {
        return (
          <span className="max-w-[500px] font-medium text-destructive truncate">
            Sin usuario
          </span>
        )
      }
    },
    filterFn: (row, id, value) => {
      const user: { id: string, name: string } = row.getValue(id)
      if (user) {
        return value.includes(user.name)
      } else {
        return value.includes('Sin usuario')
      }
    }
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acción" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("action")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "entity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entidad" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("entity")}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de movimiento" />
    ),
    cell: ({ row }) => (
      <div>
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ver" />
    ),
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        href={"audits/" + row.getValue("id")}
      />
    )
  }
]
